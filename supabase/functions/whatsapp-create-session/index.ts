
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

    // Use the external Venom server
    const venomServerUrl = 'http://31.97.167.218:3002';
    
    console.log('Venom server URL:', venomServerUrl);
    console.log('Making request to Venom server');

    // Try to create session in Venom Bot
    let venomData = null;
    let qrCodeUrl = null;

    try {
      const createUrl = `${venomServerUrl}/api/start-session`;
      console.log('Creating session at:', createUrl);

      const venomResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionName: sessionName,
          qrcode: true
        })
      });

      console.log('Venom response status:', venomResponse.status);

      if (venomResponse.ok) {
        venomData = await venomResponse.json();
        console.log('Venom success response:', JSON.stringify(venomData, null, 2));
      } else {
        const errorText = await venomResponse.text();
        console.error('Venom error response:', errorText);
        throw new Error(`Venom server not available: ${venomResponse.status}`);
      }
    } catch (error) {
      console.error('Venom server connection failed:', error);
      
      // Generate a mock QR code for development/testing
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
      
      qrCodeUrl = mockQrCode;
      venomData = {
        success: true,
        sessionName: sessionName,
        qrcode: mockQrCode,
        status: 'mock'
      };
      
      console.log('Using mock QR code due to server unavailability');
    }

    // If we didn't get a QR code from the initial response, try to get it from the server
    if (!qrCodeUrl) {
      // Wait a moment and then try to get QR code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try to get QR code from Venom server
      try {
        const qrUrl = `${venomServerUrl}/api/session/${sessionName}/qr`;
        console.log('Getting QR code from:', qrUrl);
        
        const qrResponse = await fetch(qrUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (qrResponse.ok) {
          const qrData = await qrResponse.json();
          console.log('QR response:', qrData);
          
          if (qrData.qrcode) {
            qrCodeUrl = qrData.qrcode;
          } else if (qrData.qr) {
            qrCodeUrl = qrData.qr;
          } else if (qrData.base64) {
            qrCodeUrl = qrData.base64;
          }
        }
      } catch (qrError) {
        console.warn('Failed to get QR code from dedicated endpoint:', qrError);
      }
    }

    console.log('Final QR code URL length:', qrCodeUrl ? qrCodeUrl.length : 0);

    // Store data using admin client to ensure it works
    const insertData = {
      user_id: user.id,
      session_name: sessionName,
      instance_id: sessionName,
      token: venomData.token || 'venom_token',
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
        instance_id: sessionName,
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
