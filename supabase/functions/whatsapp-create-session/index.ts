
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function ensureCustomerExists(apiUrl: string, apiKey: string, userEmail: string, userId: string) {
  console.log('Ensuring customer exists for user:', userEmail);
  
  // Try to create customer (Evolution API will return error if already exists, which is fine)
  const createCustomerUrl = `${apiUrl}/customer/create`;
  const customerPayload = {
    name: userEmail || `user-${userId}`,
    email: userEmail || `${userId}@placeholder.com`,
    phone: '+5511999999999',
    createUser: false,
    modules: ['chatbot'],
    channels: {
      'WHATSAPP-BAILEYS': { limit: 10 }
    }
  };

  console.log('Creating customer with payload:', JSON.stringify(customerPayload, null, 2));

  const customerResponse = await fetch(createCustomerUrl, {
    method: 'POST',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerPayload)
  });

  console.log('Customer creation response status:', customerResponse.status);
  const customerData = await customerResponse.text();
  console.log('Customer creation response:', customerData);

  // Status 400 usually means customer already exists, which is fine
  if (customerResponse.ok || customerResponse.status === 400) {
    console.log('Customer exists or was created successfully');
    return true;
  } else {
    console.warn('Customer creation failed, but continuing with instance creation');
    return false;
  }
}

async function createEvolutionInstance(apiUrl: string, apiKey: string, sessionName: string) {
  console.log(`Creating Evolution instance: ${sessionName}`);
  
  // Step 1: Create instance following official documentation
  const createUrl = `${apiUrl}/instance/create`;
  const createPayload = {
    instanceName: sessionName,
    qrcode: true,
    integration: "WHATSAPP-BAILEYS"
  };

  console.log('Creating instance with payload:', JSON.stringify(createPayload, null, 2));

  const createResponse = await fetch(createUrl, {
    method: 'POST',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createPayload)
  });

  console.log('Create instance response status:', createResponse.status);
  const createData = await createResponse.text();
  console.log('Create instance response:', createData);

  if (!createResponse.ok) {
    throw new Error(`Failed to create instance: ${createResponse.status} - ${createData}`);
  }

  // Step 2: Connect instance
  console.log('Connecting instance...');
  const connectUrl = `${apiUrl}/instance/connect/${sessionName}`;
  
  const connectResponse = await fetch(connectUrl, {
    method: 'GET',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    }
  });

  console.log('Connect response status:', connectResponse.status);
  const connectData = await connectResponse.text();
  console.log('Connect response:', connectData);

  // Step 3: Get QR Code
  console.log('Fetching QR Code...');
  const qrUrl = `${apiUrl}/instance/qrcode/${sessionName}`;
  
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
    
    // Extract QR code from various possible locations
    const qrCode = qrData.base64 || qrData.qrCode?.base64 || qrData.qrcode?.base64;
    
    if (qrCode && qrCode.length > 50) {
      console.log('QR Code found successfully');
      return {
        success: true,
        qrCode: qrCode,
        status: 'pending',
        instanceData: qrData
      };
    }
  }

  // If no QR code yet, return connecting status
  return {
    success: true,
    qrCode: null,
    status: 'connecting',
    instanceData: null
  };
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

    // Check for existing session
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
    
    console.log('=== EVOLUTION API CONFIG ===');
    console.log('API Key exists:', !!evolutionApiKey);
    console.log('API URL exists:', !!evolutionApiUrl);
    console.log('API URL value:', evolutionApiUrl);
    console.log('=== END CONFIG ===');
    
    if (!evolutionApiKey) {
      throw new Error('EVOLUTION_API_KEY not configured in Supabase secrets');
    }

    if (!evolutionApiUrl) {
      throw new Error('EVOLUTION_API_URL not configured in Supabase secrets');
    }

    // Validate URL
    let validatedUrl: string;
    try {
      const cleanUrl = evolutionApiUrl.trim();
      const urlObject = new URL(cleanUrl);
      validatedUrl = cleanUrl;
      console.log('Using Evolution API URL:', validatedUrl);
    } catch (urlError) {
      console.error('URL validation failed:', urlError);
      throw new Error(`Invalid Evolution API URL: ${urlError.message}`);
    }

    // Step 1: Ensure customer exists before creating instance
    console.log('Ensuring customer exists before creating instance...');
    await ensureCustomerExists(validatedUrl, evolutionApiKey, user.email || '', user.id);

    // Step 2: Create Evolution instance following official documentation
    const result = await createEvolutionInstance(validatedUrl, evolutionApiKey, sessionName);
    
    console.log('Evolution instance creation result:', result);

    // Store session data in database
    const insertData = {
      user_id: user.id,
      session_name: sessionName,
      instance_id: sessionName,
      token: 'evolution_token_' + sessionName,
      qr_code_url: result.qrCode,
      status: result.status
    };

    console.log('Inserting session data:', insertData);

    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('evolution_tokens')
      .insert(insertData)
      .select()
      .single();

    if (tokenError) {
      console.error('Database insertion error:', tokenError);
      throw new Error('Database error: ' + tokenError.message);
    }

    console.log('Session created successfully:', tokenData);

    const responseData = {
      success: true,
      data: {
        instance_id: sessionName,
        session_name: sessionName,
        token_id: tokenData.id,
        status: result.status,
        qr_code: result.qrCode
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
