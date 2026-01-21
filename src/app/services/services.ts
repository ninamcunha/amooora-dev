import { Service } from '../types';
import { supabase } from '../../lib/supabase';

export const getServices = async (): Promise<Service[]> => {
  try {
    console.log('🔍 Buscando serviços do Supabase...');
    
    // Buscar TODOS os serviços (sem filtro is_active primeiro para evitar timeout)
    // Se a query com filtro falhar, já temos os dados
    const { data: allData, error: allError } = await supabase
      .from('services')
      .select('*')
      .order('rating', { ascending: false })
      .limit(100); // Limitar para evitar queries muito grandes
    
    if (allError) {
      console.error('❌ Erro ao buscar serviços:', {
        message: allError.message,
        code: allError.code,
        details: allError.details,
      });
      
      // Se houver erro, tentar query mais simples
      try {
        const { data: simpleData, error: simpleError } = await supabase
          .from('services')
          .select('id, name, category')
          .limit(50);
        
        if (!simpleError && simpleData && simpleData.length > 0) {
          console.warn('⚠️ Usando query simplificada');
          return simpleData.map((service: any) => ({
            id: service.id,
            name: service.name,
            description: '',
            image: undefined,
            imageUrl: undefined,
            price: undefined,
            category: service.category,
            categorySlug: service.category?.toLowerCase().replace(/\s+/g, '-') || '',
            rating: 0,
            provider: undefined,
          }));
        }
      } catch (simpleError) {
        console.error('❌ Erro na query simplificada:', simpleError);
      }
      
      throw new Error(`Erro ao buscar serviços: ${allError.message}`);
    }

    if (!allData || allData.length === 0) {
      console.warn('⚠️ Nenhum serviço encontrado no banco');
      return [];
    }

    console.log(`✅ Total de serviços encontrados: ${allData.length}`);

    // Filtrar apenas serviços ativos no frontend (mais rápido)
    const activeServices = allData.filter((service) => service.is_active !== false);

    return activeServices.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description || '',
      image: service.image || undefined,
      imageUrl: service.image || undefined,
      price: service.price ? Number(service.price) : undefined,
      category: service.category || 'Outros',
      categorySlug: service.category_slug || (service.category?.toLowerCase().replace(/\s+/g, '-') || 'outros'),
      rating: Number(service.rating) || 0,
      provider: service.provider || undefined,
    }));
  } catch (error) {
    console.error('❌ Erro ao buscar serviços:', error);
    // Retornar array vazio em vez de lançar erro para evitar quebrar a UI
    return [];
  }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    // Validar se o ID é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      console.warn(`⚠️ ID inválido (não é UUID): ${id}`);
      return null;
    }

    console.log(`🔍 Buscando serviço pelo ID: ${id}`);
    
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️ Serviço não encontrado (PGRST116)');
        return null;
      }
      
      console.error('❌ Erro detalhado ao buscar serviço:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      
      // Se for erro de RLS, tentar buscar sem filtro single (retornar array e pegar primeiro)
      if (error.code === '42501' || error.message?.includes('row-level security')) {
        console.warn('⚠️ Erro de RLS detectado, tentando fallback...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('services')
          .select('*')
          .eq('id', id);
        
        if (!fallbackError && fallbackData && fallbackData.length > 0) {
          console.log('✅ Serviço encontrado via fallback');
          const service = fallbackData[0];
          return {
            id: service.id,
            name: service.name,
            description: service.description,
            image: service.image,
            imageUrl: service.image,
            price: service.price ? Number(service.price) : undefined,
            category: service.category,
            categorySlug: service.category_slug,
            rating: Number(service.rating) || 0,
            provider: service.provider || undefined,
          };
        }
      }
      
      throw new Error(`Erro ao buscar serviço: ${error.message}`);
    }

    if (!data) {
      console.log('⚠️ Serviço não encontrado (data vazio)');
      return null;
    }

    console.log(`✅ Serviço encontrado: ${data.name}`);

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      imageUrl: data.image,
      price: data.price ? Number(data.price) : undefined,
      category: data.category,
      categorySlug: data.category_slug,
      rating: Number(data.rating) || 0,
      provider: data.provider || undefined,
    };
  } catch (error) {
    console.error('❌ Erro ao buscar serviço:', error);
    // Tentar fallback final: buscar todos os serviços e filtrar manualmente
    try {
      const { data: allServices } = await supabase.from('services').select('*');
      if (allServices && allServices.length > 0) {
        const service = allServices.find(s => s.id === id);
        if (service) {
          console.warn('⚠️ Serviço encontrado via fallback final');
          return {
            id: service.id,
            name: service.name,
            description: service.description,
            image: service.image,
            imageUrl: service.image,
            price: service.price ? Number(service.price) : undefined,
            category: service.category,
            categorySlug: service.category_slug,
            rating: Number(service.rating) || 0,
            provider: service.provider || undefined,
          };
        }
      }
    } catch (fallbackError) {
      console.error('❌ Erro no fallback final:', fallbackError);
    }
    throw error;
  }
};

export const createService = async (serviceData: {
  name: string;
  description: string;
  image: string;
  category: string;
  categorySlug: string;
  price?: number;
  provider?: string;
}): Promise<Service> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    const { data, error } = await supabase
      .from('services')
      .insert({
        name: serviceData.name,
        description: serviceData.description,
        image: serviceData.image,
        category: serviceData.category,
        category_slug: serviceData.categorySlug,
        price: serviceData.price || null,
        provider: serviceData.provider || null,
        created_by: userId || null,
        rating: 0,
        review_count: 0,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error(`Erro ao criar serviço: ${error.message}`);
    }

    if (!data) {
      throw new Error('Erro ao criar serviço: nenhum dado retornado');
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      image: data.image,
      imageUrl: data.image,
      price: data.price ? Number(data.price) : undefined,
      category: data.category,
      categorySlug: data.category_slug,
      rating: Number(data.rating) || 0,
      provider: data.provider || undefined,
    };
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    throw error;
  }
};

export const getServicesByCategory = async (categorySlug: string): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('category_slug', categorySlug)
      .eq('is_active', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('Erro ao buscar serviços por categoria:', error);
      throw new Error(`Erro ao buscar serviços por categoria: ${error.message}`);
    }

    return (data || []).map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description,
      image: service.image,
      imageUrl: service.image,
      price: service.price ? Number(service.price) : undefined,
      category: service.category,
      categorySlug: service.category_slug,
      rating: Number(service.rating) || 0,
      provider: service.provider || undefined,
    }));
  } catch (error) {
    console.error('Erro ao buscar serviços por categoria:', error);
    throw error;
  }
};
