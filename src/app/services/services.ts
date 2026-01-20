import { Service } from '../types';
import { supabase } from '../../lib/supabase';

export const getServices = async (): Promise<Service[]> => {
  try {
    console.log('🔍 Buscando serviços do Supabase...');
    
    // Primeiro, tentar buscar TODOS os serviços (sem filtro is_active) - FALLBACK
    const { data: allData, error: allError } = await supabase
      .from('services')
      .select('*');
    
    // Se conseguiu buscar todos, usar como fallback
    if (!allError && allData && allData.length > 0) {
      console.log(`📊 Total de serviços no banco (sem filtros): ${allData.length}`);
      console.log('📋 Exemplo de serviço encontrado:', {
        id: allData[0].id,
        name: allData[0].name,
        is_active: allData[0].is_active,
      });
    }
    
    // Agora tentar buscar com o filtro is_active
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false });

    // Se houver erro ou dados vazios, usar fallback (todos os dados)
    if (error || !data || data.length === 0) {
      if (error) {
        console.error('❌ Erro ao buscar serviços (com filtro is_active=true):', {
          message: error.message,
          code: error.code,
        });
      }
      
      // USAR FALLBACK: Se tiver todos os dados, usar eles
      if (allData && allData.length > 0) {
        console.warn('⚠️ Usando fallback: retornando todos os serviços (sem filtro is_active)');
        console.log(`✅ Retornando ${allData.length} serviços (fallback)`);
        
        return allData.map((service) => ({
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
      }
      
      // Se não tiver fallback, retornar vazio
      console.warn('⚠️ Nenhum serviço encontrado no banco');
      return [];
    }

    console.log(`✅ Serviços encontrados (com filtro is_active=true): ${data.length}`);

    return data.map((service) => ({
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
    console.error('❌ Erro ao buscar serviços:', error);
    // Tentar fallback final: buscar sem filtros
    try {
      const { data: fallbackData } = await supabase.from('services').select('*');
      if (fallbackData && fallbackData.length > 0) {
        console.warn('⚠️ Usando fallback final: retornando todos os serviços');
        return fallbackData.map((service) => ({
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
      }
    } catch (fallbackError) {
      console.error('❌ Erro no fallback:', fallbackError);
    }
    return [];
  }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Erro ao buscar serviço:', error);
      throw new Error(`Erro ao buscar serviço: ${error.message}`);
    }

    if (!data) return null;

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
    console.error('Erro ao buscar serviço:', error);
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
