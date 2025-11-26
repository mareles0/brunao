import { supabase } from '../config/supabase.js';

export const getAllSpaces = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('*')
      .order('id');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: 'Vaga não encontrada.' });
    }
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFreeSpaces = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('*')
      .eq('status', 'free')
      .order('id');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOccupiedSpaces = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('*')
      .eq('status', 'occupied')
      .order('id');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
