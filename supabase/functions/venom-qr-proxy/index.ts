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
    console.log('Proxying QR code from Venom server...')
    
    const response = await fetch('http://31.97.167.218:3002/qr', {
      method: 'GET',
      headers: {
        'User-Agent': 'Supabase-Edge-Function/1.0',
        'Accept': 'image/png, image/*, */*'
      }
    })

    console.log('Venom server response status:', response.status)

    if (!response.ok) {
      console.error(`Failed to fetch QR code: ${response.status} - ${response.statusText}`)
      return new Response('QR Code não disponível', {
        status: 503,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
        },
      })
    }

    const imageBuffer = await response.arrayBuffer()
    console.log('QR Code proxied successfully, size:', imageBuffer.byteLength, 'bytes')
    
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
    console.error('Error proxying QR code:', error)
    return new Response('Servidor Venom indisponível', {
      status: 503,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      },
    })
  }
})