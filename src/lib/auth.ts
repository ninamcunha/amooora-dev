import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  pronouns?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

/**
 * Cria uma nova conta de usuário no Supabase
 */
export async function signUp(data: SignUpData) {
  try {
    // 1. Cria o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          pronouns: data.pronouns || null,
        },
      },
    });

    if (authError) {
      throw new Error(`Erro ao criar conta: ${authError.message}`);
    }

    if (!authData.user) {
      throw new Error('Erro ao criar usuário');
    }

    // 2. O perfil é criado automaticamente pelo trigger handle_new_user()
    // Mas garantimos que ele exista com os dados corretos usando UPSERT
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: data.email,
        name: data.name,
        pronouns: data.pronouns || null,
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Erro ao criar/atualizar perfil:', profileError);
      // Não é crítico, o perfil já pode ter sido criado pelo trigger
      // Mas logamos o erro para debug
    }

    return {
      user: authData.user,
      session: authData.session,
      error: null,
    };
  } catch (error) {
    console.error('Erro no signUp:', error);
    return {
      user: null,
      session: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Faz login do usuário
 */
export async function signIn(data: SignInData) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      throw new Error(`Erro ao fazer login: ${authError.message}`);
    }

    return {
      user: authData.user,
      session: authData.session,
      error: null,
    };
  } catch (error) {
    console.error('Erro no signIn:', error);
    return {
      user: null,
      session: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Faz logout do usuário
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Erro no signOut:', error);
    return {
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Obtém o usuário atual logado
 */
export async function getCurrentAuthUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Verifica se há uma sessão ativa
 */
export function getSession() {
  return supabase.auth.getSession();
}
