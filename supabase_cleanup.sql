-- ==============================================================================
-- BLITZWERK DATABASE CLEANUP SCRIPT
-- Run this ONCE in your Supabase SQL Editor to wipe out the old overlapping
-- policies before you run the main supabase_setup.sql file.
-- ==============================================================================

-- 1. PROFILES TABLE CLEANUP
-- We must drop the old 'insert' policy because we are locking down signups.
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- IMPORTANT: You previously created a constraint: check (role in ('CUSTOMER', 'HELPER'))
-- If this still exists, you cannot make yourself an 'ADMIN'. We need to drop it.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;


-- 2. CARRIER INTAKE CLEANUP
-- You had several different names for public inserts in the past. We must drop 
-- all of them so they don't overlap with the new ones.
DROP POLICY IF EXISTS "Allow public carrier intake inserts" ON public.carrier_intake_submissions;
DROP POLICY IF EXISTS "Allow anon carrier intake inserts" ON public.carrier_intake_submissions;
DROP POLICY IF EXISTS "Allow anyone to insert carrier intake" ON public.carrier_intake_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to view carrier submissions" ON public.carrier_intake_submissions;


-- 3. STORAGE / BUCKET CLEANUP
-- You previously allowed "anyone to read carrier documents". Since these have W-9s, 
-- they must be private. We must drop the old public read policies!
DROP POLICY IF EXISTS "Allow public uploads to carrier documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon uploads to carrier documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to upload carrier documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to read carrier documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read carrier documents" ON storage.objects;


-- 4. TYPO CLEANUP
-- You previously ran a policy on a table called "message" by accident instead of "contact_messages"
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'message') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Allow authenticated reads for contact messages" ON public.message';
  END IF;
END $$;
