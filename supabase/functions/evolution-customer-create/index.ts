
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function createEvolutionCustomer(apiUrl: string, apiKey: string, customerData: any) {
  console.log('Creating Evolution customer:', customerData.name);
  
  const createUrl = `${apiUrl}/customer/create`;
  const payload = {
    name: customerData.name,
    email: customerData.email,
    phone: customerData.phone,
    modules: ["chatbot", "crm", "events"],
    createUser: true,
    password: customerData.password,
    channels: {
      "WHATSAPP-BAILEYS": {
        limit: 2
      }
    }
  };

  console.log('Creating customer with payload:', JSON.stringify(payload, null, 2));

  const response = await fetch(createUrl, {
    method: 'POST',
    headers: {
      'apikey': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  console.log('Create customer response status:', response.status);
  const responseData = await response.text();
  console.log('Create customer response:', responseData);

  if (!response.ok) {
    throw new Error(`Failed to create customer: ${response.status} - ${responseData}`);
  }

  try {
    return JSON.parse(responseData);
  } catch (error) {
    console.error('Error parsing response:', error);
    return { success: true, rawResponse: responseData };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting evolution-customer-create function');
    
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
    
    const { name, email, phone, password } = requestBody;

    if (!name || !email || !phone || !password) {
      throw new Error('Name, email, phone, and password are required');
    }

    console.log('Creating Evolution customer:', name);

    // Get Evolution API configuration
    const evolutionApiKey = Deno.env.get('EVOLUTION_API_KEY');
    const evolutionApiUrl = Deno.env.get('EVOLUTION_API_URL') || 'https://api.evoapicloud.com';
    
    console.log('=== EVOLUTION API CONFIG ===');
    console.log('API Key exists:', !!evolutionApiKey);
    console.log('API URL:', evolutionApiUrl);
    console.log('=== END CONFIG ===');
    
    if (!evolutionApiKey) {
      throw new Error('EVOLUTION_API_KEY not configured in Supabase secrets');
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

    // Create Evolution customer
    const result = await createEvolutionCustomer(validatedUrl, evolutionApiKey, {
      name,
      email,
      phone,
      password
    });
    
    console.log('Evolution customer creation result:', result);

    const responseData = {
      success: true,
      data: {
        customer: result,
        message: 'Customer created successfully in Evolution API Cloud'
      }
    };

    console.log('Returning success response:', responseData);

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in evolution-customer-create:', error);
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
