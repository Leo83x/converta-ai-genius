import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { searchParams } = new URL(req.url);
  const instance = searchParams.get("instance") || "default";

  try {
    const backendUrl = `http://31.97.167.218:3002/qr-base64`;

    // Faz a chamada ao backend local (HTTP)
    const fetchResponse = await fetch(backendUrl);
    
    if (!fetchResponse.ok) {
      throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
    }
    
    const data = await fetchResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      }
    });
  } catch (error) {
    console.error("Erro ao buscar QR do Venom:", error);
    return new Response(JSON.stringify({ 
      error: 'Erro ao buscar QR Code.', 
      details: error.message 
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      }
    });
  }
});