-- Quick Setup Script for Supabase Database
-- Copy and paste this into your Supabase SQL Editor

-- First, let's check if the tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'jobs', 'job_applications');

-- If the above query returns no rows, run the following:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    age INTEGER,
    address TEXT,
    skills TEXT[] DEFAULT '{}',
    phone TEXT,
    profile_photo_url TEXT,
    aadhaar_number TEXT,
    pan_number TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    required_tags TEXT[] NOT NULL DEFAULT '{}',
    amount INTEGER NOT NULL,
    duration TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'in_progress', 'completed', 'cancelled')),
    worker_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_worker_id ON jobs(worker_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_required_tags ON jobs USING GIN(required_tags);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_worker_id ON job_applications(worker_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view available jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view their own jobs" ON jobs;
DROP POLICY IF EXISTS "Users can create jobs" ON jobs;
DROP POLICY IF EXISTS "Job owners can update their jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Job owners can view applications for their jobs" ON job_applications;
DROP POLICY IF EXISTS "Workers can apply to jobs" ON job_applications;
DROP POLICY IF EXISTS "Job owners can update application status" ON job_applications;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view available jobs" ON jobs
    FOR SELECT USING (status = 'available');

CREATE POLICY "Users can view their own jobs" ON jobs
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = worker_id);

CREATE POLICY "Users can create jobs" ON jobs
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Job owners can update their jobs" ON jobs
    FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Users can view their own applications" ON job_applications
    FOR SELECT USING (auth.uid() = worker_id);

CREATE POLICY "Job owners can view applications for their jobs" ON job_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = job_applications.job_id 
            AND jobs.client_id = auth.uid()
        )
    );

CREATE POLICY "Workers can apply to jobs" ON job_applications
    FOR INSERT WITH CHECK (auth.uid() = worker_id);

CREATE POLICY "Job owners can update application status" ON job_applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM jobs 
            WHERE jobs.id = job_applications.job_id 
            AND jobs.client_id = auth.uid()
        )
    );

-- Insert sample data for testing (only if tables are empty)
INSERT INTO jobs (client_id, title, description, location, required_tags, amount, duration, scheduled_date, scheduled_time, status) 
SELECT 
    '00000000-0000-0000-0000-000000000001'::uuid,
    'House Cleaning Service',
    'Deep cleaning of 2BHK apartment',
    'Sector 15, Gurgaon',
    ARRAY['House Cleaning'],
    800,
    '3 hours',
    '2024-01-18'::date,
    '10:00:00'::time,
    'available'
WHERE NOT EXISTS (SELECT 1 FROM jobs LIMIT 1);

-- Verify tables were created
SELECT 'Tables created successfully!' as status;
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'jobs', 'job_applications')
ORDER BY table_name, ordinal_position;
