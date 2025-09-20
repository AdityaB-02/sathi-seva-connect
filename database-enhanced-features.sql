-- Enhanced database schema for new features
-- Run this in your Supabase SQL Editor after running database-location-update.sql

-- Add members_needed column to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS members_needed INTEGER DEFAULT 1;

-- Drop existing job_applications table if it exists with wrong structure
DROP TABLE IF EXISTS public.job_applications;

-- Create job_applications table for application system
CREATE TABLE public.job_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.user_profiles(user_id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message TEXT,
    UNIQUE(job_id, applicant_id)
);

-- Enable RLS on job_applications
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for job_applications
CREATE POLICY "Users can view applications for their jobs" ON public.job_applications
    FOR SELECT USING (
        job_id IN (SELECT id FROM public.jobs WHERE client_id = auth.uid())
        OR applicant_id = auth.uid()
    );

CREATE POLICY "Users can create applications" ON public.job_applications
    FOR INSERT WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Job creators can update application status" ON public.job_applications
    FOR UPDATE USING (
        job_id IN (SELECT id FROM public.jobs WHERE client_id = auth.uid())
    );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);

-- Add updated_at trigger for job_applications
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_applications_updated_at 
    BEFORE UPDATE ON public.job_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
