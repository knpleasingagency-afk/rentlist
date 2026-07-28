-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'owner' CHECK (role IN ('admin', 'owner')),
  subscription_status TEXT NOT NULL DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive')),
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  bedrooms INT NOT NULL DEFAULT 0,
  bathrooms INT NOT NULL DEFAULT 0,
  area_sqft INT,
  address TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  longitude DOUBLE PRECISION NOT NULL DEFAULT 0,
  contact_phone TEXT NOT NULL DEFAULT '',
  contact_email TEXT NOT NULL DEFAULT '',
  photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_listings_owner_id ON listings(owner_id);
CREATE INDEX idx_listings_is_published ON listings(is_published);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_bedrooms ON listings(bedrooms);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_subscription_status ON profiles(subscription_status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    'owner'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Storage bucket for listing photos (create via Supabase dashboard: bucket name = 'listing-photos', public = true)

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read any profile, update only their own
CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Listings: anyone can read published listings, owners manage their own
CREATE POLICY "Published listings are viewable by everyone"
  ON listings FOR SELECT
  USING (is_published = true);

CREATE POLICY "Owners can view all their listings"
  ON listings FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their listings"
  ON listings FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their listings"
  ON listings FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their listings"
  ON listings FOR DELETE
  USING (auth.uid() = owner_id);

-- Admin can see all listings (even unpublished)
CREATE POLICY "Admins can view all listings"
  ON listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin can manage all owners
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
