-- Run this in Supabase SQL Editor to allow photo uploads
-- https://supabase.com/dashboard/project/hfqdkwfdxgiokxupjnrk/sql/new

-- Allow authenticated users to upload to listing-photos bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-photos');

-- Allow public to view photos
CREATE POLICY "Allow public viewing"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-photos');

-- Allow users to delete their own uploads
CREATE POLICY "Allow owner deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-photos' AND owner = auth.uid());
