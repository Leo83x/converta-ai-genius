import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req: Request) => {
  console.log('Z-API Get QR Code called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client for auth verification
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    // Create user client for RLS-compliant operations
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Get instanceId from request body
    const requestBody = await req.json();
    const { instanceId } = requestBody;
    
    if (!instanceId) {
      throw new Error('Instance ID is required');
    }

    console.log('Getting QR code for instance:', instanceId);

    // Find instance in database
    const { data: instanceData, error: findError } = await supabaseUser
      .from('whatsapp_instances')
      .select('*')
      .eq('instance_id', instanceId)
      .eq('user_id', user.id)
      .single();

    if (findError || !instanceData) {
      console.error('Instance not found:', { findError, instanceId, userId: user.id });
      throw new Error('Instance not found');
    }

    console.log('Instance found:', { 
      id: instanceData.id, 
      instanceId: instanceData.instance_id, 
      status: instanceData.status,
      signed: instanceData.signed 
    });

    // Get Z-API Partner configuration
    const zapiBaseUrl = Deno.env.get('ZAPI_BASE_URL') || 'https://api.z-api.io';
    const zapiPartnerToken = Deno.env.get('ZAPI_PARTNER_TOKEN');
    const developmentMode = Deno.env.get('ZAPI_DEVELOPMENT_MODE') === 'true';

    if (!zapiPartnerToken && !developmentMode) {
      throw new Error('ZAPI_PARTNER_TOKEN is required');
    }

    let qrCode: string | null = null;
    let status = 'disconnected';

    if (developmentMode) {
      console.log('Running in development mode - generating mock QR code');
      
      // Generate a mock QR code (simple SVG)
      const mockQrSvg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <rect x="20" y="20" width="160" height="160" fill="black"/>
        <rect x="40" y="40" width="120" height="120" fill="white"/>
        <text x="100" y="105" text-anchor="middle" font-family="Arial" font-size="14" fill="black">Mock QR</text>
        <text x="100" y="125" text-anchor="middle" font-family="Arial" font-size="10" fill="black">Dev Mode</text>
      </svg>`;
      
      // Convert SVG to base64
      const base64QR = btoa(mockQrSvg);
      qrCode = `data:image/svg+xml;base64,${base64QR}`;
      status = 'pending';
    } else {
      console.log('Getting real QR code from Z-API Partner');
      
      try {
        // First, get the instance status from Z-API Partner
        const statusUrl = `${zapiBaseUrl}/instances/integrator/status/${instanceData.instance_id}`;
        console.log('Z-API Partner Status URL:', statusUrl);
        
        const statusResponse = await fetch(statusUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${zapiPartnerToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Z-API Partner status response status:', statusResponse.status);
        console.log('Z-API Partner status response headers:', Object.fromEntries(statusResponse.headers.entries()));

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log('Z-API Partner status response data:', JSON.stringify(statusData, null, 2));
          
          // Check instance status
          if (statusData.connected) {
            status = 'connected';
            console.log('Instance is already connected');
          } else if (statusData.qrcode) {
            // QR code is available
            qrCode = `data:image/png;base64,${statusData.qrcode}`;
            status = 'pending';
            console.log('QR code found and converted to data URL');
          } else {
            // Instance is connecting but no QR code yet
            status = 'connecting';
            console.log('Instance still connecting, no QR code available yet');
          }
        } else {
          const errorText = await statusResponse.text();
          console.warn('Z-API Partner status request failed:', {
            status: statusResponse.status,
            statusText: statusResponse.statusText,
            body: errorText
          });
          
          // If status endpoint fails, try alternative approach
          if (statusResponse.status === 404 || statusResponse.status === 401) {
            status = 'error';
          } else {
            status = 'connecting';
          }
        }
      } catch (error) {
        console.error('Error fetching status from Z-API Partner:', error);
        status = 'error';
      }
    }

    // Update instance status if changed
    if (instanceData.status !== status) {
      await supabaseUser
        .from('whatsapp_instances')
        .update({ status })
        .eq('id', instanceData.id);
    }

    console.log('QR code request completed:', { status, hasQR: !!qrCode });

    return new Response(JSON.stringify({
      success: true,
      qrCode,
      status,
      instanceId: instanceData.instance_id,
      developmentMode,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in zapi-get-qrcode:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});