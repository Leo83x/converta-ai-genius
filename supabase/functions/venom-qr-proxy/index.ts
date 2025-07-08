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
    console.log('Fetching QR code HTML from Venom server...')
    
    const response = await fetch('http://31.97.167.218:3002/qr', {
      method: 'GET',
      headers: {
        'User-Agent': 'Supabase-Edge-Function/1.0',
        'Accept': 'text/html, */*'
      }
    })

    console.log('Venom server response status:', response.status)

    if (!response.ok) {
      console.error(`Failed to fetch QR code HTML: ${response.status} - ${response.statusText}`)
      return new Response('QR Code não disponível', {
        status: 503,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
        },
      })
    }

    // Get HTML content
    const htmlContent = await response.text()
    console.log('HTML content length:', htmlContent.length)

    // Extract base64 from img src attribute
    const imgSrcMatch = htmlContent.match(/src="data:image\/png;base64,([^"]+)"/i)
    
    if (!imgSrcMatch || !imgSrcMatch[1]) {
      console.error('No base64 image found in HTML response')
      return new Response('QR Code não encontrado no HTML', {
        status: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain',
        },
      })
    }

    const base64Data = imgSrcMatch[1]
    console.log('Extracted base64 data length:', base64Data.length)

    // Convert base64 to binary
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
    console.log('Binary data length:', binaryData.length)
    
    return new Response(binaryData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error processing QR code:', error)
    return new Response('Erro interno do servidor', {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/plain'
      },
    })
  }
})