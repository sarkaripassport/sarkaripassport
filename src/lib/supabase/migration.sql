-- Create matrix_pages table for Programmatic SEO overrides
CREATE TABLE IF NOT EXISTS matrix_pages (
  slug TEXT PRIMARY KEY,
  h1 JSONB NOT NULL,
  intro JSONB NOT NULL,
  faqs JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE matrix_pages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to matrix_pages"
ON matrix_pages FOR SELECT
TO public
USING (true);

-- Create policy to allow all access to authenticated users
CREATE POLICY "Allow all access to authenticated users on matrix_pages"
ON matrix_pages FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
