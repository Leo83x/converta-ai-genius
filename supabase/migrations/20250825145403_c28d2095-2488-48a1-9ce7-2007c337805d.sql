-- Create subscribers table for Stripe subscription management
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create affiliates table
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  affiliate_code TEXT NOT NULL UNIQUE,
  level TEXT NOT NULL DEFAULT 'Bronze',
  commission_rate DECIMAL(4,2) NOT NULL DEFAULT 20.00,
  total_sales INTEGER NOT NULL DEFAULT 0,
  total_commissions DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

-- Create policies for affiliates
CREATE POLICY "select_own_affiliate" ON public.affiliates
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "update_own_affiliate" ON public.affiliates
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "insert_affiliate" ON public.affiliates
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Create affiliate_sales table
CREATE TABLE public.affiliate_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES public.subscribers(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(4,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_sales ENABLE ROW LEVEL SECURITY;

-- Create policies for affiliate_sales
CREATE POLICY "select_own_sales" ON public.affiliate_sales
FOR SELECT
USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "insert_affiliate_sale" ON public.affiliate_sales
FOR INSERT
WITH CHECK (true);

CREATE POLICY "update_affiliate_sale" ON public.affiliate_sales
FOR UPDATE
USING (true);

-- Create affiliate_commissions table for monthly payouts
CREATE TABLE public.affiliate_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  total_sales INTEGER NOT NULL DEFAULT 0,
  total_commission DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(affiliate_id, month_year)
);

ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;

-- Create policies for affiliate_commissions
CREATE POLICY "select_own_commissions" ON public.affiliate_commissions
FOR SELECT
USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "insert_commission" ON public.affiliate_commissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "update_commission" ON public.affiliate_commissions
FOR UPDATE
USING (true);

-- Create function to update affiliate levels based on total sales
CREATE OR REPLACE FUNCTION public.update_affiliate_level()
RETURNS TRIGGER AS $$
BEGIN
  -- Update commission rate based on total sales
  IF NEW.total_sales >= 100 THEN
    NEW.level = 'Diamond';
    NEW.commission_rate = 35.00;
  ELSIF NEW.total_sales >= 50 THEN
    NEW.level = 'Gold';
    NEW.commission_rate = 30.00;
  ELSIF NEW.total_sales >= 20 THEN
    NEW.level = 'Silver';
    NEW.commission_rate = 25.00;
  ELSE
    NEW.level = 'Bronze';
    NEW.commission_rate = 20.00;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update affiliate level
CREATE TRIGGER update_affiliate_level_trigger
BEFORE UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.update_affiliate_level();

-- Create trigger for updated_at columns
CREATE TRIGGER update_subscribers_updated_at
BEFORE UPDATE ON public.subscribers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at
BEFORE UPDATE ON public.affiliates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_sales_updated_at
BEFORE UPDATE ON public.affiliate_sales
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_affiliate_commissions_updated_at
BEFORE UPDATE ON public.affiliate_commissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();