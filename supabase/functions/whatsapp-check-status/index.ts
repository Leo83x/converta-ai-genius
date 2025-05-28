
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function findQRCodeRobust(validatedUrl: string, evolutionApiKey: string, sessionName: string) {
  console.log(`Starting robust QR code search for session: ${sessionName}`);
  
  const endpoints = [
    { name: 'connect', url: `${validatedUrl}/instance/connect/${sessionName}`, method: 'GET' },
    { name: 'qrcode', url: `${validatedUrl}/instance/qrcode/${sessionName}`, method: 'GET' },
    { name: 'fetchInstances', url: `${validatedUrl}/instance/fetchInstances/${sessionName}`, method: 'GET' },
    { name: 'find', url: `${validatedUrl}/instance/find/${sessionName}`, method: 'GET' },
    { name: 'fetchInstances-all', url: `${validatedUrl}/instance/fetchInstances`, method: 'GET' }
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

        // Handle array response for fetchInstances-all
        if (endpoint.name === 'fetchInstances-all' && Array.isArray(data)) {
          const sessionInstance = data.find(instance => 
            instance.instance === sessionName || instance.instanceName === sessionName
          );
          if (sessionInstance) {
            console.log(`Found session in fetchInstances-all:`, sessionInstance);
            
            if (sessionInstance.connectionStatus === 'open') {
              return { status: 'connected', qrCode: null };
            }
            
            const qrCode = sessionInstance.qrcode || sessionInstance.qr || sessionInstance.base64;
            if (qrCode && qrCode.length > 50) {
              return { status: 'pending', qrCode: qrCode };
            }
          }
          continue;
        }

        // Check for connection status first
        if (data.connectionStatus === 'open' || data.state === 'open') {
          console.log(`Instance connected via ${endpoint.name}`);
          return { status: 'connected', qrCode: null };
        }

        // Look for QR code in various fields
        const qrCode = data.qrcode || data.qr || data.base64;
        if (qrCode && typeof qrCode === 'string' && qrCode.length > 50) {
          console.log(`QR Code found via ${endpoint.name}, length:`, qrCode.length);
          return { status: 'pending', qrCode: qrCode };
        }

        // Check nested data
        if (data.instance) {
          const nestedQrCode = data.instance.qrcode || data.instance.qr || data.instance.base64;
          if (nestedQrCode && typeof nestedQrCode === 'string' && nestedQrCode.length > 50) {
            console.log(`QR Code found in nested data via ${endpoint.name}`);
            return { status: 'pending', qrCode: nestedQrCode };
          }
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
  
  console.log('No QR code found in any endpoint');
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

    // Use robust QR code finding strategy
    const result = await findQRCodeRobust(validatedUrl, evolutionApiKey, sessionName);
    
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
