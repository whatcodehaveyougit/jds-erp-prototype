import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  getQueuedStatusUpdates,
  removeQueuedStatusUpdate,
  setQueuedStatusUpdates,
  upsertQueuedStatusUpdate,
} from '../services/statusUpdateQueue';

// DB uses snake_case (pot_size); app uses camelCase (potSize)
const fromDb = row => ({ ...row, potSize: row.pot_size, pot_size: undefined });

export function usePlants() {
  const [plants, setPlants]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [queuedStatusUpdates, setQueuedStatusUpdatesState] = useState(() => getQueuedStatusUpdates());

  const refreshQueuedStatusUpdates = useCallback(() => {
    setQueuedStatusUpdatesState(getQueuedStatusUpdates());
  }, []);

  const fetchPlants = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('plants').select('*').order('id');
    console.log('[usePlants] response:', { data, error });
    if (error) setError(error.message);
    else setPlants(data.map(fromDb));
    setLoading(false);
  }, []);

  useEffect(() => { fetchPlants(); }, [fetchPlants]);

  const syncQueuedStatusUpdates = useCallback(async () => {
    if (!navigator.onLine) {
      return { synced: 0, remaining: getQueuedStatusUpdates().length };
    }

    const queue = getQueuedStatusUpdates().slice().reverse();
    if (!queue.length) {
      return { synced: 0, remaining: 0 };
    }

    let synced = 0;
    let remaining = [];

    for (let i = 0; i < queue.length; i += 1) {
      const item = queue[i];
      const { error: updateError } = await supabase.from('plants').update({ status: item.status }).eq('id', item.plantId);

      if (updateError) {
        remaining = queue.slice(i);
        break;
      }

      setPlants((prev) => prev.map((p) => (p.id === item.plantId ? { ...p, status: item.status } : p)));
      synced += 1;
    }

    setQueuedStatusUpdates(remaining);
    refreshQueuedStatusUpdates();
    return { synced, remaining: remaining.length };
  }, [refreshQueuedStatusUpdates]);

  useEffect(() => {
    const onOnline = () => {
      syncQueuedStatusUpdates();
    };

    window.addEventListener('online', onOnline);
    if (navigator.onLine) {
      syncQueuedStatusUpdates();
    }

    return () => {
      window.removeEventListener('online', onOnline);
    };
  }, [syncQueuedStatusUpdates]);

  const updateQty = async (id, qty) => {
    const { error } = await supabase.from('plants').update({ qty }).eq('id', id);
    if (!error) setPlants(prev => prev.map(p => p.id === id ? { ...p, qty } : p));
  };

  const updatePotSize = async (id, potSize) => {
    const { error } = await supabase.from('plants').update({ pot_size: potSize }).eq('id', id);
    if (!error) setPlants(prev => prev.map(p => p.id === id ? { ...p, potSize } : p));
  };

  const updateStatus = async (id, status) => {
    const plantName = plants.find((p) => p.id === id)?.name;
    setPlants((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

    if (!navigator.onLine) {
      upsertQueuedStatusUpdate({ plantId: id, plantName, status });
      refreshQueuedStatusUpdates();
      return { queued: true };
    }

    const { error: updateError } = await supabase.from('plants').update({ status }).eq('id', id);
    if (updateError) {
      upsertQueuedStatusUpdate({ plantId: id, plantName, status });
      refreshQueuedStatusUpdates();
      return { queued: true };
    }

    removeQueuedStatusUpdate(id);
    refreshQueuedStatusUpdates();
    return { queued: false };
  };

  return {
    plants,
    loading,
    error,
    updateQty,
    updatePotSize,
    updateStatus,
    queuedStatusUpdates,
    queuedStatusCount: queuedStatusUpdates.length,
    pendingPlantIds: new Set(queuedStatusUpdates.map((item) => item.plantId)),
    syncQueuedStatusUpdates,
  };
}
