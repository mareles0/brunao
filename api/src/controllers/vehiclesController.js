import { supabase } from '../config/supabase.js';

export const getAllVehicles = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('user_vehicles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVehicleByPlate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plate } = req.params;
    
    const { data: vehicle, error } = await supabase
      .from('user_vehicles')
      .select('*')
      .eq('user_id', userId)
      .eq('plate', plate.toUpperCase())
      .single();
    
    if (error || !vehicle) {
      return res.status(404).json({ error: 'Veículo não encontrado.' });
    }
    
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const parkVehicle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plate, spaceId } = req.body;
    
    if (!plate || !spaceId) {
      return res.status(400).json({ error: 'Placa e vaga são obrigatórios.' });
    }
    
    // Verificar se vaga está livre
    const { data: space } = await supabase
      .from('parking_spaces')
      .select('status')
      .eq('id', spaceId)
      .single();

    if (!space || space.status !== 'free') {
      return res.status(400).json({ 
        success: false,
        error: 'Vaga não disponível' 
      });
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
      const { data: newVehicle } = await supabase
        .from('user_vehicles')
        .insert({ user_id: userId, plate: plate.toUpperCase() })
        .select('id')
        .single();
      vehicleId = newVehicle.id;
    }

    // Criar sessão
    const { data: session, error } = await supabase
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

    if (error) throw error;

    // Atualizar vaga
    await supabase
      .from('parking_spaces')
      .update({ status: 'occupied' })
      .eq('id', spaceId);

    res.status(201).json({
      success: true,
      message: 'Veículo estacionado com sucesso!',
      session
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const unparkVehicle = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plate } = req.params;
    
    // Buscar sessão ativa
    const { data: session } = await supabase
      .from('parking_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('plate', plate.toUpperCase())
      .eq('status', 'active')
      .single();

    if (!session) {
      return res.status(404).json({ 
        success: false,
        error: 'Veículo não encontrado no estacionamento' 
      });
    }

    // Calcular duração e custo
    const exitTime = new Date();
    const entryTime = new Date(session.entry_time);
    const durationMinutes = Math.floor((exitTime - entryTime) / (1000 * 60));
    const hours = Math.max(1, Math.ceil(durationMinutes / 60));
    const cost = hours * 5.0;

    // Atualizar sessão
    await supabase
      .from('parking_sessions')
      .update({
        exit_time: exitTime.toISOString(),
        duration_minutes: durationMinutes,
        cost,
        status: 'completed'
      })
      .eq('id', session.id);

    // Liberar vaga
    await supabase
      .from('parking_spaces')
      .update({ status: 'free' })
      .eq('id', session.space_id);

    const hours_display = Math.floor(durationMinutes / 60);
    const minutes_display = durationMinutes % 60;

    res.json({
      success: true,
      message: `Vaga ${session.space_id} liberada.`,
      plate: session.plate,
      spaceId: session.space_id,
      duration: `${hours_display}h ${minutes_display}min`,
      cost: `R$ ${cost.toFixed(2)}`
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      error: error.message 
    });
  }
};

export const getVehicleHistory = async (req, res) => {
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
};
