import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      logStep("ERROR: No stripe signature");
      return new Response("Missing stripe signature", { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    let event: Stripe.Event;
    
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    logStep("Processing webhook event", { type: event.type, id: event.id });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { sessionId: session.id, customerId: session.customer });
        
        // Get customer email from Stripe
        const customer = await stripe.customers.retrieve(session.customer as string);
        const customerEmail = (customer as Stripe.Customer).email;
        
        if (!customerEmail) {
          logStep("ERROR: No customer email found");
          break;
        }

        // Update or create subscriber
        const { error: subError } = await supabaseClient
          .from('subscribers')
          .upsert({
            email: customerEmail,
            stripe_customer_id: session.customer,
            subscribed: true,
            subscription_tier: session.metadata?.plan_type === 'annual' ? 'Annual' : 'Monthly',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });

        if (subError) {
          logStep("ERROR updating subscriber", subError);
        } else {
          logStep("Subscriber updated successfully");
        }

        // Handle affiliate commission if affiliate code exists
        if (session.metadata?.affiliate_code) {
          const affiliateCode = session.metadata.affiliate_code;
          logStep("Processing affiliate commission", { affiliateCode });

          // Find affiliate
          const { data: affiliate } = await supabaseClient
            .from('affiliates')
            .select('*')
            .eq('affiliate_code', affiliateCode)
            .single();

          if (affiliate) {
            // Calculate commission
            const amount = session.amount_total! / 100; // Convert from cents
            const commissionAmount = (amount * affiliate.commission_rate) / 100;

            // Find subscriber
            const { data: subscriber } = await supabaseClient
              .from('subscribers')
              .select('id')
              .eq('email', customerEmail)
              .single();

            if (subscriber) {
              // Record affiliate sale
              const { error: saleError } = await supabaseClient
                .from('affiliate_sales')
                .insert({
                  affiliate_id: affiliate.id,
                  subscriber_id: subscriber.id,
                  stripe_session_id: session.id,
                  amount: amount,
                  commission_amount: commissionAmount,
                  commission_rate: affiliate.commission_rate,
                  status: 'confirmed'
                });

              if (!saleError) {
                // Update affiliate totals
                await supabaseClient
                  .from('affiliates')
                  .update({
                    total_sales: affiliate.total_sales + 1,
                    total_commissions: affiliate.total_commissions + commissionAmount,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', affiliate.id);

                logStep("Affiliate commission processed", { 
                  affiliateId: affiliate.id, 
                  commissionAmount,
                  totalSales: affiliate.total_sales + 1
                });
              }
            }
          }
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const customerEmail = (customer as Stripe.Customer).email;
        
        if (customerEmail) {
          const isActive = subscription.status === 'active';
          const subscriptionEnd = isActive ? 
            new Date(subscription.current_period_end * 1000).toISOString() : 
            null;

          await supabaseClient
            .from('subscribers')
            .update({
              subscribed: isActive,
              subscription_end: subscriptionEnd,
              updated_at: new Date().toISOString(),
            })
            .eq('email', customerEmail);

          logStep("Subscription updated", { 
            email: customerEmail, 
            isActive, 
            subscriptionEnd 
          });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});