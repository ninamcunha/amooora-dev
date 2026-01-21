import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        setLoading(true);
        
        // Verificar se está em modo visitante (guest mode)
        const guestMode = localStorage.getItem('guestMode') === 'true';
        if (guestMode) {
          console.log('👤 useAdmin: Modo visitante ativo - permitindo acesso admin');
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        console.log('🔍 useAdmin: Verificando sessão...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!session || !session.user || sessionError) {
          console.log('❌ useAdmin: Sem sessão ou erro:', { sessionError });
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        console.log('✅ useAdmin: Sessão encontrada:', { 
          email: session.user.email, 
          userId: session.user.id 
        });

        // Verificar se é admin por email
        const isAdminByEmail = session.user.email === 'admin@amooora.com';
        console.log('🔍 useAdmin: Verificando email admin:', { 
          email: session.user.email, 
          isAdminByEmail 
        });
        
        if (isAdminByEmail) {
          console.log('✅ useAdmin: Admin detectado por email!');
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Verificar no perfil
        console.log('🔍 useAdmin: Verificando perfil...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.log('⚠️ useAdmin: Erro ao buscar perfil:', profileError);
          setIsAdmin(false);
        } else {
          const isAdminByProfile = profile?.is_admin === true || profile?.role === 'admin';
          console.log('🔍 useAdmin: Resultado do perfil:', { 
            is_admin: profile?.is_admin, 
            role: profile?.role,
            isAdminByProfile 
          });
          setIsAdmin(isAdminByProfile);
        }
      } catch (error) {
        console.error('❌ useAdmin: Erro ao verificar admin:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();

    // Listener para mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 useAdmin: Mudança na sessão:', { event, hasSession: !!session });
      
      // Verificar modo visitante novamente
      const guestMode = localStorage.getItem('guestMode') === 'true';
      if (guestMode) {
        setIsAdmin(true);
        return;
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('👋 useAdmin: Usuário deslogado');
        setIsAdmin(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user) {
          console.log('🔐 useAdmin: Usuário logado:', { email: session.user.email });
          
          // Verificar se é admin por email
          const isAdminByEmail = session.user.email === 'admin@amooora.com';
          console.log('🔍 useAdmin: Verificando email admin:', { 
            email: session.user.email, 
            isAdminByEmail 
          });
          
          if (isAdminByEmail) {
            console.log('✅ useAdmin: Admin detectado por email!');
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
            console.log('🔍 useAdmin: Resultado do perfil:', { 
              is_admin: profile?.is_admin, 
              role: profile?.role,
              isAdminByProfile 
            });
            setIsAdmin(isAdminByProfile);
          } catch (error) {
            console.error('❌ useAdmin: Erro ao verificar perfil:', error);
            setIsAdmin(false);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
};
