import { Review } from '../types';
import { supabase } from '../../lib/supabase';

export const getReviews = async (): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw new Error(`Erro ao buscar avaliações: ${error.message}`);
    }

    return (data || []).map((review) => ({
      id: review.id,
      placeId: review.place_id || undefined,
      serviceId: review.service_id || undefined,
      eventId: review.event_id || undefined,
      userId: review.user_id,
      userName: review.profiles?.name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || 'Usuário',
      avatar: review.profiles?.avatar || undefined,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw error;
  }
};

export const getReviewsByPlaceId = async (placeId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('place_id', placeId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações do local:', error);
      throw new Error(`Erro ao buscar avaliações do local: ${error.message}`);
    }

    return (data || []).map((review) => ({
      id: review.id,
      placeId: review.place_id || undefined,
      userId: review.user_id,
      userName: review.profiles?.name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || 'Usuário',
      avatar: review.profiles?.avatar || undefined,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar avaliações do local:', error);
    throw error;
  }
};

export const getReviewsByServiceId = async (serviceId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('service_id', serviceId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações do serviço:', error);
      throw new Error(`Erro ao buscar avaliações do serviço: ${error.message}`);
    }

    return (data || []).map((review) => ({
      id: review.id,
      serviceId: review.service_id || undefined,
      userId: review.user_id,
      userName: review.profiles?.name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || 'Usuário',
      avatar: review.profiles?.avatar || undefined,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar avaliações do serviço:', error);
    throw error;
  }
};

export const getReviewsByEventId = async (eventId: string): Promise<Review[]> => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar avaliações do evento:', error);
      throw new Error(`Erro ao buscar avaliações do evento: ${error.message}`);
    }

    return (data || []).map((review) => ({
      id: review.id,
      eventId: review.event_id || undefined,
      userId: review.user_id,
      userName: review.profiles?.name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || 'Usuário',
      avatar: review.profiles?.avatar || undefined,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
      date: review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR') : undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar avaliações do evento:', error);
    throw error;
  }
};
