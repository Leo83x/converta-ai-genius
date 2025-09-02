import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log('=== Z-API Create Instance Called (v6-FINAL-TOKEN-FIX) ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Timestamp:', new Date().toISOString());
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // 🔥 CRITICAL DEBUG: Log ALL environment variables to see what's available
  const allEnv = Deno.env.toObject();
  console.log('🔍 ALL ENVIRONMENT VARIABLES:');
  Object.keys(allEnv).forEach(key => {
    if (key.includes('ZAPI') || key.includes('TOKEN')) {
      console.log(`  ${key}: ${allEnv[key] ? `[${allEnv[key].length} chars]` : 'NULL/UNDEFINED'}`);
    }
  });

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
    
    // Environment variables check with advanced debugging
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    console.log('🔍 ENHANCED ZAPI TOKEN DETECTION:');
    
    // Primary token check with fail-fast approach
    const zapiToken = Deno.env.get('ZAPI_PARTNER_TOKEN');
    const hasToken = !!zapiToken && zapiToken.length > 0;
    
    console.log(`ZAPI_PARTNER_TOKEN: ${hasToken ? 'PRESENT' : 'ABSENT'}`);
    
    // Check for force production mode
    const forceProduction = Deno.env.get('ZAPI_FORCE_PRODUCTION') === 'true';
    const devModeEnv = Deno.env.get('ZAPI_DEVELOPMENT_MODE');
    
    console.log('🔍 MODE CONFIGURATION:');
    console.log(`  ZAPI_DEVELOPMENT_MODE: ${devModeEnv || 'NULL/UNDEFINED'}`);
    console.log(`  ZAPI_FORCE_PRODUCTION: ${forceProduction ? 'true' : 'false'}`);
    
    // Enhanced mode decision: Force production if token exists OR if explicitly forced
    const isDevelopmentMode = (devModeEnv === 'true') && !forceProduction && !hasToken;
    console.log('🎯 FINAL MODE DECISION:', { 
      isDevelopmentMode, 
      hasToken, 
      tokenLength: zapiToken?.length || 0,
      devModeEnv 
    });
    
    // Fail fast if no token is available in production mode
    if (!hasToken && !isDevelopmentMode) {
      console.error("❌ CRITICAL: ZAPI_PARTNER_TOKEN not accessible");
      console.error("This indicates a secret configuration or deployment issue");
      console.error("Run the env-check function to diagnose the problem");
      
      return new Response(JSON.stringify({
        success: false,
        error: "ZAPI_PARTNER_TOKEN not accessible",
        isDevelopmentMode,
        troubleshooting: {
          message: "Secret not accessible in Edge Function runtime",
          steps: [
            "1. Verify secret is set: supabase secrets list --project-ref xekxewtggioememydenu",
            "2. Set if missing: supabase secrets set ZAPI_PARTNER_TOKEN='your_token' --project-ref xekxewtggioememydenu", 
            "3. Redeploy functions: supabase functions deploy --project-ref xekxewtggioememydenu",
            "4. Test with env-check function"
          ]
        }
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
    
    const detectedToken = zapiToken;
    
    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error('Missing required Supabase environment variables');
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
    console.log('Using mode:', isDevelopmentMode ? 'DEVELOPMENT' : 'PRODUCTION');
    
    let zapiData;
    
    if (isDevelopmentMode) {
      console.log('✅ RUNNING IN DEVELOPMENT MODE - creating mock instance');
      
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
      console.log('✅ RUNNING IN PRODUCTION MODE - calling real Z-API with token');
      
      // Real Z-API call
        const zapiResponse = await fetch('https://api.z-api.io/instances/integrator/on-demand', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': detectedToken,
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
      developmentMode: isDevelopmentMode,
      message: isDevelopmentMode
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