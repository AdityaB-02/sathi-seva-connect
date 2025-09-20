-- Supabase Schema for Bharat Seva Platform
-- Run these commands in your Supabase SQL editor

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

-- Create indexes for better performance
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

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for jobs
CREATE POLICY "Anyone can view available jobs" ON jobs
    FOR SELECT USING (status = 'available');

CREATE POLICY "Users can view their own jobs" ON jobs
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = worker_id);

CREATE POLICY "Users can create jobs" ON jobs
    FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Job owners can update their jobs" ON jobs
    FOR UPDATE USING (auth.uid() = client_id);

-- Create RLS policies for job_applications
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

-- Insert sample data for testing
INSERT INTO user_profiles (user_id, full_name, age, address, skills, phone, verification_status) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Priya Sharma', 28, 'Sector 15, Gurgaon', ARRAY['House Cleaning', 'Cooking'], '+91-9876543210', 'verified'),
    ('00000000-0000-0000-0000-000000000002', 'Rajesh Kumar', 35, 'DLF Phase 2, Gurgaon', ARRAY['Cooking', 'Child Care'], '+91-9876543211', 'verified'),
    ('00000000-0000-0000-0000-000000000003', 'Sunita Devi', 42, 'Sector 14, Gurgaon', ARRAY['Child Care', 'Elderly Care'], '+91-9876543212', 'verified'),
    ('00000000-0000-0000-0000-000000000004', 'Amit Singh', 30, 'Sector 12, Gurgaon', ARRAY['Gardening', 'Plumbing'], '+91-9876543213', 'verified'),
    ('00000000-0000-0000-0000-000000000005', 'Neha Gupta', 25, 'DLF Phase 1, Gurgaon', ARRAY['Pet Care', 'House Cleaning'], '+91-9876543214', 'verified');

INSERT INTO jobs (client_id, title, description, location, required_tags, amount, duration, scheduled_date, scheduled_time, status) VALUES
    ('00000000-0000-0000-0000-000000000001', 'House Cleaning Service', 'Deep cleaning of 2BHK apartment', 'Sector 15, Gurgaon', ARRAY['House Cleaning'], 800, '3 hours', '2024-01-18', '10:00:00', 'available'),
    ('00000000-0000-0000-0000-000000000002', 'Cooking Assistance', 'Help with meal preparation for family of 4', 'DLF Phase 2, Gurgaon', ARRAY['Cooking'], 600, '2 hours', '2024-01-19', '14:00:00', 'available'),
    ('00000000-0000-0000-0000-000000000003', 'Child Care', 'Looking after 2 children aged 5 and 8', 'Sector 14, Gurgaon', ARRAY['Child Care'], 1000, '4 hours', '2024-01-20', '09:00:00', 'available'),
    ('00000000-0000-0000-0000-000000000004', 'Garden Maintenance', 'Need help with garden cleaning and plant care', 'Sector 12, Gurgaon', ARRAY['Gardening'], 500, '3 hours', '2024-01-21', '08:00:00', 'available'),
    ('00000000-0000-0000-0000-000000000005', 'Pet Care', 'Looking for someone to walk and feed my dog', 'DLF Phase 1, Gurgaon', ARRAY['Pet Care'], 400, '2 hours', '2024-01-22', '11:00:00', 'available'),
    ('00000000-0000-0000-0000-000000000001', 'Plumbing Repair', 'Fix leaking tap in kitchen', 'Sector 8, Gurgaon', ARRAY['Plumbing'], 300, '1 hour', '2024-01-23', '15:00:00', 'available');
