import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log('=== Z-API Sign Instance Called (v8-EMERGENCY-FIX) ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Timestamp:', new Date().toISOString());
  console.log('🚨 EMERGENCY: Implementing aggressive instance signing with development mode');

  // 🔥 CRITICAL DEBUG: Log ALL environment variables to see what's available
  const allEnv = Deno.env.toObject();
  console.log('🔍 ALL ENVIRONMENT VARIABLES WITH TOKEN:');
  Object.keys(allEnv).forEach(key => {
    if (key.includes('ZAPI') || key.includes('TOKEN')) {
      console.log(`  ${key}: ${allEnv[key] ? `[${allEnv[key].length} chars] = ${allEnv[key].substring(0, 10)}...` : 'NULL/UNDEFINED'}`);
    }
  });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Environment variables check
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
      throw new Error('Missing required Supabase environment variables');
    }

    // 🔥 CRITICAL: Enhanced token detection with multiple strategies
    let zapiToken = null;
    const possibleTokenVars = [
      'ZAPI_PARTNER_TOKEN',
      'ZAPI_TOKEN', 
      'Z_API_PARTNER_TOKEN',
      'Z_API_TOKEN',
      'PARTNER_TOKEN',
      'ZAPI_API_TOKEN',
      'Z_API_INTEGRATOR_TOKEN'
    ];
    
    console.log('🔍 SEARCHING FOR ZAPI TOKEN WITH ENHANCED DETECTION:');
    for (const varName of possibleTokenVars) {
      const value = Deno.env.get(varName);
      if (value && value.trim()) {
        console.log(`  ${varName}: FOUND [${value.length} chars] = ${value.substring(0, 20)}...`);
        if (!zapiToken) {
          zapiToken = value.trim();
          console.log(`✅ SELECTED TOKEN FROM: ${varName}`);
        }
      } else {
        console.log(`  ${varName}: NOT FOUND`);
      }
    }
    
    // Check for force production mode
    const forceProduction = Deno.env.get('ZAPI_FORCE_PRODUCTION') === 'true';
    const devModeEnv = Deno.env.get('ZAPI_DEVELOPMENT_MODE');
    
    console.log('🔍 MODE CONFIGURATION:');
    console.log(`  ZAPI_DEVELOPMENT_MODE: ${devModeEnv || 'NULL/UNDEFINED'}`);
    console.log(`  ZAPI_FORCE_PRODUCTION: ${forceProduction ? 'true' : 'false'}`);
    
    // Enhanced mode decision: Force production if token exists OR if explicitly forced
    const isDevelopmentMode = (devModeEnv === 'true') && !forceProduction && !zapiToken;
    console.log('🎯 FINAL MODE DECISION:', { 
      isDevelopmentMode, 
      hasToken: !!zapiToken, 
      tokenLength: zapiToken?.length || 0,
      devModeEnv 
    });

    // Authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Parse request body
    const requestBody = await req.json();
    const { instanceId } = requestBody;
    
    if (!instanceId) {
      throw new Error('Instance ID is required');
    }

    console.log('Signing instance:', instanceId);

    // Create user client
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    if (isDevelopmentMode) {
      console.log('🚨 EMERGENCY DEVELOPMENT MODE - simulating enhanced sign');
      
      // Update instance to signed status in development mode
      const { data: updatedInstance, error: updateError } = await supabaseUser
        .from('whatsapp_instances')
        .update({ 
          signed: true,
          status: 'connected', // Changed from 'signed' to 'connected'
          updated_at: new Date().toISOString()
        })
        .eq('instance_id', instanceId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ Emergency database error updating instance:', updateError);
        throw new Error(`Emergency database error: ${updateError.message}`);
      }

      console.log('✅ Emergency: Instance signed and connected successfully:', updatedInstance);

      return new Response(JSON.stringify({
        success: true,
        instance: updatedInstance,
        message: '🚨 Emergency: Instance signed successfully - Development Mode Active',
        developmentMode: true,
        emergencyMode: true,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.log('✅ RUNNING IN PRODUCTION MODE - calling real Z-API sign');
      
      // Real Z-API sign call
      try {
        const zapiBaseUrl = Deno.env.get('ZAPI_BASE_URL') || 'https://api.z-api.io';
        const signUrl = `${zapiBaseUrl}/instances/integrator/sign`;
        
        const signPayload = {
          instanceId: instanceId,
        };

        const signResponse = await fetch(signUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': zapiToken,
          },
          body: JSON.stringify(signPayload),
        });

        console.log('Z-API Sign response status:', signResponse.status);

        if (!signResponse.ok) {
          const errorText = await signResponse.text();
          console.error('Z-API sign error:', {
            status: signResponse.status,
            statusText: signResponse.statusText,
            body: errorText
          });
          throw new Error(`Z-API sign error: ${signResponse.status} - ${errorText}`);
        }

        const signData = await signResponse.json();
        console.log('Z-API sign response:', signData);

        // Update instance status in database
        const { data: updatedInstance, error: updateError } = await supabaseUser
          .from('whatsapp_instances')
          .update({ 
            signed: true,
            status: 'signed'
          })
          .eq('instance_id', instanceId)
          .eq('user_id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('Database error updating instance:', updateError);
          throw new Error(`Database error: ${updateError.message}`);
        }

        console.log('Instance signed successfully:', updatedInstance);

        return new Response(JSON.stringify({
          success: true,
          instance: updatedInstance,
          zapiResponse: signData,
          message: 'Instance signed successfully via Z-API',
          developmentMode: false,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error in Z-API sign:', error);
        throw error;
      }
    }

  } catch (error) {
    console.error('Error in zapi-sign-instance:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});