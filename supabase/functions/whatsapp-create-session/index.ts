
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function waitForQRCode(validatedUrl: string, evolutionApiKey: string, sessionName: string, maxAttempts = 15) {
  console.log(`Starting QR code search for session: ${sessionName}`);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`QR Code attempt ${attempt}/${maxAttempts}`);
    
    try {
      // Strategy 1: Try to get instance status first
      const statusUrl = `${validatedUrl}/instance/connectionState/${sessionName}`;
      console.log(`Attempt ${attempt}: Checking connection state: ${statusUrl}`);
      
      const statusResponse = await fetch(statusUrl, {
        method: 'GET',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log(`Connection state response (attempt ${attempt}):`, JSON.stringify(statusData, null, 2));
        
        // Check if already connected
        if (statusData.state === 'open') {
          console.log(`Instance already connected on attempt ${attempt}`);
          return 'CONNECTED';
        }
        
        // Look for QR code in status response
        if (statusData.qrcode && statusData.qrcode.length > 50) {
          console.log(`QR Code found in status response on attempt ${attempt}`);
          return statusData.qrcode;
        }
      }
    } catch (error) {
      console.log(`Status check error (attempt ${attempt}):`, error);
    }

    // Strategy 2: Try the instance info endpoint
    try {
      const infoUrl = `${validatedUrl}/instance/instanceInfo/${sessionName}`;
      console.log(`Attempt ${attempt}: Getting instance info: ${infoUrl}`);
      
      const infoResponse = await fetch(infoUrl, {
        method: 'GET',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      if (infoResponse.ok) {
        const infoData = await infoResponse.json();
        console.log(`Instance info response (attempt ${attempt}):`, JSON.stringify(infoData, null, 2));
        
        if (infoData.qrcode && infoData.qrcode.length > 50) {
          console.log(`QR Code found in instance info on attempt ${attempt}`);
          return infoData.qrcode;
        }
      }
    } catch (error) {
      console.log(`Instance info error (attempt ${attempt}):`, error);
    }

    // Strategy 3: Force QR code generation
    try {
      const restartUrl = `${validatedUrl}/instance/restart/${sessionName}`;
      console.log(`Attempt ${attempt}: Restarting instance to generate QR: ${restartUrl}`);
      
      const restartResponse = await fetch(restartUrl, {
        method: 'PUT',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      if (restartResponse.ok) {
        console.log(`Instance restarted successfully on attempt ${attempt}`);
        // Wait a bit after restart
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try to get status again after restart
        const postRestartResponse = await fetch(`${validatedUrl}/instance/connectionState/${sessionName}`, {
          method: 'GET',
          headers: {
            'apikey': evolutionApiKey,
            'Content-Type': 'application/json',
          }
        });

        if (postRestartResponse.ok) {
          const postRestartData = await postRestartResponse.json();
          console.log(`Post-restart status (attempt ${attempt}):`, JSON.stringify(postRestartData, null, 2));
          
          if (postRestartData.qrcode && postRestartData.qrcode.length > 50) {
            console.log(`QR Code found after restart on attempt ${attempt}`);
            return postRestartData.qrcode;
          }
        }
      }
    } catch (error) {
      console.log(`Restart error (attempt ${attempt}):`, error);
    }

    // Wait before next attempt with progressive backoff
    if (attempt < maxAttempts) {
      const waitTime = Math.min(3000 * attempt, 10000); // 3s, 6s, 9s, 10s, 10s...
      console.log(`Waiting ${waitTime}ms before attempt ${attempt + 1}`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  console.log(`QR Code not found after ${maxAttempts} attempts`);
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting whatsapp-create-session function');
    
    // Create admin client for auth verification
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user with admin client
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication failed: ' + authError.message);
    }

    if (!user) {
      throw new Error('User not found');
    }

    console.log('User authenticated:', user.id);

    const requestBody = await req.json();
    console.log('Request body:', requestBody);
    
    const { sessionName } = requestBody;

    if (!sessionName) {
      throw new Error('Session name is required');
    }

    console.log('Creating WhatsApp session:', sessionName);

    // Check for existing session using admin client
    const { data: existingSession, error: checkError } = await supabaseAdmin
      .from('evolution_tokens')
      .select('*')
      .eq('session_name', sessionName)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing session:', checkError);
      throw new Error('Error checking existing session: ' + checkError.message);
    }

    if (existingSession) {
      throw new Error('Session with this name already exists');
    }

    console.log('No existing session found, proceeding to create new one');

    // Get Evolution API configuration
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL');
    
    console.log('=== DEBUGGING SECRETS ===');
    console.log('EVOLUTION_API_KEY exists:', !!evolutionApiKey);
    console.log('EVOLUTION_API_KEY length:', evolutionApiKey?.length || 0);
    console.log('EVOLUTION_API_URL exists:', !!evolutionApiUrl);
    console.log('EVOLUTION_API_URL value:', evolutionApiUrl);
    console.log('EVOLUTION_API_URL length:', evolutionApiUrl?.length || 0);
    console.log('=== END DEBUGGING ===');
    
    if (!evolutionApiKey) {
      console.error('Evolution API key not found in environment variables');
      throw new Error('Evolution API key not configured. Please check your Supabase secrets.');
    }

    if (!evolutionApiUrl) {
      console.error('Evolution API URL not found in environment variables');
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

    // Create session in Evolution API
    const createUrl = `${validatedUrl}/instance/create`;
    console.log('Creating instance at:', createUrl);

    const evolutionResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instanceName: sessionName,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS"
      })
    });

    console.log('Evolution API response status:', evolutionResponse.status);

    if (!evolutionResponse.ok) {
      const errorText = await evolutionResponse.text();
      console.error('Evolution API error response:', errorText);
      throw new Error(`Evolution API error: ${evolutionResponse.status} - ${errorText}`);
    }

    const evolutionData = await evolutionResponse.json();
    console.log('Evolution API success response:', JSON.stringify(evolutionData, null, 2));

    // Now wait for QR code with robust retry strategy
    const qrCodeResult = await waitForQRCode(validatedUrl, evolutionApiKey, sessionName);
    
    let qrCodeUrl = null;
    let status = 'connecting';
    
    if (qrCodeResult === 'CONNECTED') {
      status = 'connected';
      console.log('Instance is already connected');
    } else if (qrCodeResult && qrCodeResult.length > 50) {
      qrCodeUrl = qrCodeResult;
      status = 'pending';
      console.log('QR Code found successfully, length:', qrCodeUrl.length);
    } else {
      console.log('QR Code not found, will keep status as connecting');
    }

    // Store data using admin client
    const insertData = {
      user_id: user.id,
      session_name: sessionName,
      instance_id: evolutionData.instance?.instanceName || sessionName,
      token: evolutionData.hash || 'temp_token',
      qr_code_url: qrCodeUrl,
      status: status
    };

    console.log('Inserting data into evolution_tokens:', insertData);

    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('evolution_tokens')
      .insert(insertData)
      .select()
      .single();

    if (tokenError) {
      console.error('Database insertion error:', tokenError);
      throw new Error('Database error: ' + tokenError.message);
    }

    console.log('Database insertion successful:', tokenData);

    const responseData = {
      success: true,
      data: {
        instance_id: evolutionData.instance?.instanceName || sessionName,
        session_name: sessionName,
        token_id: tokenData.id,
        status: status,
        qr_code: qrCodeUrl
      }
    };

    console.log('Returning success response:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in whatsapp-create-session:', error);
    const errorResponse = { 
      success: false, 
      error: error.message || 'Unknown error occurred'
    };
    
    console.log('Returning error response:', errorResponse);
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
