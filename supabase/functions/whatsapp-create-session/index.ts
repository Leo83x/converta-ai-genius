
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
    console.log('Starting whatsapp-create-session function');
    
    // Create admin client for auth verification
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create user client for RLS-compliant operations
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
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

    // Check for existing session using user client (RLS compliant)
    const { data: existingSession, error: checkError } = await supabaseUser
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

    // Get Evolution API configuration - debug the actual values
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

    // More robust URL validation
    let validatedUrl: string;
    try {
      // Remove any whitespace and ensure proper format
      const cleanUrl = evolutionApiUrl.trim();
      
      // Check if it's not just the environment variable name
      if (cleanUrl === 'EVOLUTION_API_URL' || cleanUrl.includes('EVOLUTION_API_URL')) {
        throw new Error('EVOLUTION_API_URL secret contains the variable name instead of the actual URL');
      }
      
      // Validate URL format
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

    // Connect the instance
    try {
      const connectUrl = `${validatedUrl}/instance/connect/${sessionName}`;
      console.log('Connecting instance at:', connectUrl);
      
      const connectResponse = await fetch(connectUrl, {
        method: 'GET',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      console.log('Evolution connect response status:', connectResponse.status);
      
      if (connectResponse.ok) {
        const connectData = await connectResponse.json();
        console.log('Evolution connect success:', connectData);
      } else {
        const connectError = await connectResponse.text();
        console.warn('Evolution connect warning:', connectError);
      }
    } catch (connectError) {
      console.warn('Evolution connect failed (non-critical):', connectError);
    }

    // Wait a moment and then try to get QR code
    await new Promise(resolve => setTimeout(resolve, 2000));

    let qrCodeUrl = null;
    
    // Try to get QR code from multiple endpoints
    try {
      const qrUrl = `${validatedUrl}/instance/qrcode/${sessionName}`;
      console.log('Getting QR code from:', qrUrl);
      
      const qrResponse = await fetch(qrUrl, {
        method: 'GET',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        console.log('QR response:', qrData);
        
        if (qrData.qrcode) {
          qrCodeUrl = qrData.qrcode;
        } else if (qrData.base64) {
          qrCodeUrl = qrData.base64;
        }
      }
    } catch (qrError) {
      console.warn('Failed to get QR code:', qrError);
    }

    // If no QR code from dedicated endpoint, check creation response
    if (!qrCodeUrl) {
      if (evolutionData.qrcode) {
        qrCodeUrl = evolutionData.qrcode;
      } else if (evolutionData.qr) {
        qrCodeUrl = evolutionData.qr;
      } else if (evolutionData.base64) {
        qrCodeUrl = evolutionData.base64;
      }
    }

    console.log('Final QR code URL length:', qrCodeUrl ? qrCodeUrl.length : 0);

    // Store data using admin client to ensure it works
    const insertData = {
      user_id: user.id,
      session_name: sessionName,
      instance_id: evolutionData.instance?.instanceName || sessionName,
      token: evolutionData.hash || 'temp_token',
      qr_code_url: qrCodeUrl,
      status: qrCodeUrl ? 'pending' : 'connecting'
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
        status: qrCodeUrl ? 'pending' : 'connecting',
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
