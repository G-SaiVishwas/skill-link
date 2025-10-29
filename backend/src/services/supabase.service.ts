import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  // User operations
  async getUserByAuthUid(auth_uid: string) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('auth_uid', auth_uid)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  }

  async getUserByPhone(phone: string) {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  }

  async createUser(userData: {
    auth_uid: string;
    role: string | null;
    phone: string;
    email?: string;
  }) {
    const { data, error } = await this.client
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUserRole(userId: string, role: 'worker' | 'employer') {
    const { data, error } = await this.client
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Worker profile operations
  async getWorkerProfile(userId: string) {
    const { data, error } = await this.client
      .from('worker_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async getWorkerProfileById(workerId: string) {
    const { data, error } = await this.client
      .from('worker_profiles')
      .select('*')
      .eq('id', workerId)
      .single();

    if (error) throw error;
    return data;
  }

  async createWorkerProfile(profileData: any) {
    const { data, error } = await this.client
      .from('worker_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateWorkerProfile(workerId: string, updates: any) {
    const { data, error } = await this.client
      .from('worker_profiles')
      .update(updates)
      .eq('id', workerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Employer profile operations
  async getEmployerProfile(userId: string) {
    const { data, error } = await this.client
      .from('employer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createEmployerProfile(profileData: any) {
    const { data, error } = await this.client
      .from('employer_profiles')
      .insert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEmployerProfile(employerId: string, updates: any) {
    const { data, error } = await this.client
      .from('employer_profiles')
      .update(updates)
      .eq('id', employerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Skill operations
  async getSkillBySlug(slug: string) {
    const { data, error } = await this.client
      .from('skills')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  async createSkill(skillData: { slug: string; name: string; synonyms?: string[]; category?: string }) {
    const { data, error } = await this.client
      .from('skills')
      .insert(skillData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async linkUserToSkill(userId: string, skillId: string, proficiency: string, experienceYears: number) {
    const { data, error } = await this.client
      .from('user_skills')
      .insert({
        user_id: userId,
        skill_id: skillId,
        proficiency,
        experience_years: experienceYears,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserSkills(userId: string) {
    const { data, error } = await this.client
      .from('user_skills')
      .select('*, skills(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  // Job operations
  async createJobRequest(jobData: any) {
    const { data, error } = await this.client
      .from('job_requests')
      .insert(jobData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getJobRequest(jobId: string) {
    const { data, error } = await this.client
      .from('job_requests')
      .select('*, employer_profiles(*)')
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data;
  }

  async getEmployerJobs(employerId: string) {
    const { data, error } = await this.client
      .from('job_requests')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateJobRequest(jobId: string, updates: any) {
    const { data, error } = await this.client
      .from('job_requests')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Match operations
  async createMatch(matchData: {
    request_id: string;
    worker_id: string;
    score: number;
    status: string;
  }) {
    const { data, error } = await this.client
      .from('matches')
      .insert(matchData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMatch(matchId: string) {
    const { data, error } = await this.client
      .from('matches')
      .select('*, job_requests(*), worker_profiles(*)')
      .eq('id', matchId)
      .single();

    if (error) throw error;
    return data;
  }

  async getJobMatches(jobId: string) {
    const { data, error } = await this.client
      .from('matches')
      .select('*, worker_profiles(*)')
      .eq('request_id', jobId)
      .order('score', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getWorkerMatches(workerId: string) {
    const { data, error } = await this.client
      .from('matches')
      .select('*, job_requests(*, employer_profiles(*))')
      .eq('worker_id', workerId)
      .order('matched_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateMatchStatus(matchId: string, status: string, additionalFields?: any) {
    const updates = { status, ...additionalFields };
    const { data, error } = await this.client
      .from('matches')
      .update(updates)
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Message operations
  async createMessage(messageData: any) {
    const { data, error } = await this.client
      .from('messages')
      .insert(messageData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMessages(matchId: string) {
    const { data, error } = await this.client
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Skill card operations
  async createSkillCard(cardData: any) {
    const { data, error } = await this.client
      .from('skill_cards')
      .insert(cardData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSkillCardByWorkerId(workerId: string) {
    const { data, error } = await this.client
      .from('skill_cards')
      .select('*')
      .eq('worker_id', workerId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Storage operations
  async uploadFile(bucket: string, path: string, file: Buffer, contentType: string) {
    const { data, error } = await this.client.storage
      .from(bucket)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) throw error;
    return data;
  }

  async getPublicUrl(bucket: string, path: string): Promise<string> {
    const { data } = this.client.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async getSignedUrl(bucket: string, path: string, expiresIn: number = 3600): Promise<string> {
    const { data, error } = await this.client.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  }
}

export const supabaseService = new SupabaseService();
