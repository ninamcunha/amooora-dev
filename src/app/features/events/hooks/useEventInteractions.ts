import { useState, useEffect } from 'react';
import {
  markEventAsInterested,
  removeEventInterest,
  hasEventInterest,
  markEventAsAttended,
  removeEventAttendance,
  hasEventAttendance,
} from '../services/eventInteractions';

export function useEventInteractions(eventId: string | undefined) {
  const [isInterested, setIsInterested] = useState(false);
  const [isAttended, setIsAttended] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carregar estado inicial
  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const loadState = async () => {
      try {
        setLoading(true);
        const [interested, attended] = await Promise.all([
          hasEventInterest(eventId),
          hasEventAttendance(eventId),
        ]);
        setIsInterested(interested);
        setIsAttended(attended);
      } catch (error) {
        console.error('Erro ao carregar estado de interações:', error);
      } finally {
        setLoading(false);
      }
    };

    loadState();
  }, [eventId]);

  const toggleInterest = async () => {
    if (!eventId) return;

    try {
      if (isInterested) {
        await removeEventInterest(eventId);
        setIsInterested(false);
      } else {
        await markEventAsInterested(eventId);
        setIsInterested(true);
        // Se estava marcado como "Fui!", remover também
        if (isAttended) {
          await removeEventAttendance(eventId);
          setIsAttended(false);
        }
      }
    } catch (error) {
      console.error('Erro ao alternar interesse:', error);
      alert('Erro ao atualizar interesse. Tente novamente.');
    }
  };

  const toggleAttendance = async () => {
    if (!eventId) return;

    try {
      if (isAttended) {
        await removeEventAttendance(eventId);
        setIsAttended(false);
      } else {
        await markEventAsAttended(eventId);
        setIsAttended(true);
        // Se estava marcado como "Tenho interesse", remover também
        if (isInterested) {
          await removeEventInterest(eventId);
          setIsInterested(false);
        }
      }
    } catch (error) {
      console.error('Erro ao alternar participação:', error);
      alert('Erro ao atualizar participação. Tente novamente.');
    }
  };

  return {
    isInterested,
    isAttended,
    loading,
    toggleInterest,
    toggleAttendance,
  };
}
