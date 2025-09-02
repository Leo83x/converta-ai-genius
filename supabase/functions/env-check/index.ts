import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("=== ENV CHECK DIAGNOSTIC FUNCTION ===")
    console.log(`Timestamp: ${new Date().toISOString()}`)

    // Check for ZAPI_PARTNER_TOKEN
    const zapiToken = Deno.env.get('ZAPI_PARTNER_TOKEN')
    const hasZapiToken = !!zapiToken && zapiToken.length > 0

    // Check other environment variables for completeness
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') 
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    // Log presence/absence (never log actual values)
    console.log(`ZAPI_PARTNER_TOKEN: ${hasZapiToken ? 'PRESENT' : 'ABSENT'}`)
    console.log(`SUPABASE_URL: ${supabaseUrl ? 'PRESENT' : 'ABSENT'}`)
    console.log(`SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'PRESENT' : 'ABSENT'}`)
    console.log(`SUPABASE_SERVICE_ROLE_KEY: ${supabaseServiceKey ? 'PRESENT' : 'ABSENT'}`)

    // Additional diagnostic info
    const tokenLength = zapiToken ? zapiToken.length : 0
    console.log(`Token length: ${tokenLength}`)

    const response = {
      ok: hasZapiToken,
      timestamp: new Date().toISOString(),
      environment: {
        zapiTokenPresent: hasZapiToken,
        zapiTokenLength: tokenLength,
        supabaseConfigured: !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey)
      },
      message: hasZapiToken 
        ? "ZAPI_PARTNER_TOKEN is accessible" 
        : "ZAPI_PARTNER_TOKEN is not accessible - check secret configuration and redeploy"
    }

    console.log("Diagnostic result:", JSON.stringify(response, null, 2))

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in env-check function:', error)
    
    return new Response(JSON.stringify({ 
      ok: false, 
      error: error.message,
      timestamp: new Date().toISOString(),
      message: "Diagnostic function failed"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})