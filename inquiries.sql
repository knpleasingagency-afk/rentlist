CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  budget_min NUMERIC,
  budget_max NUMERIC,
  bedrooms INT,
  bathrooms INT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert inquiries" ON inquiries;
CREATE POLICY "Anyone can insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view inquiries" ON inquiries;
CREATE POLICY "Admins can view inquiries" ON inquiries FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

DROP POLICY IF EXISTS "Admins can update inquiries" ON inquiries;
CREATE POLICY "Admins can update inquiries" ON inquiries FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
