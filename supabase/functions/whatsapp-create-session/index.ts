
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

    // Get Evolution API key
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    if (!evolutionApiKey) {
      console.error('Evolution API key not found in environment variables');
      throw new Error('Evolution API key not configured');
    }

    console.log('Evolution API key found, making request to Evolution API');

    // Create session in Evolution API
    const evolutionResponse = await fetch('https://api.evolution-api.com/instance/create', {
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
      const connectResponse = await fetch(`https://api.evolution-api.com/instance/connect/${sessionName}`, {
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

    // Extract QR code if available
    let qrCodeUrl = null;
    if (evolutionData.qrcode) {
      qrCodeUrl = evolutionData.qrcode;
      console.log('QR code found in qrcode field');
    } else if (evolutionData.qr) {
      qrCodeUrl = evolutionData.qr;
      console.log('QR code found in qr field');
    } else if (evolutionData.base64) {
      qrCodeUrl = evolutionData.base64;
      console.log('QR code found in base64 field');
    } else {
      console.log('No QR code found in response');
    }

    // Store data using user client (RLS compliant)
    const insertData = {
      user_id: user.id,
      session_name: sessionName,
      instance_id: evolutionData.instance?.instanceName || sessionName,
      token: evolutionData.hash || 'temp_token',
      qr_code_url: qrCodeUrl,
      status: 'pending'
    };

    console.log('Inserting data into evolution_tokens:', insertData);

    const { data: tokenData, error: tokenError } = await supabaseUser
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
        status: 'pending',
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
