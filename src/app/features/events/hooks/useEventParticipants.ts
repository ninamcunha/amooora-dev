import { useState, useEffect } from 'react';
import { getEventParticipants, getEventParticipantsCount, type EventParticipant } from '../services/eventParticipants';

export function useEventParticipants(eventId?: string) {
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setParticipants([]);
      setCount(0);
      setLoading(false);
      return;
    }

    const loadParticipants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [participantsData, participantsCount] = await Promise.all([
          getEventParticipants(eventId),
          getEventParticipantsCount(eventId),
        ]);

        setParticipants(participantsData);
        setCount(participantsCount);
      } catch (err) {
        console.error('Erro ao carregar participantes:', err);
        setError('Erro ao carregar participantes');
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, [eventId]);

  return {
    participants,
    count,
    loading,
    error,
  };
}
