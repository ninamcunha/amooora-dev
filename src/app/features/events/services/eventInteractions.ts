import { supabase } from '../../../infra/supabase';

/**
 * Marcar evento como "Tenho interesse"
 */
export async function markEventAsInterested(eventId: string): Promise<void> {
  try {
    console.log('🔍 [markEventAsInterested] Iniciando para eventId:', eventId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ [markEventAsInterested] Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('✅ [markEventAsInterested] Usuário autenticado:', user.id);

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('event_interests')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    if (existing) {
      console.log('ℹ️ [markEventAsInterested] Interesse já existe, não fazendo nada');
      return;
    }

    // Inserir novo interesse
    console.log('💾 [markEventAsInterested] Inserindo novo interesse:', { user_id: user.id, event_id: eventId });
    const { data: inserted, error } = await supabase
      .from('event_interests')
      .insert({
        user_id: user.id,
        event_id: eventId,
      })
      .select();

    if (error) {
      console.error('❌ [markEventAsInterested] Erro ao marcar interesse:', error);
      throw new Error(`Erro ao marcar interesse: ${error.message}`);
    }

    console.log('✅ [markEventAsInterested] Interesse salvo com sucesso:', inserted);
  } catch (error) {
    console.error('❌ [markEventAsInterested] Erro ao marcar evento como interessado:', error);
    throw error;
  }
}

/**
 * Remover interesse de um evento
 */
export async function removeEventInterest(eventId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('event_interests')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);

    if (error) {
      console.error('Erro ao remover interesse:', error);
      throw new Error(`Erro ao remover interesse: ${error.message}`);
    }
  } catch (error) {
    console.error('Erro ao remover interesse do evento:', error);
    throw error;
  }
}

/**
 * Verificar se usuário tem interesse em um evento
 */
export async function hasEventInterest(eventId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('event_interests')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar interesse:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar interesse do evento:', error);
    return false;
  }
}

/**
 * Marcar evento como "Fui!"
 */
export async function markEventAsAttended(eventId: string): Promise<void> {
  try {
    console.log('🔍 [markEventAsAttended] Iniciando para eventId:', eventId);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('❌ [markEventAsAttended] Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('✅ [markEventAsAttended] Usuário autenticado:', user.id);

    // Verificar se já existe
    const { data: existing } = await supabase
      .from('event_participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    if (existing) {
      console.log('ℹ️ [markEventAsAttended] Participação já existe, não fazendo nada');
      return;
    }

    // Inserir novo participante
    console.log('💾 [markEventAsAttended] Inserindo nova participação:', { user_id: user.id, event_id: eventId });
    const { data: inserted, error } = await supabase
      .from('event_participants')
      .insert({
        user_id: user.id,
        event_id: eventId,
      })
      .select();

    if (error) {
      console.error('❌ [markEventAsAttended] Erro ao marcar como participou:', error);
      throw new Error(`Erro ao marcar como participou: ${error.message}`);
    }

    console.log('✅ [markEventAsAttended] Participação salva com sucesso:', inserted);
  } catch (error) {
    console.error('❌ [markEventAsAttended] Erro ao marcar evento como participado:', error);
    throw error;
  }
}

/**
 * Remover marcação de "Fui!"
 */
export async function removeEventAttendance(eventId: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('user_id', user.id)
      .eq('event_id', eventId);

    if (error) {
      console.error('Erro ao remover participação:', error);
      throw new Error(`Erro ao remover participação: ${error.message}`);
    }
  } catch (error) {
    console.error('Erro ao remover participação do evento:', error);
    throw error;
  }
}

/**
 * Verificar se usuário participou de um evento
 */
export async function hasEventAttendance(eventId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('event_participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', eventId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar participação:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Erro ao verificar participação do evento:', error);
    return false;
  }
}

/**
 * Buscar eventos que o usuário tem interesse
 */
export async function getUserInterestedEvents(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('event_interests')
      .select('event_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar eventos de interesse:', error);
      return [];
    }

    return (data || []).map((item) => item.event_id);
  } catch (error) {
    console.error('Erro ao buscar eventos de interesse:', error);
    return [];
  }
}

/**
 * Buscar eventos que o usuário participou
 */
export async function getUserAttendedEvents(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select('event_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar eventos participados:', error);
      return [];
    }

    return (data || []).map((item) => item.event_id);
  } catch (error) {
    console.error('Erro ao buscar eventos participados:', error);
    return [];
  }
}
