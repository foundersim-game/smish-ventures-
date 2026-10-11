-- ==============================================================================
-- CHAOS — Purchases & Transaction Ledger Schema
-- Server-Side Receipt Verification, Idempotency, and Anti-Replay Protection
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  original_transaction_id VARCHAR(255),
  product_id VARCHAR(100) NOT NULL,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  player_id VARCHAR(100),
  device_id VARCHAR(100),
  room_code VARCHAR(10),
  amount NUMERIC(10,2) DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  status VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'refunded', 'failed')),
  receipt_payload TEXT,
  acknowledged BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  allocated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for lightning-fast lookup and anti-replay checks
CREATE INDEX IF NOT EXISTS idx_purchases_transaction_id ON public.purchases(transaction_id);
CREATE INDEX IF NOT EXISTS idx_purchases_device_id ON public.purchases(device_id);
CREATE INDEX IF NOT EXISTS idx_purchases_room_code ON public.purchases(room_code);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Allow public read for client receipt queries
DROP POLICY IF EXISTS "Public Read Purchases" ON public.purchases;
CREATE POLICY "Public Read Purchases" ON public.purchases FOR SELECT USING (true);

-- Allow only backend server (service_role) to insert & update verified purchases (Secured)
DROP POLICY IF EXISTS "Service Role Only Purchases Write" ON public.purchases;
CREATE POLICY "Service Role Only Purchases Write" 
  ON public.purchases FOR ALL 
  TO service_role 
  USING (true) WITH CHECK (true);

-- Grant privileges
GRANT ALL ON TABLE public.purchases TO anon, authenticated, service_role;
