import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export interface Profile {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  pronouns?: string;
  city?: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Buscar usuário autenticado
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !authUser) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Buscar perfil do usuário
        const { data, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Perfil não encontrado, criar um básico
            setProfile({
              id: authUser.id,
              name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
              email: authUser.email || '',
              username: authUser.email?.split('@')[0] || undefined,
              avatar: authUser.user_metadata?.avatar || undefined,
            });
            setLoading(false);
            return;
          }
          throw new Error(`Erro ao buscar perfil: ${profileError.message}`);
        }

        if (!data) {
          setProfile(null);
          setLoading(false);
          return;
        }

        // Gerar username a partir do email se não existir
        const username = data.email?.split('@')[0] || undefined;

        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          username: username,
          avatar: data.avatar || undefined,
          phone: data.phone || undefined,
          bio: data.bio || undefined,
          pronouns: data.pronouns || undefined,
          city: data.city || undefined,
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao carregar perfil'));
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // Listener para mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadProfile();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { profile, loading, error };
};
