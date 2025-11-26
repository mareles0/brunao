import { supabase } from '../config/supabase.js';

// Middleware para verificar autenticação
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.substring(7);

    // Verificar token com Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    // Buscar perfil completo do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
    }

    // Adicionar usuário e perfil ao request
    req.user = {
      ...user,
      role: profile?.role || 'user',
      fullName: profile?.full_name,
      phone: profile?.phone
    };
    
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Middleware para verificar se é admin
export async function requireAdmin(req, res, next) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
