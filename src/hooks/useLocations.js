import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  useEffect(() => {
    supabase.from('locations').select('*').order('code').then(({ data, error }) => {
      console.log('[useLocations] response:', { data, error });
      if (error) setError(error.message);
      else setLocations(data);
      setLoading(false);
    });
  }, []);

  const addLocation = async (location) => {
    const { data, error } = await supabase.from('locations').insert(location).select().single();
    if (!error) setLocations(prev => [...prev, data]);
    return { data, error };
  };

  return { locations, setLocations, loading, error, addLocation };
}
