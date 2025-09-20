-- Fix foreign key relationships for proper joins
-- Run this in your Supabase SQL Editor AFTER running the main database-setup.sql

-- Drop existing foreign key constraints on jobs table
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_client_id_fkey;
ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_worker_id_fkey;

-- Add foreign key constraints that reference profiles table
ALTER TABLE public.jobs 
ADD CONSTRAINT jobs_client_id_fkey 
FOREIGN KEY (client_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.jobs 
ADD CONSTRAINT jobs_worker_id_fkey 
FOREIGN KEY (worker_id) REFERENCES public.profiles(user_id) ON DELETE SET NULL;

-- Also add foreign key for job_applications to profiles
ALTER TABLE public.job_applications DROP CONSTRAINT IF EXISTS job_applications_worker_id_fkey;
ALTER TABLE public.job_applications 
ADD CONSTRAINT job_applications_worker_id_fkey 
FOREIGN KEY (worker_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
