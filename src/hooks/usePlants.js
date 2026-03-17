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

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('plants').update({ status }).eq('id', id);
    if (!error) setPlants(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const updateLocation = async (id, location) => {
    const { error } = await supabase.from('plants').update({ location }).eq('id', id);
    if (!error) setPlants(prev => prev.map(p => p.id === id ? { ...p, location } : p));
  };

  const addPlant = async (plantData) => {
    const maxNum = plants.reduce((max, p) => {
      const match = p.id.match(/PLT-(\d+)/);
      const num = match ? parseInt(match[1], 10) : 0;
      return num > max ? num : max;
    }, 0);
    const newId = `PLT-${String(maxNum + 1).padStart(3, '0')}`;

    const record = {
      id: newId,
      name: plantData.name,
      batch: plantData.batch,
      price: parseFloat(plantData.price),
      qty: parseInt(plantData.qty, 10),
      pot_size: plantData.potSize,
      status: plantData.status,
      location: plantData.location,
    };

    const { data, error } = await supabase.from('plants').insert(record).select().single();
    if (!error && data) {
      setPlants(prev => [...prev, fromDb(data)].sort((a, b) => a.id.localeCompare(b.id)));
      return { data: fromDb(data), error: null };
    }
    return { data: null, error };
  };

  return { plants, loading, error, updateQty, updatePotSize, updateStatus, updateLocation, addPlant };
}
