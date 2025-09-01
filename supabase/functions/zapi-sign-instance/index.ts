import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  console.log('=== Z-API Sign Instance Called (v2) ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Timestamp:', new Date().toISOString());

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

    const { instanceId } = await req.json();
    console.log('Signing instance:', instanceId);

    // Find instance in database
    const { data: instanceData, error: findError } = await supabaseUser
      .from('whatsapp_instances')
      .select('*')
      .eq('instance_id', instanceId)
      .eq('user_id', user.id)
      .single();

    if (findError || !instanceData) {
      throw new Error('Instance not found');
    }

    // Get Z-API Partner configuration
    const partnerToken = Deno.env.get('ZAPI_PARTNER_TOKEN');
    const zapiBaseUrl = Deno.env.get('ZAPI_BASE_URL') || 'https://api.z-api.io';
    const developmentMode = Deno.env.get('ZAPI_DEVELOPMENT_MODE') === 'true';
    
    console.log('Z-API Environment check:', {
      hasPartnerToken: !!partnerToken,
      hasBaseUrl: !!zapiBaseUrl,
      developmentMode,
      allZapiKeys: Object.keys(Deno.env.toObject()).filter(key => key.includes('ZAPI')),
    });
    
    if (partnerToken) {
      console.log('ZAPI Token found - length:', partnerToken.length, 'starts with:', partnerToken.substring(0, 8));
    } else {
      console.log('ZAPI_PARTNER_TOKEN is null/undefined');
    }

    if (!developmentMode && partnerToken) {
      console.log('Signing real instance via Z-API Partner');
      
      // Sign instance via Z-API Partner API
      const signUrl = `${zapiBaseUrl}/instances/${instanceData.instance_id}/token/${instanceData.api_token}/integrator/on-demand/subscription`;
      
      const zapiResponse = await fetch(signUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${partnerToken}`,
        },
      });

      if (!zapiResponse.ok) {
        const errorText = await zapiResponse.text();
        console.error('Z-API Partner sign error:', errorText);
        throw new Error(`Z-API Partner sign error: ${zapiResponse.status} ${errorText}`);
      }

      const zapiData = await zapiResponse.json();
      console.log('Z-API Partner sign response:', zapiData);
    } else {
      console.log('Running in development mode - simulating sign');
    }

    // Update instance status in database
    const { data: updatedInstance, error: updateError } = await supabaseUser
      .from('whatsapp_instances')
      .update({
        signed: true,
        status: 'signed',
      })
      .eq('id', instanceData.id)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Database error: ${updateError.message}`);
    }

    console.log('Instance signed successfully:', updatedInstance);

    return new Response(JSON.stringify({
      success: true,
      instance: {
        id: updatedInstance.id,
        instanceId: updatedInstance.instance_id,
        signed: updatedInstance.signed,
        status: updatedInstance.status,
      },
      developmentMode,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

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