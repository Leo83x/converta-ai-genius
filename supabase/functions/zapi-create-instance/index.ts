import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log('=== Z-API Create Instance Called ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // 🔥 CRITICAL: Handle OPTIONS first, before any other logic
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight request');
    return new Response('ok', { 
      headers: corsHeaders,
      status: 200 
    });
  }

  try {
    console.log('Processing main request...');
    
    // Environment variables check
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const partnerToken = Deno.env.get('ZAPI_PARTNER_TOKEN');
    
    console.log('Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      hasPartnerToken: !!partnerToken,
    });

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    if (!partnerToken) {
      throw new Error('ZAPI_PARTNER_TOKEN not found in environment');
    }

    // Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    console.log('Creating Supabase admin client...');
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Verifying user authentication...');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    if (!user) {
      throw new Error('User not found');
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    console.log('Parsing request body...');
    const requestBody = await req.json();
    const { instanceName } = requestBody;
    
    console.log('Instance name:', instanceName);

    if (!instanceName || typeof instanceName !== 'string' || instanceName.trim() === '') {
      throw new Error('Instance name is required and must be a non-empty string');
    }

    // Create Z-API instance
    console.log('Creating Z-API instance...');
    const zapiBaseUrl = Deno.env.get('ZAPI_BASE_URL') || 'https://api.z-api.io';
    
    const requestPayload = {
      instanceName: instanceName.trim(),
      plan: "standard"
    };
    
    console.log('Z-API request:', {
      url: `${zapiBaseUrl}/instances`,
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

    if (!zapiResponse.ok) {
      const errorText = await zapiResponse.text();
      console.error('Z-API error:', {
        status: zapiResponse.status,
        statusText: zapiResponse.statusText,
        body: errorText
      });
      throw new Error(`Z-API error: ${zapiResponse.status} - ${errorText}`);
    }

    const zapiData = await zapiResponse.json();
    console.log('Z-API response:', zapiData);

    // Extract instance data from Z-API response
    const instanceId = zapiData.instance?.instanceId || zapiData.instanceId || `instance_${Date.now()}`;
    const apiToken = zapiData.instance?.token || zapiData.token || `token_${Date.now()}`;

    // Save to database
    console.log('Saving to database...');
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
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
      console.error('Database error:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    if (!instanceData) {
      throw new Error('Failed to save instance to database');
    }

    console.log('Instance created successfully:', instanceData.id);

    const response = {
      success: true,
      instance: {
        id: instanceData.id,
        instanceId: instanceData.instance_id,
        apiToken: instanceData.api_token,
        signed: instanceData.signed,
        status: instanceData.status,
      },
      message: 'Instance created successfully via Z-API Partner'
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    
    let statusCode = 500;
    if (error.message.includes('authorization') || error.message.includes('Authentication')) {
      statusCode = 401;
    } else if (error.message.includes('required') || error.message.includes('Invalid')) {
      statusCode = 400;
    }
    
    const errorResponse = { 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});