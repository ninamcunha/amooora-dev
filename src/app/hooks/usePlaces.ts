import { useState, useEffect } from 'react';
import { Place } from '../types';
import { getPlaces, getPlaceById } from '../services/places';

export const usePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);
        const data = await getPlaces();
        setPlaces(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar locais'));
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  return { places, loading, error };
};

export const usePlace = (id: string | undefined) => {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setPlace(null);
      setLoading(false);
      return;
    }

    const loadPlace = async () => {
      try {
        setLoading(true);
        const data = await getPlaceById(id);
        setPlace(data);
        if (!data) {
          setError(new Error('Local não encontrado'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar local'));
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [id]);

  return { place, loading, error };
};
