
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

    // Use the external Venom server
    const venomServerUrl = 'http://31.97.167.218:3002';
    
    console.log('Using Venom server URL:', venomServerUrl);

    let statusData = null;
    let qrCode = null;
    let status = 'pending';

    try {
      // Check status in Venom server
      const statusUrl = `${venomServerUrl}/api/session/${sessionName}/status`;
      console.log('Checking status at:', statusUrl);
      
      const statusResponse = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Status response status:', statusResponse.status);

      if (statusResponse.ok) {
        statusData = await statusResponse.json();
        console.log('Status response:', statusData);
      } else {
        throw new Error(`Venom server returned ${statusResponse.status}`);
      }
    } catch (error) {
      console.error('Venom server connection failed:', error);
      
      // Generate mock QR code when server is unavailable
      const mockQrCode = `data:image/svg+xml;base64,${btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="white"/>
          <text x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="12">
            QR Code para ${sessionName}
            (Servidor Venom offline)
            Configure o servidor em:
            localhost:3002
          </text>
        </svg>
      `)}`;
      
      qrCode = mockQrCode;
      
      // Update database using user client (RLS compliant)
      const { error: updateError } = await supabaseUser
        .from('evolution_tokens')
        .update({ 
          status: 'pending',
          qr_code_url: qrCode
        })
        .eq('session_name', sessionName)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating status:', updateError);
      }

      return new Response(JSON.stringify({
        success: true,
        status: 'pending',
        qr_code: qrCode,
        connection_status: 'server_offline'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process successful response from Venom server
    if (statusData.connectionStatus === 'open' || statusData.status === 'connected') {
      status = 'connected';
    } else if (statusData.connectionStatus === 'connecting' || statusData.connectionStatus === 'close' || statusData.status === 'pending') {
      status = 'pending';
      // Get QR code
      qrCode = statusData.qrcode || statusData.qr || statusData.base64 || null;
      
      // If no QR code in response, try to fetch directly
      if (!qrCode) {
        try {
          const qrUrl = `${venomServerUrl}/api/session/${sessionName}/qr`;
          console.log('Fetching QR code from:', qrUrl);
          
          const qrResponse = await fetch(qrUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (qrResponse.ok) {
            const qrData = await qrResponse.json();
            qrCode = qrData.qrcode || qrData.qr || qrData.base64 || null;
            console.log('QR Code from direct endpoint:', !!qrCode);
          }
        } catch (qrError) {
          console.warn('Failed to fetch QR code directly:', qrError);
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
      connection_status: statusData.connectionStatus || statusData.status || 'unknown'
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
