import { Place } from '../types';
import { supabase } from '../../lib/supabase';

export const getPlaces = async (): Promise<Place[]> => {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('is_safe', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Erro ao buscar locais:', error);
      throw new Error(`Erro ao buscar locais: ${error.message}`);
    }

    // Mapear dados do banco para o tipo Place
    return (data || []).map((place) => ({
      id: place.id,
      name: place.name,
      description: place.description || undefined,
      image: place.image,
      imageUrl: place.image, // Para compatibilidade
      address: place.address || undefined,
      rating: Number(place.rating) || 0,
      category: place.category,
      latitude: place.latitude ? Number(place.latitude) : undefined,
      longitude: place.longitude ? Number(place.longitude) : undefined,
      reviewCount: place.review_count || 0,
      isSafe: place.is_safe ?? true,
      distance: undefined, // Será calculado no frontend se necessário
    }));
  } catch (error) {
    console.error('Erro ao buscar locais:', error);
    throw error;
  }
};

export const createPlace = async (placeData: {
  name: string;
  description?: string;
  image: string;
  address?: string;
  category: string;
  latitude?: number;
  longitude?: number;
  isSafe?: boolean;
}): Promise<Place> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data, error } = await supabase
      .from('places')
      .insert({
        name: placeData.name,
        description: placeData.description || null,
        image: placeData.image,
        address: placeData.address || null,
        category: placeData.category,
        latitude: placeData.latitude || null,
        longitude: placeData.longitude || null,
        is_safe: placeData.isSafe ?? true,
        created_by: userId || null,
        rating: 0,
        review_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar local:', error);
      throw new Error(`Erro ao criar local: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao criar local: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      image: data.image,
      imageUrl: data.image,
      address: data.address || undefined,
      rating: Number(data.rating) || 0,
      category: data.category,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      reviewCount: data.review_count || 0,
      isSafe: data.is_safe ?? true,
    };
  } catch (error) {
    console.error('Erro ao criar local:', error);
    throw error;
  }
};

export const getPlaceById = async (id: string): Promise<Place | null> => {
  try {
    const { data, error } = await supabase
      .from('places')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Não encontrado
      }
      console.error('Erro ao buscar local:', error);
      throw new Error(`Erro ao buscar local: ${error.message}`);
    }

    if (!data) return null;

    // Mapear dados do banco para o tipo Place
    return {
      id: data.id,
      name: data.name,
      description: data.description || undefined,
      image: data.image,
      imageUrl: data.image,
      address: data.address || undefined,
      rating: Number(data.rating) || 0,
      category: data.category,
      latitude: data.latitude ? Number(data.latitude) : undefined,
      longitude: data.longitude ? Number(data.longitude) : undefined,
      reviewCount: data.review_count || 0,
      isSafe: data.is_safe ?? true,
      distance: undefined,
    };
  } catch (error) {
    console.error('Erro ao buscar local:', error);
    throw error;
  }
};