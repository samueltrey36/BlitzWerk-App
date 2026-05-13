-- Supabase Setup Instructions for BlitzWerk Carrier Intake

-- 1. Create the carrier_intake_submissions table
CREATE TABLE carrier_intake_submissions (
  id uuid PRIMARY KEY,
  company_name text NOT NULL,
  owner_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  mc_number text NOT NULL,
  dot_number text NOT NULL,
  equipment_type text NOT NULL,
  preferred_lanes text,
  home_base text NOT NULL,
  w9_url text NOT NULL,
  insurance_url text NOT NULL,
  mc_authority_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE carrier_intake_submissions ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow anyone to insert a new submission (since it's a public intake form)
CREATE POLICY "Allow public inserts for carrier intake"
ON carrier_intake_submissions
FOR INSERT
WITH CHECK (true);

-- 4. Create the storage bucket for carrier documents
-- Note: You can do this via the Supabase Dashboard UI (Storage -> Create Bucket -> Name: 'carrier-documents')
-- Make sure the bucket is PUBLIC so that we can retrieve public URLs for the documents.
INSERT INTO storage.buckets (id, name, public) VALUES ('carrier-documents', 'carrier-documents', true);

-- 5. Set up Storage Policies for the 'carrier-documents' bucket
-- Allow public uploads
CREATE POLICY "Allow public uploads to carrier-documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'carrier-documents');

-- Allow public reads
CREATE POLICY "Allow public reads from carrier-documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'carrier-documents');
