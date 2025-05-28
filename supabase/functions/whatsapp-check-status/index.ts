
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function checkEvolutionInstanceStatus(apiUrl: string, apiKey: string, sessionName: string) {
  console.log(`Checking Evolution instance status: ${sessionName}`);
  
  try {
    // Check QR Code endpoint first
    const qrUrl = `${apiUrl}/instance/qrcode/${sessionName}`;
    console.log('Checking QR Code at:', qrUrl);
    
    const qrResponse = await fetch(qrUrl, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json',
      }
    });

    console.log('QR Code response status:', qrResponse.status);

    if (qrResponse.ok) {
      const qrData = await qrResponse.json();
      console.log('QR Code response:', JSON.stringify(qrData, null, 2));
      
      // Check if instance is connected
      if (qrData.state === 'open' || qrData.status === 'connected') {
        console.log('Instance is connected');
        return { status: 'connected', qrCode: null };
      }
      
      // Check for QR code
      const qrCode = qrData.base64 || qrData.qrCode?.base64 || qrData.qrcode?.base64;
      if (qrCode && qrCode.length > 50) {
        console.log('QR Code found');
        return { status: 'pending', qrCode: qrCode };
      }
    }

    // Try to connect if no QR code found
    console.log('Attempting to connect instance...');
    const connectUrl = `${apiUrl}/instance/connect/${sessionName}`;
    
    const connectResponse = await fetch(connectUrl, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json',
      }
    });

    console.log('Connect response status:', connectResponse.status);

    if (connectResponse.ok) {
      const connectData = await connectResponse.json();
      console.log('Connect response:', JSON.stringify(connectData, null, 2));
      
      // Check for QR code in connect response
      const qrCode = connectData.base64 || connectData.qrCode?.base64 || connectData.qrcode?.base64;
      if (qrCode && qrCode.length > 50) {
        console.log('QR Code found from connect');
        return { status: 'pending', qrCode: qrCode };
      }
    }

  } catch (error) {
    console.log('Error checking instance status:', error);
  }
  
  console.log('Instance is connecting, no QR code available yet');
  return { status: 'connecting', qrCode: null };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

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

    // Get Evolution API configuration
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    
    if (!evolutionApiKey || !evolutionApiUrl) {
      throw new Error('Evolution API configuration missing');
    }

    // Validate URL
    let validatedUrl: string;
    try {
      const cleanUrl = evolutionApiUrl.trim();
      const urlObject = new URL(cleanUrl);
      validatedUrl = cleanUrl;
    } catch (urlError) {
      throw new Error(`Invalid Evolution API URL: ${urlError.message}`);
    }

    console.log('Using Evolution API URL:', validatedUrl);

    // Check instance status using Evolution API Cloud endpoints
    const result = await checkEvolutionInstanceStatus(validatedUrl, evolutionApiKey, sessionName);
    
    console.log('Status check result:', result);

    // Update database
    const updateData: any = { status: result.status };
    if (result.qrCode) {
      updateData.qr_code_url = result.qrCode;
    }

    const { error: updateError } = await supabaseUser
      .from('evolution_tokens')
      .update(updateData)
      .eq('session_name', sessionName)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating status:', updateError);
    }

    return new Response(JSON.stringify({
      success: true,
      status: result.status,
      qr_code: result.qrCode,
      connection_status: result.status
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
