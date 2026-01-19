import { Event } from '../types';
import { supabase } from '../../lib/supabase';

export const getEvents = async (): Promise<Event[]> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('date', new Date().toISOString()) // Apenas eventos futuros
      .order('date', { ascending: true });

    if (error) {
      console.error('Erro ao buscar eventos:', error);
      throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }

    return (data || []).map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      image: event.image || undefined,
      imageUrl: event.image || undefined,
      date: event.date,
      time: event.date ? new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      location: event.location,
      category: event.category,
      price: event.price ? Number(event.price) : undefined,
      participants: event.participants_count || 0,
    }));
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    throw error;
  }
};

export const createEvent = async (eventData: {
  name: string;
  description: string;
  image?: string;
  date: string; // ISO string
  location: string;
  category: string;
  price?: number;
}): Promise<Event> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data, error } = await supabase
      .from('events')
      .insert({
        name: eventData.name,
        description: eventData.description,
        image: eventData.image || null,
        date: eventData.date,
        location: eventData.location,
        category: eventData.category,
        price: eventData.price || null,
        created_by: userId || null,
        is_active: true,
        participants_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar evento:', error);
      throw new Error(`Erro ao criar evento: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao criar evento: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image || undefined,
      imageUrl: data.image || undefined,
      date: data.date,
      time: data.date ? new Date(data.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      location: data.location,
      category: data.category,
      price: data.price ? Number(data.price) : undefined,
      participants: data.participants_count || 0,
    };
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw error;
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erro ao buscar evento:', error);
      throw new Error(`Erro ao buscar evento: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image || undefined,
      imageUrl: data.image || undefined,
      date: data.date,
      time: data.date ? new Date(data.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined,
      location: data.location,
      category: data.category,
      price: data.price ? Number(data.price) : undefined,
      participants: data.participants_count || 0,
    };
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    throw error;
  }
};
