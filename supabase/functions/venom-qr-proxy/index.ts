import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const response = await fetch('http://31.97.167.218:3002/qr', {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch QR code: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()
    
    return new Response(imageBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching QR code:', error)
    return new Response('Error fetching QR code', {
      status: 500,
      headers: corsHeaders,
    })
  }
})