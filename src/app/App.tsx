import { useState, useEffect } from 'react';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
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
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Verificar se o usuário é admin quando há sessão
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Se não houver sessão, não é admin
        if (!session || !session.user || sessionError) {
          setIsAdminAuthenticated(false);
          return;
        }

        // Verificar se o usuário é admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          // Se o perfil não existe ou erro, não é admin
          console.log('Perfil não encontrado:', profileError);
          setIsAdminAuthenticated(false);
        } else {
          const isAdmin = profile?.is_admin === true || profile?.role === 'admin';
          setIsAdminAuthenticated(isAdmin);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação admin:', error);
        setIsAdminAuthenticated(false);
      }
    };

    // Verificar apenas uma vez ao carregar
    checkAdminAuth();

    // Listener para mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdminAuthenticated(false);
      } else if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin, role')
            .eq('id', session.user.id)
            .single();

          const isAdmin = profile?.is_admin === true || profile?.role === 'admin';
          setIsAdminAuthenticated(isAdmin);
        } catch (error) {
          console.error('Erro ao verificar admin após mudança de sessão:', error);
          setIsAdminAuthenticated(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleNavigate = (page: string) => {
    setPreviousPage(currentPage);
    
    // Verificar se a página contém um ID (formato: 'place-details:id', 'event-details:id' ou 'service-details:id')
    if (page.startsWith('place-details:')) {
      const placeId = page.split(':')[1];
      setSelectedPlaceId(placeId);
      setCurrentPage('place-details');
    } else if (page.startsWith('event-details:')) {
      const eventId = page.split(':')[1];
      setSelectedEventId(eventId);
      setCurrentPage('event-details');
    } else if (page.startsWith('service-details:')) {
      const serviceId = page.split(':')[1];
      setSelectedServiceId(serviceId);
      setCurrentPage('service-details');
    } else {
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
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
        return <ServiceDetails 
          serviceId={selectedServiceId}
          onNavigate={handleNavigate} 
          onBack={() => {
            setCurrentPage('services');
            setSelectedServiceId(undefined);
          }} 
        />;
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
        return (
          <EventDetails 
            eventId={selectedEventId}
            onNavigate={handleNavigate} 
            onBack={() => {
              setCurrentPage(previousPage === 'events' ? 'events' : 'home');
              setSelectedEventId(undefined);
            }} 
          />
        );
      case 'community':
        return <Comunidade onNavigate={handleNavigate} />;
      case 'profile':
        return <Perfil onNavigate={handleNavigate} />;
      case 'edit-profile':
        return <EditarPerfil onNavigate={handleNavigate} />;
      case 'settings':
        return <Configuracoes onBack={() => setCurrentPage('profile')} />;
      case 'admin':
        // Se não estiver autenticado como admin, mostrar login
        if (!isAdminAuthenticated) {
          return (
            <AdminLogin
              onNavigate={handleNavigate}
              onLoginSuccess={async () => {
                // Verificar novamente após login
                try {
                  const { data: { session } } = await supabase.auth.getSession();
                  if (session?.user) {
                    const { data: profile, error: profileError } = await supabase
                      .from('profiles')
                      .select('is_admin, role')
                      .eq('id', session.user.id)
                      .single();
                    
                    if (!profileError && profile) {
                      const isAdmin = profile.is_admin === true || profile.role === 'admin';
                      setIsAdminAuthenticated(isAdmin);
                    }
                  }
                } catch (error) {
                  console.error('Erro ao verificar admin após login:', error);
                  setIsAdminAuthenticated(false);
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