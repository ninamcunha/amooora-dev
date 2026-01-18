import { useState, useEffect } from 'react';
import { Event } from '../types';
import { getEvents, getEventById } from '../services/events';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar eventos'));
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return { events, loading, error };
};

export const useEvent = (id: string | undefined) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setEvent(null);
      setLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
        if (!data) {
          setError(new Error('Evento não encontrado'));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar evento'));
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  return { event, loading, error };
};