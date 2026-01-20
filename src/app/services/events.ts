import { Event } from '../types';
import { supabase } from '../../lib/supabase';

export const getEvents = async (): Promise<Event[]> => {
  try {
    console.log('🔍 Buscando eventos do Supabase...');
    const today = new Date().toISOString();
    console.log('📅 Data de hoje para filtro:', today);
    
    // Primeiro, tentar buscar TODOS os eventos (sem filtros) para diagnóstico
    const { data: allData, error: allError } = await supabase
      .from('events')
      .select('*');
    
    if (allError) {
      console.error('❌ Erro ao buscar TODOS os eventos (sem filtros):', {
        message: allError.message,
        code: allError.code,
        details: allError.details,
        hint: allError.hint,
      });
    } else {
      console.log(`📊 Total de eventos no banco (sem filtros): ${allData?.length || 0}`);
      if (allData && allData.length > 0) {
        console.log('📋 Exemplo de evento encontrado:', {
          id: allData[0].id,
          name: allData[0].name,
          is_active: allData[0].is_active,
          date: allData[0].date,
          date_is_future: allData[0].date >= today,
        });
      }
    }
    
    // Agora buscar com os filtros is_active e date
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('date', today) // Apenas eventos futuros
      .order('date', { ascending: true });

    if (error) {
      console.error('❌ Erro detalhado ao buscar eventos (com filtros):', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      
      // Se for erro de RLS, retornar array vazio em vez de quebrar
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        console.warn('⚠️ Aviso: Política RLS pode estar bloqueando. Retornando array vazio.');
        return [];
      }
      
      throw new Error(`Erro ao buscar eventos: ${error.message}`);
    }

    console.log(`✅ Eventos encontrados (is_active=true E date>=hoje): ${data?.length || 0}`);
    
    if (data && data.length === 0 && allData && allData.length > 0) {
      console.warn('⚠️ ATENÇÃO: Existem eventos no banco, mas nenhum passa pelos filtros!');
      const activeCount = allData.filter(e => e.is_active === true).length;
      const futureCount = allData.filter(e => e.date >= today).length;
      console.log(`💡 Diagnóstico: ${activeCount} ativos, ${futureCount} futuros`);
      console.log('💡 Solução: Verifique os campos is_active e date na tabela events no Supabase.');
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
    // Retornar array vazio em vez de quebrar a aplicação
    console.warn('Retornando array vazio devido a erro na busca de eventos');
    return [];
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
