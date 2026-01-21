import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!session || !session.user || sessionError) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Verificar se é admin por email
        const isAdminByEmail = session.user.email === 'admin@amooora.com';
        
        if (isAdminByEmail) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Verificar no perfil
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          setIsAdmin(false);
        } else {
          const isAdminByProfile = profile?.is_admin === true || profile?.role === 'admin';
          setIsAdmin(isAdminByProfile);
        }
      } catch (error) {
        console.error('Erro ao verificar admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();

    // Listener para mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      } else if (session?.user) {
        const isAdminByEmail = session.user.email === 'admin@amooora.com';
        
        if (isAdminByEmail) {
          setIsAdmin(true);
          return;
        }

        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin, role')
            .eq('id', session.user.id)
            .single();

          const isAdminByProfile = profile?.is_admin === true || profile?.role === 'admin';
          setIsAdmin(isAdminByProfile);
        } catch (error) {
          setIsAdmin(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
};
