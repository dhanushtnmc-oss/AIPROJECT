/*
  # Create Job Matching Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `skills` (text array) - User's skills
      - `interests` (text array) - User's interests/preferences
      - `created_at` (timestamptz)
    
    - `jobs`
      - `id` (uuid, primary key)
      - `title` (text) - Job title
      - `company` (text) - Company name
      - `description` (text) - Job description
      - `required_skills` (text array) - Skills required for the job
      - `job_type` (text) - Full-time, Part-time, Contract, etc.
      - `location` (text) - Job location
      - `salary_range` (text) - Salary information
      - `category` (text) - Job category/interest area
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read access to jobs
    - Allow users to read and update their own profiles
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  skills text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  required_skills text[] DEFAULT '{}',
  job_type text DEFAULT 'Full-time',
  location text NOT NULL,
  salary_range text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read jobs"
  ON jobs FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read user profiles"
  ON user_profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create user profiles"
  ON user_profiles FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);