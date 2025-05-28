
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client for auth verification
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

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

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { sessionName } = await req.json();

    console.log('Checking status for session:', sessionName);

    // Get Evolution API configuration with validation
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    
    console.log('Evolution API Key exists:', !!evolutionApiKey);
    console.log('Evolution API URL from env:', evolutionApiUrl);
    
    if (!evolutionApiKey) {
      throw new Error('Evolution API key not configured');
    }

    if (!evolutionApiUrl) {
      throw new Error('Evolution API URL not configured');
    }

    // Validate URL format
    try {
      new URL(evolutionApiUrl);
    } catch (urlError) {
      console.error('Invalid Evolution API URL format:', evolutionApiUrl);
      throw new Error('Evolution API URL has invalid format');
    }

    console.log('Using Evolution API URL:', evolutionApiUrl);

    // Check status in Evolution API
    const statusUrl = `${evolutionApiUrl}/instance/fetchInstances/${sessionName}`;
    console.log('Checking status at:', statusUrl);
    
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      }
    });

    console.log('Status response status:', statusResponse.status);

    if (!statusResponse.ok) {
      console.error('Evolution API status error:', statusResponse.status);
      
      // Try to get QR code directly if status check fails
      const qrUrl = `${evolutionApiUrl}/instance/qrcode/${sessionName}`;
      console.log('Trying QR code endpoint:', qrUrl);
      
      const qrResponse = await fetch(qrUrl, {
        method: 'GET',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      let qrCode = null;
      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        qrCode = qrData.qrcode || qrData.base64 || null;
        console.log('QR Code found via direct endpoint:', !!qrCode);
      }

      return new Response(JSON.stringify({
        success: true,
        status: 'pending',
        qr_code: qrCode,
        connection_status: 'connecting'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const statusData = await statusResponse.json();
    console.log('Status response:', statusData);

    // Determine status based on response
    let status = 'pending';
    let qrCode = null;

    if (statusData.connectionStatus === 'open') {
      status = 'connected';
    } else if (statusData.connectionStatus === 'connecting' || statusData.connectionStatus === 'close') {
      status = 'pending';
      // Get QR code
      qrCode = statusData.qrcode || statusData.qr || null;
      
      // If no QR code in response, try to fetch directly
      if (!qrCode) {
        const qrUrl = `${evolutionApiUrl}/instance/qrcode/${sessionName}`;
        console.log('Fetching QR code from:', qrUrl);
        
        const qrResponse = await fetch(qrUrl, {
          method: 'GET',
          headers: {
            'apikey': evolutionApiKey,
            'Content-Type': 'application/json',
          }
        });

        if (qrResponse.ok) {
          const qrData = await qrResponse.json();
          qrCode = qrData.qrcode || qrData.base64 || null;
          console.log('QR Code from direct endpoint:', !!qrCode);
        }
      }
    }

    // Update database using user client (RLS compliant)
    const { error: updateError } = await supabaseUser
      .from('evolution_tokens')
      .update({ 
        status: status,
        qr_code_url: qrCode || undefined
      })
      .eq('session_name', sessionName)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating status:', updateError);
    }

    return new Response(JSON.stringify({
      success: true,
      status: status,
      qr_code: qrCode,
      connection_status: statusData.connectionStatus || 'unknown'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whatsapp-check-status:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
