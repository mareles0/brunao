import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials not found. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper para verificar se usuário é admin
export async function isAdmin(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  return !error && data?.role === 'admin';
}

// Helper para criar perfil ao cadastrar
export async function createProfile(userId, email, fullName, role = 'user') {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      full_name: fullName,
      role
    })
    .select()
    .single();
  
  return { data, error };
}
