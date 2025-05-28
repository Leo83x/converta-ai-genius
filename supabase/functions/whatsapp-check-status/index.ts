
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function checkInstanceStatus(validatedUrl: string, evolutionApiKey: string, sessionName: string) {
  console.log(`Checking instance status for session: ${sessionName}`);
  
  // First try to get instance info using fetchInstances (Evolution API Cloud method)
  try {
    console.log('Trying to fetch instances from Evolution API Cloud');
    const fetchUrl = `${validatedUrl}/instance/fetchInstances`;
    
    const fetchResponse = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      }
    });

    console.log('Fetch instances response status:', fetchResponse.status);

    if (fetchResponse.ok) {
      const fetchData = await fetchResponse.json();
      console.log('Fetch instances response:', JSON.stringify(fetchData, null, 2));

      // Look for our instance in the response
      if (Array.isArray(fetchData)) {
        const ourInstance = fetchData.find(instance => 
          instance.instance?.instanceName === sessionName || 
          instance.instanceName === sessionName
        );
        
        if (ourInstance) {
          // Check if instance is connected
          if (ourInstance.instance?.state === 'open' || ourInstance.state === 'open') {
            console.log('Instance is connected via fetchInstances');
            return { status: 'connected', qrCode: null };
          }
          
          // Check for QR code
          if (ourInstance.instance?.qrcode?.base64 || ourInstance.qrcode?.base64) {
            const qrCode = ourInstance.instance?.qrcode?.base64 || ourInstance.qrcode?.base64;
            if (qrCode && qrCode.length > 50) {
              console.log('QR Code found via fetchInstances');
              return { status: 'pending', qrCode: qrCode };
            }
          }
        }
      }
    }
  } catch (error) {
    console.log('Fetch instances endpoint error:', error);
  }

  // Try to connect to generate QR code
  try {
    console.log('Trying to connect instance to generate QR code');
    const connectUrl = `${validatedUrl}/instance/connect/${sessionName}`;
    
    const connectResponse = await fetch(connectUrl, {
      method: 'GET',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      }
    });

    console.log('Connect response status:', connectResponse.status);

    if (connectResponse.ok) {
      const connectData = await connectResponse.json();
      console.log('Connect response:', JSON.stringify(connectData, null, 2));

      // Check if we got QR code from connect
      if (connectData.base64 && connectData.base64.length > 50) {
        console.log('QR Code found via connect endpoint');
        return { status: 'pending', qrCode: connectData.base64 };
      }
    }
  } catch (error) {
    console.log('Connect endpoint error:', error);
  }

  // Then check connection state
  try {
    console.log('Checking connection state');
    const statusUrl = `${validatedUrl}/instance/connectionState/${sessionName}`;
    
    const statusResponse = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      }
    });

    console.log('Status response status:', statusResponse.status);

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('Status response:', JSON.stringify(statusData, null, 2));

      // Check for connection status
      if (statusData.instance && statusData.instance.state === 'open') {
        console.log('Instance is connected via connectionState');
        return { status: 'connected', qrCode: null };
      }
    }
  } catch (error) {
    console.log('Status endpoint error:', error);
  }
  
  console.log('Instance is connecting, no QR code available yet');
  return { status: 'connecting', qrCode: null };
}

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

    // Get Evolution API configuration
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    
    console.log('=== DEBUGGING SECRETS IN CHECK STATUS ===');
    console.log('EVOLUTION_API_KEY exists:', !!evolutionApiKey);
    console.log('EVOLUTION_API_URL exists:', !!evolutionApiUrl);
    console.log('EVOLUTION_API_URL value:', evolutionApiUrl);
    console.log('=== END DEBUGGING ===');
    
    if (!evolutionApiKey) {
      throw new Error('Evolution API key not configured. Please check your Supabase secrets.');
    }

    if (!evolutionApiUrl) {
      throw new Error('Evolution API URL not configured. Please check your Supabase secrets.');
    }

    // URL validation
    let validatedUrl: string;
    try {
      const cleanUrl = evolutionApiUrl.trim();
      
      if (cleanUrl === 'EVOLUTION_API_URL' || cleanUrl.includes('EVOLUTION_API_URL')) {
        throw new Error('EVOLUTION_API_URL secret contains the variable name instead of the actual URL');
      }
      
      const urlObject = new URL(cleanUrl);
      validatedUrl = cleanUrl;
      
      console.log('URL validation successful:', validatedUrl);
    } catch (urlError) {
      console.error('URL validation failed:', urlError);
      console.error('Received URL value:', evolutionApiUrl);
      throw new Error(`Evolution API URL is invalid: ${urlError.message}. Please check your EVOLUTION_API_URL secret in Supabase.`);
    }

    console.log('Using validated Evolution API URL:', validatedUrl);

    // Check instance status using correct endpoints for Evolution API Cloud
    const result = await checkInstanceStatus(validatedUrl, evolutionApiKey, sessionName);
    
    let status = result.status;
    let qrCode = result.qrCode;

    console.log('Final result:', { status, qrCodeLength: qrCode ? qrCode.length : 0 });

    // Update database using user client (RLS compliant)
    const updateData: any = { status: status };
    if (qrCode) {
      updateData.qr_code_url = qrCode;
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
      status: status,
      qr_code: qrCode,
      connection_status: status
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
