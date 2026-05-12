-- Supabase Database Setup for BlitzWerk Trucking Dispatch

-- 1. Create Carriers Table
CREATE TABLE IF NOT EXISTS public.carriers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  company_name TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  mc_number TEXT,
  dot_number TEXT,
  equipment_type TEXT,
  preferred_lanes TEXT,
  home_base TEXT,
  notes TEXT,
  current_dispatcher TEXT,
  status TEXT DEFAULT 'new_lead' NOT NULL,
  w9_url TEXT,
  insurance_url TEXT,
  authority_url TEXT
);

-- Enable Row Level Security (RLS) on carriers
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to carriers (for the intake form)
CREATE POLICY "Allow anonymous inserts into carriers" ON public.carriers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated reads/updates (for future dashboard)
CREATE POLICY "Allow authenticated users to view carriers" ON public.carriers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update carriers" ON public.carriers
  FOR UPDATE
  TO authenticated
  USING (true);


-- 2. Create Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL
);

-- Enable RLS on contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to contact_submissions
CREATE POLICY "Allow anonymous inserts into contact_submissions" ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated reads
CREATE POLICY "Allow authenticated users to view contact_submissions" ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);


-- 3. Set up Storage Bucket for Carrier Documents
-- Note: Supabase UI can also be used to create the bucket 'carrier-documents'.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('carrier-documents', 'carrier-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for 'carrier-documents' bucket
-- Allow public uploads
CREATE POLICY "Allow public uploads to carrier-documents" ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'carrier-documents');

-- Allow public reads
CREATE POLICY "Allow public reads from carrier-documents" ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'carrier-documents');

-- Allow authenticated updates/deletes
CREATE POLICY "Allow authenticated updates on carrier-documents" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'carrier-documents');

CREATE POLICY "Allow authenticated deletes on carrier-documents" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'carrier-documents');
