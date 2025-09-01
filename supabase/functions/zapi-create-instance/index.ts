import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  console.log('Z-API Create Instance called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client for auth verification
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Create user client for RLS-compliant operations
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    const { instanceName } = await req.json();
    console.log('Creating instance:', instanceName);

    // Get Z-API Partner configuration
    const partnerToken = Deno.env.get('ZAPI_PARTNER_TOKEN');
    const zapiBaseUrl = Deno.env.get('ZAPI_BASE_URL') || 'https://api.z-api.io';
    const developmentMode = false; // Forçar modo produção
    
    console.log('Z-API Configuration:', {
      hasPartnerToken: !!partnerToken,
      tokenLength: partnerToken?.length || 0,
      zapiBaseUrl,
      developmentMode,
      tokenPreview: partnerToken ? `${partnerToken.substring(0, 20)}...` : 'NOT_FOUND'
    });

    let instanceId: string;
    let apiToken: string;
    let dueDate: string;

    if (!partnerToken) {
      console.error('ZAPI_PARTNER_TOKEN not found in environment');
      throw new Error('Z-API Partner token not configured. Please add the ZAPI_PARTNER_TOKEN secret.');
    }

    if (developmentMode) {
      console.log('Running in development mode - using mock data');
      
      // Mock instance creation for development
      instanceId = `mock_instance_${Date.now()}`;
      apiToken = `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      dueDate = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(); // 48 hours from now
    } else {
      console.log('Creating real instance via Z-API Partner');
      console.log('Request payload:', {
        name: instanceName,
        sessionName: `Converta+ - ${instanceName}`,
        deliveryCallbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/zapi-webhook`,
      });
      
      // Create instance via Z-API Partner API
      const zapiResponse = await fetch(`${zapiBaseUrl}/instances/integrator/on-demand`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': partnerToken,
        },
        body: JSON.stringify({
          name: instanceName,
          sessionName: `Converta+ - ${instanceName}`,
          deliveryCallbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/zapi-webhook`,
          receivedCallbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/zapi-webhook`,
          disconnectedCallbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/zapi-webhook`,
          connectedCallbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/zapi-webhook`,
          messageStatusCallbackUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/zapi-webhook`,
          isDevice: false,
          businessDevice: true,
        }),
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

      instanceId = zapiData.id;
      apiToken = zapiData.token;
      dueDate = zapiData.due;
    }

    // Save instance data to Supabase
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
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log('Instance created successfully:', instanceData);

    return new Response(JSON.stringify({
      success: true,
      instance: {
        id: instanceData.id,
        instanceId: instanceData.instance_id,
        apiToken: instanceData.api_token,
        signed: instanceData.signed,
        status: instanceData.status,
      },
      developmentMode,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in zapi-create-instance:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});