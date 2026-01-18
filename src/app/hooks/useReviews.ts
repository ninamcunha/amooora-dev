import { useState, useEffect } from 'react';
import { Review } from '../types';
import {
  getReviewsByPlaceId,
  getReviewsByServiceId,
  getReviewsByEventId,
} from '../services/reviews';

export const useReviewsByPlaceId = (placeId: string) => {
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
        const data = await getReviewsByPlaceId(placeId);
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [placeId]);

  return { reviews, loading, error };
};

export const useReviewsByServiceId = (serviceId: string) => {
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
        const data = await getReviewsByServiceId(serviceId);
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [serviceId]);

  return { reviews, loading, error };
};

export const useReviewsByEventId = (eventId: string) => {
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
        const data = await getReviewsByEventId(eventId);
        setReviews(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar avaliações'));
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [eventId]);

  return { reviews, loading, error };
};