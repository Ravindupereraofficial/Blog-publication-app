/*
  # Blog Platform Schema

  1. New Tables
    - `profiles`: Extended user profiles with premium status
      - Links to `auth.users` via `id`
      - Tracks `is_premium` status for subscription access
      - Stores user display information

    - `posts`: Blog posts with markdown content
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `content` (text, markdown content)
      - `visibility` (enum: 'free' or 'premium')
      - `cover_image` (text, URL to uploaded image)
      - `author_id` (references profiles.id)
      - `published_at` (timestamp)
      - `created_at` and `updated_at` timestamps

  2. Storage
    - `post-images` bucket for cover image uploads
    - Public read access for images
    - Authenticated upload access

  3. Security
    - Enable RLS on all tables
    - Users can only manage their own posts
    - Premium content restricted to premium users
    - Public read access for free posts

  4. Search
    - Full-text search indexes on title and content
    - Search function for posts
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create posts visibility enum
CREATE TYPE post_visibility AS ENUM ('free', 'premium');

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  visibility post_visibility DEFAULT 'free',
  cover_image text,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for post images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Anyone can view free posts"
  ON posts
  FOR SELECT
  TO anon, authenticated
  USING (visibility = 'free' AND published_at IS NOT NULL);

CREATE POLICY "Premium users can view premium posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (
    visibility = 'premium' 
    AND published_at IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_premium = true
    )
  );

CREATE POLICY "Authors can view their own posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (author_id = auth.uid());

-- Storage policies
CREATE POLICY "Authenticated users can upload post images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Anyone can view post images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'post-images');

CREATE POLICY "Users can update their own post images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own post images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS posts_author_id_idx ON posts(author_id);
CREATE INDEX IF NOT EXISTS posts_visibility_idx ON posts(visibility);
CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts(published_at);

-- Full-text search index
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Allow authenticated users to insert posts with their own user ID
CREATE POLICY "Allow users to insert their own posts"
ON posts
FOR INSERT
USING (
  auth.role() = 'authenticated'
  AND author_id = auth.uid()
);

-- Allow users to select their own posts
CREATE POLICY "Allow users to select their own posts"
ON posts
FOR SELECT
USING (
  auth.role() = 'authenticated'
  AND author_id = auth.uid()
);

-- Allow users to update their own posts
CREATE POLICY "Allow users to update their own posts"
ON posts
FOR UPDATE
USING (
  auth.role() = 'authenticated'
  AND author_id = auth.uid()
);

-- Allow users to delete their own posts
CREATE POLICY "Allow users to delete their own posts"
ON posts
FOR DELETE
USING (
  auth.role() = 'authenticated'
  AND author_id = auth.uid()
);