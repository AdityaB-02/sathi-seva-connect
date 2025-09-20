import { supabase } from './client';
import { Database } from './types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type Job = Database['public']['Tables']['jobs']['Row'];
type JobApplication = Database['public']['Tables']['job_applications']['Row'];

export class SupabaseService {
  // User Profile Operations
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        // If no profile exists, return null instead of throwing
        if (error.code === 'PGRST116') {
          console.log('No user profile found, returning null');
          return null;
        }
        return null;
      }

      return data;
    } catch (err) {
      console.error('Exception in getUserProfile:', err);
      // Create or update user profile
      const profileData = {
        user_id: userId,
      };
      return SupabaseService.createOrUpdateProfile(profileData);
    }
  }

  static async createOrUpdateProfile(profileData: any) {
    const { data, error } = await (supabase as any)
      .from('user_profiles')
      .upsert(profileData, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating/updating profile:', error);
      throw error;
    }

    return data;
  }

  static async createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Exception in createUserProfile:', err);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Exception in updateUserProfile:', err);
      return null;
    }
  }

  static async updateProfile(userId: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data;
  }

  // Job Operations
  static async getAvailableJobs(currentUserId?: string): Promise<Job[]> {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      // Exclude jobs created by the current user
      if (currentUserId) {
        query = query.neq('client_id', currentUserId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching available jobs:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception in getAvailableJobs:', err);
      return [];
    }
  }

  // Get jobs in same locality (excluding user's own jobs)
  static async getJobsInSameLocality(currentUserId: string, userCity: string, userLocality: string) {
    try {
      // First get all jobs excluding user's own
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .neq('client_id', currentUserId)
        .order('created_at', { ascending: false });

      if (jobsError) {
        console.error('Error fetching jobs:', jobsError);
        return [];
      }

      // Get client profiles for these jobs
      const clientIds = jobs?.map(job => job.client_id) || [];
      if (clientIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, city, locality')
        .in('user_id', clientIds);

      if (profilesError) {
        console.error('Error fetching client profiles:', profilesError);
        return jobs || [];
      }

      // Filter jobs by same city/locality
      const localJobs = (jobs || []).filter(job => {
        const clientProfile = profiles?.find(p => p.user_id === job.client_id);
        if (!clientProfile) return false;
        
        // Match by city and locality
        return (
          clientProfile.city?.toLowerCase() === userCity?.toLowerCase() ||
          clientProfile.locality?.toLowerCase() === userLocality?.toLowerCase()
        );
      });

      return localJobs;
    } catch (err) {
      console.error('Exception in getJobsInSameLocality:', err);
      return [];
    }
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }


  // Job Application Operations
  static async applyToJob(jobId: string, workerId: string): Promise<{ application: JobApplication | null; employer: { id: string; name: string | null } | null }> {
    try {
      const { data: job, error: jobError } = await (supabase as any)
        .from('jobs')
        .select('id, client_id')
        .eq('id', jobId)
        .single();

      if (jobError || !job) {
        console.error('applyToJob: cannot find job', jobError);
        return { application: null, employer: null };
      }

      const employer = await SupabaseService.getEmployerInfo(job.client_id);
      const message = `Applied to job: ${jobId}`;

      const { data: application, error } = await (supabase as any)
        .from('job_applications')
        .insert([{ 
          job_id: jobId, 
          worker_id: workerId, 
          status: 'pending', 
          message,
          applied_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('applyToJob: insert failed', error);
        return { application: null, employer };
      }

      return { application, employer };
    } catch (err) {
      console.error('applyToJob: exception', err);
      return { application: null, employer: null };
    }
  }

  static async getEmployerInfo(clientId: string): Promise<{ id: string; name: string | null } | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('user_profiles')
        .select('full_name')
        .eq('user_id', clientId)
        .single();
      
      if (error) return { id: clientId, name: null };
      return { id: clientId, name: data?.full_name ?? null };
    } catch {
      return { id: clientId, name: null };
    }
  }

  static async getUserApplications(workerId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('worker_id', workerId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching user applications:', error);
      return [];
    }

    return data || [];
  }

  static async getJobsByIds(ids: string[]): Promise<Job[]> {
    if (!ids.length) return [];
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .in('id', ids);
    if (error) {
      console.error('Error fetching jobs by ids:', error);
      return [];
    }
    return (data || []) as Job[];
  }

  static async getJobApplications(jobId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });
    if (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
    return data || [];
  }

  static async updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected'): Promise<JobApplication | null> {
    const { data, error } = await (supabase as any)
      .from('job_applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating application status:', error);
      return null;
    }

    return data;
  }

  // Get jobs by user skills
  static async getJobsByUserSkills(userSkills: string[]): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'available')
        .overlaps('required_tags', userSkills)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs by skills:', error);
        return [];
      }

      return data || [];
    } catch (err) {
      console.error('Exception in getJobsByUserSkills:', err);
      return [];
    }
  }

  // Get user jobs (jobs applied to or created by user)
  static async getUserJobs(userId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .or(`client_id.eq.${userId},worker_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user jobs:', error);
      throw error;
    }

    return data || [];
  }

  // Create a new job
  static async createJob(jobData: {
    title: string;
    description: string;
    location: string;
    amount: number;
    duration?: string;
    scheduled_date: string;
    scheduled_time?: string;
    required_tags: string[];
    client_id: string;
  }) {
    const { data, error } = await (supabase as any)
      .from('jobs')
      .insert([{
        ...jobData,
        status: 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      throw error;
    }

    return data;
  }
}
