import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log('=== Z-API Create Instance Called (v2) ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Timestamp:', new Date().toISOString());
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
    const devMode = Deno.env.get('ZAPI_DEVELOPMENT_MODE');
    
    console.log('Environment check (detailed):', {
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      hasPartnerToken: !!partnerToken,
      hasDevMode: !!devMode,
      allEnvKeys: Object.keys(Deno.env.toObject()).filter(key => 
        key.includes('ZAPI') || key.includes('SUPABASE')
      ),
    });
    
    // Log raw token for debugging (masked for security)
    if (partnerToken) {
      console.log('Token found - length:', partnerToken.length, 'starts with:', partnerToken.substring(0, 8));
    } else {
      console.log('ZAPI_PARTNER_TOKEN is null/undefined');
      console.log('All available env vars:', Object.keys(Deno.env.toObject()));
    }

    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    // Debug: List ALL environment variables to see what's available
    const allEnvVars = Deno.env.toObject();
    console.log('ALL ENV VARS:', Object.keys(allEnvVars));
    console.log('ZAPI related vars:', Object.keys(allEnvVars).filter(k => k.includes('ZAPI')));
    
    // Try different possible names for the token
    const possibleTokenNames = [
      'ZAPI_PARTNER_TOKEN',
      'ZAPI_TOKEN', 
      'PARTNER_TOKEN',
      'Z_API_TOKEN',
      'Z_API_PARTNER_TOKEN'
    ];
    
    let actualToken = null;
    let foundTokenName = null;
    
    for (const tokenName of possibleTokenNames) {
      const token = Deno.env.get(tokenName);
      if (token) {
        actualToken = token;
        foundTokenName = tokenName;
        break;
      }
    }
    
    console.log('Token search results:', {
      foundToken: !!actualToken,
      foundTokenName,
      tokenLength: actualToken?.length || 0
    });

    if (!actualToken) {
      // Check if we're in development mode or should use fallback
      const devMode = Deno.env.get('ZAPI_DEVELOPMENT_MODE');
      console.log('No token found, development mode:', devMode);
      
      if (devMode !== 'true') {
        console.error('CRITICAL: No ZAPI token found in any expected environment variable names');
        console.log('Available environment variables:', Object.keys(allEnvVars));
        throw new Error('ZAPI Partner Token not found - please check Supabase secrets configuration');
      }
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
    
    const requestPayload = {
      name: instanceName.trim(),
    };
    
    console.log('Z-API request payload:', requestPayload);
    console.log('Using token:', foundTokenName, 'Length:', actualToken?.length || 0);
    
    // Check development mode first
    const devMode = Deno.env.get('ZAPI_DEVELOPMENT_MODE');
    
    let zapiData;
    
    if (devMode === 'true' || !actualToken) {
      console.log('Running in development mode - creating mock instance');
      
      // Generate mock instance data
      const mockInstanceId = `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const mockToken = `dev_token_${Math.random().toString(36).substr(2, 16)}`;
      
      zapiData = {
        id: mockInstanceId,
        token: mockToken,
        due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        status: 'created'
      };
      
      console.log('Mock Z-API response created:', zapiData);
    } else {
      // Real Z-API call
      const zapiResponse = await fetch('https://api.z-api.io/instances/integrator/on-demand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${actualToken}`,
        },
        body: JSON.stringify(requestPayload),
      });
      
      console.log('Z-API Response Status:', zapiResponse.status);
      console.log('Z-API Response Headers:', Object.fromEntries(zapiResponse.headers.entries()));

      if (!zapiResponse.ok) {
        const errorText = await zapiResponse.text();
        console.error('Z-API error:', {
          status: zapiResponse.status,
          statusText: zapiResponse.statusText,
          body: errorText
        });
        throw new Error(`Z-API error: ${zapiResponse.status} - ${errorText}`);
      }

      zapiData = await zapiResponse.json();
      console.log('Z-API response structure:', JSON.stringify(zapiData, null, 2));
    }

    // Extract instance data from Z-API response
    // Z-API Partner response should contain: { id, token, due }
    if (!zapiData.id || !zapiData.token) {
      console.error('Invalid Z-API response structure:', zapiData);
      throw new Error(`Invalid Z-API response: missing id or token. Response: ${JSON.stringify(zapiData)}`);
    }

    const instanceId = zapiData.id;
    const apiToken = zapiData.token;
    
    console.log('Extracted data:', { instanceId, tokenLength: apiToken?.length });

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
      developmentMode: devMode === 'true' || !actualToken,
      message: devMode === 'true' || !actualToken 
        ? 'Instance created successfully in development mode' 
        : 'Instance created successfully via Z-API Partner'
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