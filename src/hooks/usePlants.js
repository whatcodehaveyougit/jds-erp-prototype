import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// DB uses snake_case (pot_size); app uses camelCase (potSize)
const fromDb = row => ({ ...row, potSize: row.pot_size, pot_size: undefined });

export function usePlants() {
  const [plants, setPlants]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('plants').select('*').order('id');
    console.log('[usePlants] response:', { data, error });
    if (error) setError(error.message);
    else setPlants(data.map(fromDb));
    setLoading(false);
  }, []);

  useEffect(() => { fetchPlants(); }, [fetchPlants]);

  const updateQty = async (id, qty) => {
    const { error } = await supabase.from('plants').update({ qty }).eq('id', id);
    if (!error) setPlants(prev => prev.map(p => p.id === id ? { ...p, qty } : p));
  };

  const updatePotSize = async (id, potSize) => {
    const { error } = await supabase.from('plants').update({ pot_size: potSize }).eq('id', id);
    if (!error) setPlants(prev => prev.map(p => p.id === id ? { ...p, potSize } : p));
  };

  return { plants, loading, error, updateQty, updatePotSize };
}
