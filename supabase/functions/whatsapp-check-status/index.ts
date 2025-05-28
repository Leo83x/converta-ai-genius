
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function checkInstanceStatus(validatedUrl: string, evolutionApiKey: string, sessionName: string) {
  console.log(`Checking instance status for session: ${sessionName}`);
  
  const endpoints = [
    { 
      name: 'connectionState', 
      url: `${validatedUrl}/instance/connectionState/${sessionName}`, 
      method: 'GET' 
    },
    { 
      name: 'instanceInfo', 
      url: `${validatedUrl}/instance/instanceInfo/${sessionName}`, 
      method: 'GET' 
    }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying ${endpoint.name} endpoint: ${endpoint.url}`);
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      console.log(`${endpoint.name} response status:`, response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(`${endpoint.name} response:`, JSON.stringify(data, null, 2));

        // Check for connection status first
        if (data.state === 'open' || data.connectionStatus === 'open') {
          console.log(`Instance connected via ${endpoint.name}`);
          return { status: 'connected', qrCode: null };
        }

        // Look for QR code in response
        const qrCode = data.qrcode || data.qr || data.base64;
        if (qrCode && typeof qrCode === 'string' && qrCode.length > 50) {
          console.log(`QR Code found via ${endpoint.name}, length:`, qrCode.length);
          return { status: 'pending', qrCode: qrCode };
        }

      } else {
        console.log(`${endpoint.name} endpoint failed with status:`, response.status);
        const errorText = await response.text();
        console.log(`${endpoint.name} error response:`, errorText);
      }
    } catch (error) {
      console.log(`${endpoint.name} endpoint error:`, error);
    }
  }
  
  // If no QR code found, try to restart the instance to force QR generation
  try {
    console.log('Attempting to restart instance to force QR generation');
    const restartUrl = `${validatedUrl}/instance/restart/${sessionName}`;
    
    const restartResponse = await fetch(restartUrl, {
      method: 'PUT',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      }
    });

    if (restartResponse.ok) {
      console.log('Instance restarted successfully');
      
      // Wait a moment and check status again
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusResponse = await fetch(`${validatedUrl}/instance/connectionState/${sessionName}`, {
        method: 'GET',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log('Status after restart:', JSON.stringify(statusData, null, 2));
        
        if (statusData.state === 'open') {
          return { status: 'connected', qrCode: null };
        }
        
        const qrCode = statusData.qrcode || statusData.qr || statusData.base64;
        if (qrCode && typeof qrCode === 'string' && qrCode.length > 50) {
          console.log('QR Code found after restart');
          return { status: 'pending', qrCode: qrCode };
        }
      }
    }
  } catch (error) {
    console.log('Restart attempt failed:', error);
  }
  
  console.log('No QR code found and unable to restart instance');
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

    // Check instance status using correct endpoints
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
