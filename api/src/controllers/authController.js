import { supabase } from '../config/supabase.js';

// Registrar novo usuário
export async function register(req, res) {
  try {
    const { email, password, fullName, phone } = req.body;

    // Criar usuário no Supabase Auth (sem confirmação de email)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
        data: {
          full_name: fullName
        }
      }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Criar perfil
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        full_name: fullName,
        phone,
        role: 'user'
      });

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso! Você já pode fazer login.',
      user: {
        id: authData.user.id,
        email: authData.user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Buscar dados do perfil
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      message: 'Login realizado com sucesso!',
      session: data.session,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.full_name,
        role: profile?.role,
        phone: profile?.phone
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Logout
export async function logout(req, res) {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Logout realizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Obter perfil do usuário atual
export async function getProfile(req, res) {
  try {
    const userId = req.user.id; // Do middleware de autenticação

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Perfil não encontrado' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Atualizar perfil
export async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const { fullName, phone } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: 'Perfil atualizado com sucesso!',
      profile: data
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
