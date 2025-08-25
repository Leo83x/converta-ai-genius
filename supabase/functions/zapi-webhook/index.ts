import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req: Request) => {
  console.log('Z-API Webhook called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create admin client (webhook doesn't need user auth)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const webhookData = await req.json();
    console.log('Webhook data received:', JSON.stringify(webhookData, null, 2));

    // Extract instance information from webhook
    const instanceId = webhookData.instanceId || webhookData.instance_id;
    const eventType = webhookData.event || webhookData.type;
    
    if (!instanceId) {
      console.warn('No instance ID in webhook data');
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find instance in database
    const { data: instanceData, error: findError } = await supabaseAdmin
      .from('whatsapp_instances')
      .select('*')
      .eq('instance_id', instanceId)
      .single();

    if (findError || !instanceData) {
      console.warn('Instance not found for webhook:', instanceId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing webhook for instance:', instanceData.id);

    // Handle different webhook events
    let newStatus = instanceData.status;

    switch (eventType) {
      case 'connected':
      case 'qr_code':
        newStatus = 'connected';
        console.log('Instance connected:', instanceId);
        break;
        
      case 'disconnected':
        newStatus = 'disconnected';
        console.log('Instance disconnected:', instanceId);
        break;
        
      case 'message_received':
      case 'message_sent':
        // Handle message events (future enhancement)
        console.log('Message event received:', eventType);
        break;
        
      case 'delivery':
      case 'status':
        // Handle delivery/status events (future enhancement)
        console.log('Status event received:', eventType);
        break;
        
      default:
        console.log('Unknown webhook event:', eventType);
    }

    // Update instance status if changed
    if (newStatus !== instanceData.status) {
      const { error: updateError } = await supabaseAdmin
        .from('whatsapp_instances')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', instanceData.id);

      if (updateError) {
        console.error('Error updating instance status:', updateError);
      } else {
        console.log('Instance status updated:', { instanceId, oldStatus: instanceData.status, newStatus });
      }
    }

    // Log webhook for debugging (optional - could create a webhook_logs table)
    console.log('Webhook processed successfully');

    return new Response(JSON.stringify({ 
      success: true,
      processed: true,
      instanceId,
      eventType,
      statusUpdated: newStatus !== instanceData.status
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in zapi-webhook:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});