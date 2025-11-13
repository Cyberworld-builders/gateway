-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "gateway";

-- CreateTable
CREATE TABLE IF NOT EXISTS "gateway"."leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "products" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "leads_email_key" ON "gateway"."leads"("email");
CREATE INDEX IF NOT EXISTS "leads_email_idx" ON "gateway"."leads"("email");
CREATE INDEX IF NOT EXISTS "leads_products_idx" ON "gateway"."leads" USING GIN("products");
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "gateway"."leads"("status");

-- Enable RLS
ALTER TABLE "gateway"."leads" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can insert leads" ON "gateway"."leads"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all leads" ON "gateway"."leads"
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads" ON "gateway"."leads"
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete leads" ON "gateway"."leads"
  FOR DELETE
  TO authenticated
  USING (true);

-- Create or replace the upsert_lead function in gateway schema
CREATE OR REPLACE FUNCTION gateway.upsert_lead(
  p_email text,
  p_product text,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS TABLE(lead_id uuid, message text)
LANGUAGE plpgsql
AS $$
DECLARE
  v_lead_id uuid;
  v_current_products text[];
  v_current_metadata jsonb;
  v_message text;
BEGIN
  -- Normalize email
  p_email := lower(trim(p_email));

  -- Attempt to find an existing lead
  SELECT id, products, metadata INTO v_lead_id, v_current_products, v_current_metadata
  FROM gateway.leads
  WHERE email = p_email;

  IF v_lead_id IS NOT NULL THEN
    -- Lead exists, update if product is new or metadata needs merging
    IF NOT (v_current_products @> ARRAY[p_product]) THEN
      -- Add new product to the array
      v_current_products := array_append(v_current_products, p_product);
      v_message := 'Lead updated, new product added.';
    ELSE
      v_message := 'Lead already subscribed to this product.';
    END IF;

    -- Merge metadata
    v_current_metadata := jsonb_set(
      v_current_metadata,
      ARRAY[p_product],
      p_metadata,
      true
    );

    UPDATE gateway.leads
    SET
      products = v_current_products,
      metadata = v_current_metadata,
      status = 'active',
      updated_at = now()
    WHERE id = v_lead_id;

    RETURN QUERY SELECT v_lead_id, v_message;
  ELSE
    -- Lead does not exist, insert new lead
    INSERT INTO gateway.leads (email, products, metadata, status)
    VALUES (p_email, ARRAY[p_product], jsonb_build_object(p_product, p_metadata), 'active')
    RETURNING id INTO v_lead_id;

    v_message := 'New lead created.';
    RETURN QUERY SELECT v_lead_id, v_message;
  END IF;
END;
$$;

-- Grant permissions
GRANT USAGE ON SCHEMA gateway TO anon, authenticated;
GRANT ALL ON gateway.leads TO anon, authenticated;
GRANT EXECUTE ON FUNCTION gateway.upsert_lead TO anon, authenticated;

