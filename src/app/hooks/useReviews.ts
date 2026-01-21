import { useState, useEffect } from 'react';
import { Review } from '../types';
import { getReviewsByPlaceId, getReviewsByServiceId, getReviewsByEventId } from '../services/reviews';

export const usePlaceReviews = (placeId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!placeId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByPlaceId(placeId);
        setReviews(data || []);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [placeId]);

  return { reviews, loading, error, refetch: () => {
    if (placeId) {
      getReviewsByPlaceId(placeId).then(setReviews).catch(console.error);
    }
  }};
};

export const useServiceReviews = (serviceId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!serviceId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByServiceId(serviceId);
        setReviews(data || []);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [serviceId]);

  return { reviews, loading, error, refetch: () => {
    if (serviceId) {
      getReviewsByServiceId(serviceId).then(setReviews).catch(console.error);
    }
  }};
};

export const useEventReviews = (eventId: string | undefined) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!eventId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getReviewsByEventId(eventId);
        setReviews(data || []);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
        setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [eventId]);

  return { reviews, loading, error, refetch: () => {
    if (eventId) {
      getReviewsByEventId(eventId).then(setReviews).catch(console.error);
    }
  }};
};
