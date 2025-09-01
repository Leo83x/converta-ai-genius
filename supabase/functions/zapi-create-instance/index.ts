import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log('Z-API Create Instance called - Start');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    console.log('Starting main request processing...');
    
    // Test environment variables first
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const partnerToken = Deno.env.get('ZAPI_PARTNER_TOKEN');
    
    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      hasPartnerToken: !!partnerToken,
      partnerTokenLength: partnerToken?.length || 0
    });

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    // Create admin client for auth verification
    console.log('Creating Supabase admin client...');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header');
    }
    
    console.log('Auth header present, length:', authHeader.length);

    // Verify user authentication
    console.log('Verifying user authentication...');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    if (!user) {
      console.error('No user found in token');
      throw new Error('User not found');
    }

    console.log('User authenticated successfully:', user.id);

    // Parse request body
    console.log('Parsing request body...');
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body parsed:', requestBody);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error(`Invalid JSON in request body: ${parseError.message}`);
    }

    const { instanceName } = requestBody;
    console.log('Instance name from request:', instanceName);

    if (!instanceName || typeof instanceName !== 'string' || instanceName.trim() === '') {
      throw new Error('Instance name is required and must be a non-empty string');
    }

    // Create user client for RLS-compliant operations
    if (!supabaseAnonKey) {
      throw new Error('Missing SUPABASE_ANON_KEY');
    }

    console.log('Creating user client...');
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get Z-API Partner configuration
    const partnerToken = Deno.env.get('ZAPI_PARTNER_TOKEN');
    const zapiBaseUrl = Deno.env.get('ZAPI_BASE_URL') || 'https://api.z-api.io';
    
    console.log('Z-API Configuration:', {
      hasPartnerToken: !!partnerToken,
      tokenLength: partnerToken?.length || 0,
      zapiBaseUrl,
      tokenPreview: partnerToken ? `${partnerToken.substring(0, 20)}...` : 'NOT_FOUND'
    });

    if (!partnerToken) {
      console.error('ZAPI_PARTNER_TOKEN not found in environment');
      throw new Error('Z-API Partner token not configured. Please add the ZAPI_PARTNER_TOKEN secret.');
    }

    // Create instance via Z-API Partner API with correct headers and endpoint
    console.log('Creating real instance via Z-API Partner');
    const requestPayload = {
      instanceName: instanceName,
      plan: "standard"
    };
    
    console.log('Z-API Partner request:', {
      url: `${zapiBaseUrl}/instances`,
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': '[HIDDEN]'
      },
      payload: requestPayload
    });
    
    const zapiResponse = await fetch(`${zapiBaseUrl}/instances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': partnerToken,
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('Z-API Response Status:', zapiResponse.status);
    console.log('Z-API Response Headers:', Object.fromEntries(zapiResponse.headers.entries()));

    if (!zapiResponse.ok) {
      const errorText = await zapiResponse.text();
      console.error('Z-API Partner error details:', {
        status: zapiResponse.status,
        statusText: zapiResponse.statusText,
        errorBody: errorText,
        headers: Object.fromEntries(zapiResponse.headers.entries())
      });
      throw new Error(`Z-API Partner error: ${zapiResponse.status} - ${errorText}`);
    }

    const zapiData = await zapiResponse.json();
    console.log('Z-API Partner response:', zapiData);

    // Extract instance data from Z-API response
    const instanceId = zapiData.instance?.instanceId || zapiData.instanceId || `instance_${Date.now()}`;
    const apiToken = zapiData.instance?.token || zapiData.token || `token_${Date.now()}`;

    // Save instance data to Supabase
    console.log('Saving instance to database...');
    console.log('Insert data:', {
      user_id: user.id,
      instance_id: instanceId,
      api_token: apiToken,
      signed: false,
      status: 'created',
    });

    const { data: instanceData, error: insertError } = await supabaseUser
      .from('whatsapp_instances')
      .insert({
        user_id: user.id,
        instance_id: instanceId,
        api_token: apiToken,
        signed: false,
        status: 'created',
      })
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('Database insert error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      throw new Error(`Database error: ${insertError.message}`);
    }

    if (!instanceData) {
      console.error('No instance data returned from database');
      throw new Error('Failed to create instance in database - no data returned');
    }

    console.log('Instance created successfully in database:', instanceData);

    const response = {
      success: true,
      instance: {
        id: instanceData.id,
        instanceId: instanceData.instance_id,
        apiToken: instanceData.api_token,
        signed: instanceData.signed,
        status: instanceData.status,
      },
      developmentMode: false,
      message: 'Instance created successfully via Z-API Partner'
    };

    console.log('Sending success response:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== ERROR IN ZAPI-CREATE-INSTANCE ===');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    console.error('Error details:', error);
    
    // Determine error type and provide appropriate response
    let statusCode = 500;
    let errorMessage = error.message || 'Unknown error occurred';
    
    if (errorMessage.includes('authorization') || errorMessage.includes('Authentication') || errorMessage.includes('User not found')) {
      statusCode = 401;
    } else if (errorMessage.includes('required') || errorMessage.includes('Invalid JSON') || errorMessage.includes('must be')) {
      statusCode = 400;
    }
    
    const errorResponse = { 
      success: false, 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      details: error.name || 'Unknown error type'
    };

    console.log('Sending error response:', errorResponse);
    
    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});