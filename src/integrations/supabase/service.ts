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
      .upsert(profileData)
      .select()
      .single();

    if (error) {
      console.error('Error creating/updating profile:', error);
      return null;
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
      const { data, error } = await supabase
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
  static async getAvailableJobs(): Promise<Job[]> {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

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
  static async getUserJobs(userId: string) {
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
        status: 'open',
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

  static async updateJob(jobId: string, updates: any) {
    const { data, error } = await (supabase as any)
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      return null;
    }

    return data;
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

  static async updateApplicationStatus(applicationId: string, status: 'accepted' | 'rejected'): Promise<JobApplication | null> {
    const { data, error } = await supabase
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
}
