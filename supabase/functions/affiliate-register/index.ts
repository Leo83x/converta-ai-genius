import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[AFFILIATE-REGISTER] ${step}${detailsStr}`);
};

// Function to generate unique affiliate code
const generateAffiliateCode = (email: string): string => {
  const emailPrefix = email.split('@')[0].slice(0, 4).toUpperCase();
  const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${emailPrefix}${randomSuffix}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check if user is already an affiliate
    const { data: existingAffiliate } = await supabaseClient
      .from('affiliates')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingAffiliate) {
      logStep("User already registered as affiliate");
      return new Response(JSON.stringify({ 
        success: true, 
        affiliate: existingAffiliate,
        message: "Você já está registrado como afiliado!" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Generate unique affiliate code
    let affiliateCode = generateAffiliateCode(user.email);
    let codeExists = true;
    let attempts = 0;
    
    // Ensure code is unique
    while (codeExists && attempts < 10) {
      const { data } = await supabaseClient
        .from('affiliates')
        .select('id')
        .eq('affiliate_code', affiliateCode)
        .single();
      
      if (!data) {
        codeExists = false;
      } else {
        affiliateCode = generateAffiliateCode(user.email);
        attempts++;
      }
    }

    if (codeExists) {
      throw new Error("Failed to generate unique affiliate code");
    }

    logStep("Generated unique affiliate code", { affiliateCode });

    // Create affiliate record
    const { data: newAffiliate, error: insertError } = await supabaseClient
      .from('affiliates')
      .insert({
        user_id: user.id,
        email: user.email,
        affiliate_code: affiliateCode,
        level: 'Bronze',
        commission_rate: 20.00,
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      logStep("ERROR creating affiliate", insertError);
      throw new Error(`Failed to create affiliate: ${insertError.message}`);
    }

    logStep("Affiliate created successfully", { affiliateId: newAffiliate.id });

    return new Response(JSON.stringify({ 
      success: true, 
      affiliate: newAffiliate,
      message: "Parabéns! Você agora é um afiliado ConvertaMais AI!" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in affiliate-register", { message: errorMessage });
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});