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
      userName: review.profiles?.name || review.author_name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || review.author_name || 'Usuário',
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
      userName: review.profiles?.name || review.author_name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || review.author_name || 'Usuário',
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
      userName: review.profiles?.name || review.author_name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || review.author_name || 'Usuário',
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
      userName: review.profiles?.name || review.author_name || 'Usuário',
      userAvatar: review.profiles?.avatar || undefined,
      author: review.profiles?.name || review.author_name || 'Usuário',
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

/**
 * Cria uma nova avaliação (funciona sem login usando nome opcional)
 */
export interface CreateReviewData {
  placeId?: string;
  serviceId?: string;
  eventId?: string;
  rating: number;
  comment: string;
  authorName?: string; // Nome opcional para reviews sem login
}

export const createReview = async (data: CreateReviewData): Promise<Review> => {
  try {
    // Buscar usuário atual (pode ser null se não estiver logado)
    const { data: { user } } = await supabase.auth.getUser();
    
    const reviewData: any = {
      rating: data.rating,
      comment: data.comment.trim(),
    };

    // Adicionar IDs específicos
    if (data.placeId) reviewData.place_id = data.placeId;
    if (data.serviceId) reviewData.service_id = data.serviceId;
    if (data.eventId) reviewData.event_id = data.eventId;

    // Se não estiver logado, usar nome opcional (precisa estar na tabela reviews)
    if (!user && data.authorName) {
      reviewData.user_id = null; // ou um UUID específico para anônimos
      reviewData.author_name = data.authorName.trim();
    } else if (user) {
      reviewData.user_id = user.id;
    } else {
      // Se não tem usuário nem nome, usar "Visitante"
      reviewData.author_name = 'Visitante';
    }

    const { data: newReview, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          avatar
        )
      `)
      .single();

    if (error) {
      console.error('Erro ao criar avaliação:', error);
      throw new Error(`Erro ao criar avaliação: ${error.message}`);
    }

    return {
      id: newReview.id,
      placeId: newReview.place_id || undefined,
      serviceId: newReview.service_id || undefined,
      eventId: newReview.event_id || undefined,
      userId: newReview.user_id || '',
      userName: newReview.profiles?.name || newReview.author_name || 'Usuário',
      userAvatar: newReview.profiles?.avatar || undefined,
      author: newReview.profiles?.name || newReview.author_name || 'Usuário',
      avatar: newReview.profiles?.avatar || undefined,
      rating: newReview.rating,
      comment: newReview.comment,
      createdAt: newReview.created_at,
      date: newReview.created_at ? new Date(newReview.created_at).toLocaleDateString('pt-BR') : undefined,
    };
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    throw error;
  }
};

/**
 * Calcula a média de avaliações para um item
 */
export const calculateAverageRating = (reviews: Review[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Arredondar para 1 casa decimal
};
