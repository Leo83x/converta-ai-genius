
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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { sessionName } = await req.json();

    console.log('Checking status for session:', sessionName);

    // Buscar o status na Evolution API usando a nova endpoint
    const statusResponse = await fetch(`https://api.evolution-api.com/instance/fetchInstances/${sessionName}`, {
      method: 'GET',
      headers: {
        'apikey': 'token_padrao_converta',
        'Content-Type': 'application/json',
      }
    });

    if (!statusResponse.ok) {
      console.error('Evolution API status error:', statusResponse.status);
      
      // Se não conseguir buscar, tentar buscar QR code diretamente
      const qrResponse = await fetch(`https://api.evolution-api.com/instance/qrcode/${sessionName}`, {
        method: 'GET',
        headers: {
          'apikey': 'token_padrao_converta',
          'Content-Type': 'application/json',
        }
      });

      let qrCode = null;
      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        qrCode = qrData.qrcode || qrData.base64 || null;
        console.log('QR Code found:', !!qrCode);
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

    // Determinar o status baseado na resposta
    let status = 'pending';
    let qrCode = null;

    if (statusData.connectionStatus === 'open') {
      status = 'connected';
    } else if (statusData.connectionStatus === 'connecting' || statusData.connectionStatus === 'close') {
      status = 'pending';
      // Buscar QR code
      qrCode = statusData.qrcode || statusData.qr || null;
      
      // Se não tiver QR code na resposta, tentar buscar diretamente
      if (!qrCode) {
        const qrResponse = await fetch(`https://api.evolution-api.com/instance/qrcode/${sessionName}`, {
          method: 'GET',
          headers: {
            'apikey': 'token_padrao_converta',
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

    // Atualizar no banco de dados
    const { error: updateError } = await supabase
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
