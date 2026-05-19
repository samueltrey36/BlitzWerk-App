-- =======================================================================================
-- BLITZWERK PRODUCTION SUPABASE SCHEMA
-- =======================================================================================

-- =======================================================================================
-- 1. UTILITY FUNCTIONS & EXTENSIONS
-- =======================================================================================
-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =======================================================================================
-- 2. CARRIER INTAKE SUBMISSIONS
-- =======================================================================================
CREATE TABLE IF NOT EXISTS carrier_intake_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL CHECK (char_length(company_name) > 0),
    owner_name TEXT NOT NULL CHECK (char_length(owner_name) > 0),
    phone TEXT NOT NULL CHECK (char_length(phone) >= 10),
    email TEXT NOT NULL CONSTRAINT valid_carrier_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    mc_number TEXT NOT NULL UNIQUE,
    dot_number TEXT NOT NULL UNIQUE,
    equipment_type TEXT NOT NULL,
    trailer_type TEXT,
    preferred_lanes TEXT,
    home_base TEXT NOT NULL,
    years_operating INTEGER CHECK (years_operating >= 0),
    number_of_trucks INTEGER CHECK (number_of_trucks > 0),
    w9_url TEXT NOT NULL,
    insurance_url TEXT NOT NULL,
    mc_authority_url TEXT NOT NULL,
    optional_safety_packet_url TEXT,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_carrier_intake_status ON carrier_intake_submissions(status);
CREATE INDEX IF NOT EXISTS idx_carrier_intake_created_at ON carrier_intake_submissions(created_at);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_carrier_intake_modtime ON carrier_intake_submissions;
CREATE TRIGGER update_carrier_intake_modtime
    BEFORE UPDATE ON carrier_intake_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE carrier_intake_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to submit a new carrier packet
DROP POLICY IF EXISTS "Allow public inserts for carrier intake" ON carrier_intake_submissions;
CREATE POLICY "Allow public inserts for carrier intake" 
ON carrier_intake_submissions 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated internal users/admins can read or update submissions
DROP POLICY IF EXISTS "Allow authenticated reads for carrier intake" ON carrier_intake_submissions;
CREATE POLICY "Allow authenticated reads for carrier intake" 
ON carrier_intake_submissions 
FOR SELECT 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated updates for carrier intake" ON carrier_intake_submissions;
CREATE POLICY "Allow authenticated updates for carrier intake" 
ON carrier_intake_submissions 
FOR UPDATE 
USING (auth.role() = 'authenticated');


-- =======================================================================================
-- 3. CONTACT MESSAGES
-- =======================================================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL CHECK (char_length(full_name) > 0),
    email TEXT NOT NULL CONSTRAINT valid_contact_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    company_name TEXT,
    message TEXT NOT NULL CHECK (char_length(message) > 0),
    status TEXT DEFAULT 'unread' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_contact_messages_modtime ON contact_messages;
CREATE TRIGGER update_contact_messages_modtime
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to submit a contact form
DROP POLICY IF EXISTS "Allow public inserts for contact messages" ON contact_messages;
CREATE POLICY "Allow public inserts for contact messages" 
ON contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated internal users/admins can read or update messages
DROP POLICY IF EXISTS "Allow authenticated reads for contact messages" ON contact_messages;
CREATE POLICY "Allow authenticated reads for contact messages" 
ON contact_messages 
FOR SELECT 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated updates for contact messages" ON contact_messages;
CREATE POLICY "Allow authenticated updates for contact messages" 
ON contact_messages 
FOR UPDATE 
USING (auth.role() = 'authenticated');


-- =======================================================================================
-- 4. USER PROFILES
-- =======================================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE CONSTRAINT valid_profile_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone TEXT CHECK (char_length(phone) >= 10),
    full_name TEXT CHECK (char_length(full_name) > 0),
    role TEXT,
    selected_services TEXT[],
    is_approved BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_profiles_modtime ON profiles;
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- WARNING: Account creation is locked down. 
-- Do NOT allow public signups. Ensure "Allow New Users To Sign Up" is disabled in Supabase Auth Settings.
-- Only database admins (or internal service roles) should insert into profiles.
-- The previous INSERT policy for users has been removed to enforce this at the database level.

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile." ON profiles;
CREATE POLICY "Users can update their own profile." 
ON profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Users can view their own profile, and authenticated admins can view all
DROP POLICY IF EXISTS "Users can view their own profile." ON profiles;
CREATE POLICY "Users can view their own profile." 
ON profiles 
FOR SELECT 
USING (auth.uid() = id OR auth.role() = 'authenticated');


-- =======================================================================================
-- 5. STORAGE BUCKET CONFIGURATION (SECURE PRODUCTION PRACTICES)
-- =======================================================================================
-- Create the carrier-documents bucket as PRIVATE (public = false)
-- This ensures sensitive documents (W-9s containing EIN/SSN) cannot be accessed publicly
INSERT INTO storage.buckets (id, name, public) 
VALUES ('carrier-documents', 'carrier-documents', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policies for 'carrier-documents'

-- 1. Allow anyone to upload documents into the bucket
DROP POLICY IF EXISTS "Allow public uploads to carrier-documents" ON storage.objects;
CREATE POLICY "Allow public uploads to carrier-documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'carrier-documents');

-- 2. Only authenticated users (admins/internal) can view/download the documents
DROP POLICY IF EXISTS "Allow authenticated reads from carrier-documents" ON storage.objects;
CREATE POLICY "Allow authenticated reads from carrier-documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'carrier-documents' AND auth.role() = 'authenticated');

-- 3. Only authenticated users can delete or update documents
DROP POLICY IF EXISTS "Allow authenticated modifications to carrier-documents" ON storage.objects;
CREATE POLICY "Allow authenticated modifications to carrier-documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'carrier-documents' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated deletions from carrier-documents" ON storage.objects;
CREATE POLICY "Allow authenticated deletions from carrier-documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'carrier-documents' AND auth.role() = 'authenticated');
