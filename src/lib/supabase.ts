import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://klqegframowlsdkprznw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtscWVnZnJhbW93bHNka3Byem53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzMTM3MjEsImV4cCI6MjA0NTg4OTcyMX0.T3ASwPenNmIdGKbAIkNpoynhE3Xn4c6AePQcTLRCV2E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize the database tables
export const initializeDatabase = async () => {
  // Create email_lists table if it doesn't exist
  const { error: createTableError } = await supabase.rpc('create_email_lists_table');
  
  if (createTableError && createTableError.code !== '42P01') {
    console.error('Error creating table:', createTableError);
  }
};

// Save email list
export interface EmailList {
  id?: number;
  name: string;
  total_emails: number;
  valid_emails: number;
  invalid_emails: number;
  created_at?: string;
  user_id: string;
  results: any[];
}

export const saveEmailList = async (list: EmailList) => {
  await initializeDatabase(); // Ensure table exists before saving
  
  const { data, error } = await supabase
    .from('email_lists')
    .insert([list])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEmailLists = async (userId: string) => {
  await initializeDatabase(); // Ensure table exists before querying
  
  const { data, error } = await supabase
    .from('email_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getEmailList = async (id: number) => {
  await initializeDatabase(); // Ensure table exists before querying
  
  const { data, error } = await supabase
    .from('email_lists')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const deleteEmailList = async (id: number) => {
  const { error } = await supabase
    .from('email_lists')
    .delete()
    .eq('id', id);

  if (error) throw error;
};