import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  pronouns?: string;
}

/**
 * Obtém a URL base do site (produção ou desenvolvimento)
 */
function getSiteUrl(): string {
  // Se estiver em produção (Vercel), usar a URL do Vercel
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Verificar se está em produção (Vercel)
    if (hostname.includes('vercel.app') || hostname.includes('amooora')) {
      return `${window.location.protocol}//${window.location.host}`;
    }
    
    // Se houver variável de ambiente para URL do site, usar ela
    const siteUrl = import.meta.env.VITE_SITE_URL;
    if (siteUrl) {
      return siteUrl;
    }
    
    // Fallback: usar a URL atual
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Fallback para SSR ou ambiente sem window
  return import.meta.env.VITE_SITE_URL || 'https://amooora-dev.vercel.app';
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
    // Obter URL base do site para redirecionamento após verificação de email
    const siteUrl = getSiteUrl();
    const redirectTo = `${siteUrl}/#/login?verified=true`;
    
    console.log('🔗 URL de redirecionamento configurada:', redirectTo);
    
    // 1. Cria o usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: redirectTo,
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
    // A foto será adicionada depois do upload (feito após autenticação)
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
    console.log('🔐 Tentando fazer login com:', { email: data.email });
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      console.error('❌ Erro de autenticação:', {
        message: authError.message,
        status: authError.status,
        name: authError.name,
      });
      
      // Mensagens de erro mais amigáveis
      let errorMessage = authError.message;
      if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos. Verifique suas credenciais.';
      } else if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login.';
      } else if (authError.message.includes('User not found')) {
        errorMessage = 'Usuário não encontrado. Verifique o email ou cadastre-se.';
      }
      
      return {
        user: null,
        session: null,
        error: errorMessage,
      };
    }

    if (!authData.user || !authData.session) {
      console.error('❌ Login sem usuário ou sessão:', { user: authData.user, session: authData.session });
      return {
        user: null,
        session: null,
        error: 'Erro ao fazer login: sessão não criada',
      };
    }

    console.log('✅ Login bem-sucedido!', { 
      userId: authData.user.id, 
      email: authData.user.email,
      hasSession: !!authData.session 
    });

    return {
      user: authData.user,
      session: authData.session,
      error: null,
    };
  } catch (error) {
    console.error('❌ Erro fatal no signIn:', error);
    return {
      user: null,
      session: null,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao fazer login',
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
