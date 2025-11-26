import { supabase } from '../config/supabase.js';

export const getStatistics = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    console.log('Estatísticas solicitadas por:', { userId, role: req.user?.role, isAdmin });

    // Total e status das vagas
    const { data: spaces } = await supabase
      .from('parking_spaces')
      .select('status');

    const totalSpaces = spaces.length;
    const occupiedSpaces = spaces.filter(s => s.status === 'occupied').length;
    const freeSpaces = spaces.filter(s => s.status === 'free').length;
    const occupancyRate = ((occupiedSpaces / totalSpaces) * 100).toFixed(1);

    // Se for admin, calcular receita total
    if (isAdmin) {
      const { data: completedSessions } = await supabase
        .from('parking_sessions')
        .select('cost')
        .eq('status', 'completed');

      console.log('Sessões completas para receita:', completedSessions);

      const totalRevenue = completedSessions?.reduce((sum, session) => sum + (session.cost || 0), 0) || 0;

      // Receita do dia
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todaySessions } = await supabase
        .from('parking_sessions')
        .select('cost, exit_time')
        .eq('status', 'completed')
        .gte('exit_time', today.toISOString());

      console.log('Sessões de hoje:', todaySessions);

      const dailyRevenue = todaySessions?.reduce((sum, session) => sum + (session.cost || 0), 0) || 0;

      console.log('Receitas calculadas - Total:', totalRevenue, 'Hoje:', dailyRevenue);

      return res.json({
        totalSpaces,
        occupiedSpaces,
        freeSpaces,
        occupancyRate: parseFloat(occupancyRate),
        totalRevenue,
        dailyRevenue
      });
    }

    // Para usuário comum, não enviar dados de receita
    res.json({
      totalSpaces,
      occupiedSpaces,
      freeSpaces,
      occupancyRate: parseFloat(occupancyRate)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecentEntries = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const { data, error } = await supabase
      .from('parking_sessions')
      .select('*')
      .eq('status', 'active')
      .order('entry_time', { ascending: false })
      .limit(limit);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findNextFreeSpace = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('*')
      .eq('status', 'free')
      .order('id')
      .limit(1)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: 'Não há vagas disponíveis.' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
