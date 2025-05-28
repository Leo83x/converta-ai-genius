
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
      // Primeiro, tentar buscar instâncias existentes
      const fetchUrl = `${validatedUrl}/instance/fetchInstances`;
      console.log(`Attempt ${attempt}: Fetching instances: ${fetchUrl}`);
      
      const fetchResponse = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      if (fetchResponse.ok) {
        const fetchData = await fetchResponse.json();
        console.log(`Fetch instances response (attempt ${attempt}):`, JSON.stringify(fetchData, null, 2));
        
        if (Array.isArray(fetchData)) {
          const ourInstance = fetchData.find(instance => 
            instance.instance?.instanceName === sessionName || 
            instance.instanceName === sessionName
          );
          
          if (ourInstance) {
            // Verificar se já está conectado
            if (ourInstance.instance?.state === 'open' || ourInstance.state === 'open') {
              console.log(`Instance already connected on attempt ${attempt}`);
              return 'CONNECTED';
            }
            
            // Buscar QR code em várias localizações possíveis
            const qrCode = ourInstance.instance?.qrcode?.base64 || 
                          ourInstance.qrcode?.base64 || 
                          ourInstance.instance?.qrCode?.base64 ||
                          ourInstance.qrCode?.base64 ||
                          ourInstance.instance?.qr?.base64 ||
                          ourInstance.qr?.base64;
            
            if (qrCode && qrCode.length > 50) {
              console.log(`QR Code found in fetchInstances on attempt ${attempt}, length: ${qrCode.length}`);
              return qrCode;
            }
          }
        }
      } else {
        console.log(`Fetch instances failed with status: ${fetchResponse.status}`);
        const errorText = await fetchResponse.text();
        console.log(`Fetch instances error text:`, errorText);
      }
    } catch (error) {
      console.log(`Fetch instances error (attempt ${attempt}):`, error);
    }

    // Tentar conectar para gerar QR code
    try {
      const connectUrl = `${validatedUrl}/instance/connect/${sessionName}`;
      console.log(`Attempt ${attempt}: Connecting instance: ${connectUrl}`);
      
      const connectResponse = await fetch(connectUrl, {
        method: 'GET',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        }
      });

      if (connectResponse.ok) {
        const connectData = await connectResponse.json();
        console.log(`Connect response (attempt ${attempt}):`, JSON.stringify(connectData, null, 2));
        
        // Verificar se obtivemos QR code do connect
        const qrCode = connectData.base64 || 
                      connectData.qrCode?.base64 || 
                      connectData.qrcode?.base64 ||
                      connectData.qr?.base64;
        if (qrCode && qrCode.length > 50) {
          console.log(`QR Code found in connect response on attempt ${attempt}, length: ${qrCode.length}`);
          return qrCode;
        }
      } else {
        console.log(`Connect failed with status: ${connectResponse.status}`);
        const errorText = await connectResponse.text();
        console.log(`Connect error text:`, errorText);
      }
    } catch (error) {
      console.log(`Connect error (attempt ${attempt}):`, error);
    }

    // Esperar antes da próxima tentativa com delay progressivo
    if (attempt < maxAttempts) {
      const waitTime = Math.min(3000 * attempt, 20000); // 3s, 6s, 9s, max 20s
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
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

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

    // Verificar sessão existente
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

    // Obter configurações da Evolution API
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

    // Validação da URL
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

    // Criar sessão na Evolution API Cloud com payload correto
    const createUrl = `${validatedUrl}/instance/create`;
    console.log('Creating instance at:', createUrl);

    // Payload simplificado e correto para Evolution API Cloud
    const createPayload = {
      instanceName: sessionName,
      qrcode: true
    };

    console.log('Create payload:', JSON.stringify(createPayload, null, 2));

    const evolutionResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'apikey': evolutionApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createPayload)
    });

    console.log('Evolution API response status:', evolutionResponse.status);
    const responseText = await evolutionResponse.text();
    console.log('Evolution API response text:', responseText);

    if (!evolutionResponse.ok) {
      console.error('Evolution API error response:', responseText);
      
      // Tentar payload alternativo específico para Evolution API Cloud
      console.log('Trying alternative payload for Evolution API Cloud...');
      
      const alternativePayload = {
        instanceName: sessionName,
        token: sessionName,
        qrcode: true,
        integration: "WHATSAPP-BAILEYS"
      };
      
      console.log('Alternative payload:', JSON.stringify(alternativePayload, null, 2));
      
      const alternativeResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'apikey': evolutionApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alternativePayload)
      });
      
      console.log('Alternative response status:', alternativeResponse.status);
      const altResponseText = await alternativeResponse.text();
      console.log('Alternative response text:', altResponseText);
      
      if (!alternativeResponse.ok) {
        console.error('Alternative request also failed:', altResponseText);
        throw new Error(`Evolution API error: ${alternativeResponse.status} - ${altResponseText}`);
      }
      
      // Se o payload alternativo funcionou, usar essa resposta
      try {
        const alternativeData = JSON.parse(altResponseText);
        console.log('Alternative Evolution API success response:', JSON.stringify(alternativeData, null, 2));
      } catch (parseError) {
        console.error('Error parsing alternative response:', parseError);
        throw new Error('Invalid response from Evolution API');
      }
    }

    // Parse da resposta principal
    let evolutionData;
    try {
      evolutionData = JSON.parse(responseText);
      console.log('Evolution API success response:', JSON.stringify(evolutionData, null, 2));
    } catch (parseError) {
      console.error('Error parsing Evolution API response:', parseError);
      throw new Error('Invalid response from Evolution API');
    }

    // Aguardar QR code com estratégia robusta de retry
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
      console.log('QR Code not found, keeping status as connecting');
    }

    // Armazenar dados usando admin client
    const insertData = {
      user_id: user.id,
      session_name: sessionName,
      instance_id: evolutionData.instance?.instanceName || sessionName,
      token: evolutionData.hash || evolutionData.token || 'temp_token',
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
