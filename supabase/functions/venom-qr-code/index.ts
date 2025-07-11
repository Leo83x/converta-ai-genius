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

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { sessionName } = await req.json();

    console.log('Getting QR code for session:', sessionName);

    // Connect directly to your Venom server
    const venomServerUrl = 'https://app.convertamais.online';
    
    try {
      // Try to get QR code from Venom server
      const qrUrl = `${venomServerUrl}/session/${sessionName}/qr`;
      console.log('Fetching QR code from:', qrUrl);
      
      const qrResponse = await fetch(qrUrl, {
        method: 'GET'
      });

      console.log('QR response status:', qrResponse.status);

      if (qrResponse.ok) {
        const qrData = await qrResponse.text();
        console.log('QR response length:', qrData ? qrData.length : 0);
        
        if (qrData && qrData !== 'QR Code não disponível.') {
          const qrCodeUrl = `data:image/png;base64,${qrData}`;
          
          return new Response(JSON.stringify({
            success: true,
            qr_code: qrCodeUrl,
            status: 'pending'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          return new Response(JSON.stringify({
            success: false,
            error: 'QR Code não está disponível ainda. Tente novamente em alguns segundos.',
            status: 'connecting'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      } else {
        throw new Error(`Venom server returned ${qrResponse.status}`);
      }
    } catch (error) {
      console.error('Venom server connection failed:', error);
      
      return new Response(JSON.stringify({
        success: false,
        error: 'Servidor Venom não está disponível',
        status: 'server_offline'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in venom-qr-code:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});