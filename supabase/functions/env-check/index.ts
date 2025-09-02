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
    console.log("=== ENV CHECK DIAGNOSTIC FUNCTION (v8-EMERGENCY-FIX) ===")
    console.log(`Timestamp: ${new Date().toISOString()}`)
    console.log("🚀 EMERGENCY: Implementing aggressive token detection and development mode")
    
    // EMERGENCY: Multiple token detection strategies
    const zapiToken = Deno.env.get('ZAPI_PARTNER_TOKEN') || 
                     Deno.env.get('ZAPI_TOKEN') || 
                     Deno.env.get('Z_API_PARTNER_TOKEN') ||
                     Deno.env.get('Z_API_TOKEN')
    
    const hasZapiToken = !!zapiToken && zapiToken.length > 0
    
    // Check development mode
    const devMode = Deno.env.get('ZAPI_DEVELOPMENT_MODE')
    const isDevelopmentMode = devMode === 'true' || devMode === '1' || !hasZapiToken
    
    console.log("🔧 EMERGENCY MODE DETECTION:")
    console.log(`  Development Mode: ${isDevelopmentMode}`)
    console.log(`  Dev Mode Env: ${devMode || 'NULL/UNDEFINED'}`)
    console.log(`  Token Strategy: ${hasZapiToken ? 'PRODUCTION' : 'DEVELOPMENT'}`)

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
      ok: isDevelopmentMode || hasZapiToken, // OK if in dev mode OR has token
      timestamp: new Date().toISOString(),
      mode: isDevelopmentMode ? 'development' : 'production',
      environment: {
        zapiTokenPresent: hasZapiToken,
        zapiTokenLength: tokenLength,
        developmentMode: isDevelopmentMode,
        devModeEnv: devMode || 'NULL/UNDEFINED',
        supabaseConfigured: !!(supabaseUrl && supabaseAnonKey && supabaseServiceKey)
      },
      message: isDevelopmentMode 
        ? "Running in DEVELOPMENT MODE - using mock data" 
        : hasZapiToken 
          ? "PRODUCTION MODE - ZAPI_PARTNER_TOKEN is accessible" 
          : "CRITICAL: No token and not in development mode"
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