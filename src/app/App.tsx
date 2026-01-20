import { useState, useEffect } from 'react';
import { Welcome } from './pages/Welcome';
import { Cadastro } from './pages/Cadastro';
import { Home } from './pages/Home';
import { Locais } from './pages/Locais';
import { Servicos } from './pages/Servicos';
import { Eventos } from './pages/Eventos';
import { Comunidade } from './pages/Comunidade';
import { Perfil } from './pages/Perfil';
import { EditarPerfil } from './pages/EditarPerfil';
import { Configuracoes } from './pages/Configuracoes';
import { PlaceDetails } from './components/PlaceDetails';
import { ServiceDetails } from './components/ServiceDetails';
import { EventDetails } from './components/EventDetails';
import { ServiceCategoryList } from './pages/ServiceCategoryList';
import { CreateReview } from './pages/CreateReview';
import { Admin } from './pages/Admin';
import { AdminLogin } from './pages/AdminLogin';
import { AdminCadastro } from './pages/AdminCadastro';
import { AdminCadastrarLocal } from './pages/AdminCadastrarLocal';
import { AdminCadastrarServico } from './pages/AdminCadastrarServico';
import { AdminCadastrarEvento } from './pages/AdminCadastrarEvento';
import { supabase } from '../lib/supabase';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [previousPage, setPreviousPage] = useState('home');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Verificar se o usuário é admin ao carregar a página
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Verificar se o usuário é admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin, role')
            .eq('id', session.user.id)
            .single();

          const isAdmin = profile?.is_admin === true || profile?.role === 'admin';
          setIsAdminAuthenticated(isAdmin);
        } else {
          setIsAdminAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação admin:', error);
        setIsAdminAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAdminAuth();

    // Listener para mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdminAuthenticated(false);
      } else if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin, role')
          .eq('id', session.user.id)
          .single();

        const isAdmin = profile?.is_admin === true || profile?.role === 'admin';
        setIsAdminAuthenticated(isAdmin);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleNavigate = (page: string) => {
    setPreviousPage(currentPage);
    
    // Verificar se a página contém um ID (formato: 'place-details:id')
    if (page.startsWith('place-details:')) {
      const placeId = page.split(':')[1];
      setSelectedPlaceId(placeId);
      setCurrentPage('place-details');
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome onNavigate={handleNavigate} />;
      case 'register':
        return <Cadastro onNavigate={handleNavigate} />;
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'places':
        return <Locais onNavigate={handleNavigate} />;
      case 'place-details':
        return <PlaceDetails 
          placeId={selectedPlaceId}
          onNavigate={handleNavigate} 
          onBack={() => {
            // Volta para a página anterior (home ou places)
            setCurrentPage(previousPage === 'places' ? 'places' : 'home');
            setSelectedPlaceId(undefined);
          }} 
        />;
      case 'create-review':
        return <CreateReview onNavigate={handleNavigate} />;
      case 'services':
        return <Servicos onNavigate={handleNavigate} />;
      case 'service-details':
        return <ServiceDetails onNavigate={handleNavigate} onBack={() => setCurrentPage('services')} />;
      case 'service-category-terapia':
        return <ServiceCategoryList category="terapia" onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} />;
      case 'service-category-advocacia':
        return <ServiceCategoryList category="advocacia" onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} />;
      case 'service-category-saude':
        return <ServiceCategoryList category="saude" onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} />;
      case 'service-category-carreira':
        return <ServiceCategoryList category="carreira" onNavigate={handleNavigate} onBack={() => setCurrentPage('home')} />;
      case 'events':
        return <Eventos onNavigate={handleNavigate} />;
      case 'event-details':
        return <EventDetails onNavigate={handleNavigate} onBack={() => setCurrentPage('events')} />;
      case 'community':
        return <Comunidade onNavigate={handleNavigate} />;
      case 'profile':
        return <Perfil onNavigate={handleNavigate} />;
      case 'edit-profile':
        return <EditarPerfil onNavigate={handleNavigate} />;
      case 'settings':
        return <Configuracoes onBack={() => setCurrentPage('profile')} />;
      case 'admin':
        // Se ainda estiver verificando, mostrar loading
        if (isCheckingAuth) {
          return (
            <div className="min-h-screen bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Verificando autenticação...</p>
            </div>
          );
        }
        // Se não estiver autenticado, mostrar login
        if (!isAdminAuthenticated) {
          return (
            <AdminLogin
              onNavigate={handleNavigate}
              onLoginSuccess={async () => {
                // Verificar novamente após login
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                  const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin, role')
                    .eq('id', session.user.id)
                    .single();
                  const isAdmin = profile?.is_admin === true || profile?.role === 'admin';
                  setIsAdminAuthenticated(isAdmin);
                }
              }}
            />
          );
        }
        return <Admin onNavigate={handleNavigate} />;
      case 'admin-login':
        return (
          <AdminLogin
            onNavigate={handleNavigate}
            onLoginSuccess={() => {
              setIsAdminAuthenticated(true);
              setCurrentPage('admin');
            }}
          />
        );
      case 'admin-cadastrar-usuario':
        // Verificar autenticação antes de mostrar páginas admin
        if (!isAdminAuthenticated) {
          return (
            <AdminLogin
              onNavigate={handleNavigate}
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                setCurrentPage('admin-cadastrar-usuario');
              }}
            />
          );
        }
        return <AdminCadastro onNavigate={handleNavigate} />;
      case 'admin-cadastrar-local':
        if (!isAdminAuthenticated) {
          return (
            <AdminLogin
              onNavigate={handleNavigate}
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                setCurrentPage('admin-cadastrar-local');
              }}
            />
          );
        }
        return <AdminCadastrarLocal onNavigate={handleNavigate} />;
      case 'admin-cadastrar-servico':
        if (!isAdminAuthenticated) {
          return (
            <AdminLogin
              onNavigate={handleNavigate}
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                setCurrentPage('admin-cadastrar-servico');
              }}
            />
          );
        }
        return <AdminCadastrarServico onNavigate={handleNavigate} />;
      case 'admin-cadastrar-evento':
        if (!isAdminAuthenticated) {
          return (
            <AdminLogin
              onNavigate={handleNavigate}
              onLoginSuccess={() => {
                setIsAdminAuthenticated(true);
                setCurrentPage('admin-cadastrar-evento');
              }}
            />
          );
        }
        return <AdminCadastrarEvento onNavigate={handleNavigate} />;
      default:
        return <Welcome onNavigate={handleNavigate} />;
    }
  };

  return renderPage();
}