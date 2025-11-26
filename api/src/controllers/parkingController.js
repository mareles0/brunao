import { supabase } from '../config/supabase.js';

// Estacionar veículo
export async function parkVehicle(req, res) {
  try {
    const userId = req.user.id;
    const { plate, spaceId } = req.body;

    if (!plate || !spaceId) {
      return res.status(400).json({ error: 'Placa e vaga são obrigatórios' });
    }

    // Verificar se vaga está livre
    const { data: space, error: spaceError } = await supabase
      .from('parking_spaces')
      .select('status')
      .eq('id', spaceId)
      .single();

    if (spaceError || !space) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    if (space.status !== 'free') {
      return res.status(400).json({ error: 'Vaga já está ocupada' });
    }

    // Verificar se veículo já está estacionado
    const { data: activeSession } = await supabase
      .from('parking_sessions')
      .select('id')
      .eq('plate', plate.toUpperCase())
      .eq('status', 'active')
      .single();

    if (activeSession) {
      return res.status(400).json({ error: 'Veículo já está estacionado' });
    }

    // Buscar ou criar veículo
    let vehicleId;
    const { data: existingVehicle } = await supabase
      .from('user_vehicles')
      .select('id')
      .eq('user_id', userId)
      .eq('plate', plate.toUpperCase())
      .single();

    if (existingVehicle) {
      vehicleId = existingVehicle.id;
    } else {
      const { data: newVehicle, error: vehicleError } = await supabase
        .from('user_vehicles')
        .insert({
          user_id: userId,
          plate: plate.toUpperCase()
        })
        .select('id')
        .single();

      if (vehicleError) throw vehicleError;
      vehicleId = newVehicle.id;
    }

    // Criar sessão de estacionamento
    const { data: session, error: sessionError } = await supabase
      .from('parking_sessions')
      .insert({
        user_id: userId,
        vehicle_id: vehicleId,
        space_id: spaceId,
        plate: plate.toUpperCase(),
        status: 'active'
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Erro ao criar sessão:', sessionError);
      throw sessionError;
    }

    // Atualizar status da vaga
    const { error: updateError } = await supabase
      .from('parking_spaces')
      .update({ status: 'occupied' })
      .eq('id', spaceId);

    if (updateError) {
      console.error('Erro ao atualizar vaga:', updateError);
      throw updateError;
    }

    console.log('Veículo estacionado com sucesso:', { plate, spaceId, userId });

    res.status(201).json({
      message: 'Veículo estacionado com sucesso!',
      session
    });
  } catch (error) {
    console.error('Erro em parkVehicle:', error);
    res.status(500).json({ error: error.message });
  }
}

// Remover veículo (saída)
export async function unparkVehicle(req, res) {
  try {
    const userId = req.user.id;
    const { plate } = req.params;

    // Buscar sessão ativa
    const { data: session, error: sessionError } = await supabase
      .from('parking_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('plate', plate.toUpperCase())
      .eq('status', 'active')
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Veículo não encontrado no estacionamento' });
    }

    // Calcular duração e custo
    const exitTime = new Date();
    const entryTime = new Date(session.entry_time);
    const durationMinutes = Math.floor((exitTime - entryTime) / (1000 * 60));
    
    // Custo: R$ 5,00 por hora (mínimo 1 hora)
    const hours = Math.max(1, Math.ceil(durationMinutes / 60));
    const cost = hours * 5.0;

    console.log('Calculando saída:', { plate, durationMinutes, hours, cost });

    // Atualizar sessão
    const { error: updateError } = await supabase
      .from('parking_sessions')
      .update({
        exit_time: exitTime.toISOString(),
        duration_minutes: durationMinutes,
        cost,
        status: 'completed'
      })
      .eq('id', session.id);

    if (updateError) {
      console.error('Erro ao atualizar sessão:', updateError);
      throw updateError;
    }

    console.log('Sessão atualizada com custo:', cost);

    // Liberar vaga
    await supabase
      .from('parking_spaces')
      .update({ status: 'free' })
      .eq('id', session.space_id);

    const hours_display = Math.floor(durationMinutes / 60);
    const minutes_display = durationMinutes % 60;

    res.json({
      message: 'Saída registrada com sucesso!',
      plate: session.plate,
      spaceId: session.space_id,
      entryTime: session.entry_time,
      exitTime,
      duration: `${hours_display}h ${minutes_display}min`,
      cost: `R$ ${cost.toFixed(2)}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Listar sessões ativas do usuário
export async function getUserActiveSessions(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('parking_sessions')
      .select('*, parking_spaces(id, section, number)')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('entry_time', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Histórico de sessões do usuário
export async function getUserHistory(req, res) {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('parking_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('exit_time', { ascending: false })
      .limit(20);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Admin: Todas as sessões ativas
export async function getAllActiveSessions(req, res) {
  try {
    const { data, error } = await supabase
      .from('parking_sessions')
      .select(`
        *,
        profiles(email, full_name),
        parking_spaces(section, number)
      `)
      .eq('status', 'active')
      .order('entry_time', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Admin: Histórico completo
export async function getAllHistory(req, res) {
  try {
    const { data, error } = await supabase
      .from('parking_sessions')
      .select(`
        *,
        profiles(email, full_name)
      `)
      .eq('status', 'completed')
      .order('exit_time', { ascending: false })
      .limit(100);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
