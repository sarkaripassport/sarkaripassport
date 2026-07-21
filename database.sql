-- Profiles table for admins/users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'candidate' CHECK (role IN ('super_admin', 'content_editor', 'candidate')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vacancies table (Advanced)
CREATE TABLE vacancies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  total_vacancies INTEGER,
  qualification TEXT,
  age_limit TEXT,
  fee_details TEXT,
  start_date DATE,
  last_date DATE,
  selection_process TEXT,
  apply_steps TEXT,
  official_notification_url TEXT,
  apply_link TEXT,
  official_website TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  state TEXT,
  -- SEO Fields
  seo_title TEXT,
  meta_description TEXT,
  faqs JSONB DEFAULT '[]'::jsonb,
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacancies ENABLE ROW LEVEL SECURITY;

-- Basic Public Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Super admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "Public categories are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Editors can manage categories" ON categories USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'content_editor'))
);

CREATE POLICY "Public vacancies are viewable by everyone." ON vacancies FOR SELECT USING (status = 'published');
CREATE POLICY "Editors can manage vacancies" ON vacancies USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'content_editor'))
);
