-- Create leads table for email capture across all products
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  products text[] not null default '{}', -- Array of product identifiers: 'eternaguard', 'studio', 'gateway', etc.
  status text not null default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  metadata jsonb default '{}', -- Product-specific metadata, engagement tracking, etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on email for fast lookups
create index leads_email_idx on public.leads(email);

-- Create index on products for filtering by product
create index leads_products_idx on public.leads using gin(products);

-- Create index on status for filtering active/unsubscribed leads
create index leads_status_idx on public.leads(status);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

create trigger set_leads_updated_at
  before update on public.leads
  for each row
  execute function public.handle_updated_at();

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Policy: Anyone can insert a lead (for public forms)
create policy "Anyone can insert leads"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Policy: Only authenticated users can view leads
create policy "Authenticated users can view all leads"
  on public.leads
  for select
  to authenticated
  using (true);

-- Policy: Only authenticated users can update leads
create policy "Authenticated users can update leads"
  on public.leads
  for update
  to authenticated
  using (true);

-- Policy: Only authenticated users can delete leads
create policy "Authenticated users can delete leads"
  on public.leads
  for delete
  to authenticated
  using (true);

-- Create a function to upsert leads (add product if email exists, insert if new)
create or replace function public.upsert_lead(
  p_email text,
  p_product text,
  p_metadata jsonb default '{}'
)
returns jsonb as $$
declare
  v_lead_id uuid;
  v_products text[];
  v_existing_metadata jsonb;
begin
  -- Validate email format
  if p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' then
    return jsonb_build_object(
      'success', false,
      'error', 'Invalid email format'
    );
  end if;

  -- Try to get existing lead
  select id, products, metadata into v_lead_id, v_products, v_existing_metadata
  from public.leads
  where email = p_email;

  if v_lead_id is not null then
    -- Lead exists, add product if not already in array
    if not (p_product = any(v_products)) then
      update public.leads
      set 
        products = array_append(products, p_product),
        metadata = v_existing_metadata || p_metadata,
        status = 'active' -- Reactivate if they were unsubscribed
      where id = v_lead_id;
      
      return jsonb_build_object(
        'success', true,
        'lead_id', v_lead_id,
        'message', 'Product added to existing lead'
      );
    else
      return jsonb_build_object(
        'success', true,
        'lead_id', v_lead_id,
        'message', 'Lead already subscribed to this product'
      );
    end if;
  else
    -- New lead, insert
    insert into public.leads (email, products, metadata)
    values (p_email, array[p_product], p_metadata)
    returning id into v_lead_id;
    
    return jsonb_build_object(
      'success', true,
      'lead_id', v_lead_id,
      'message', 'New lead created'
    );
  end if;
end;
$$ language plpgsql security definer;

-- Grant execute permission on the function
grant execute on function public.upsert_lead(text, text, jsonb) to anon, authenticated;

