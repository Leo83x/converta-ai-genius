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
    console.log('Fetching QR code from Venom server...')
    
    const response = await fetch('http://31.97.167.218:3002/qr', {
      method: 'GET',
      headers: {
        'User-Agent': 'Supabase-Edge-Function/1.0'
      }
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error(`Failed to fetch QR code: ${response.status} - ${response.statusText}`)
      return new Response(`Error: ${response.status} - ${response.statusText}`, {
        status: response.status,
        headers: corsHeaders,
      })
    }

    const imageBuffer = await response.arrayBuffer()
    console.log('QR Code image buffer size:', imageBuffer.byteLength)
    
    return new Response(imageBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error fetching QR code:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch QR code',
      message: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
    })
  }
})