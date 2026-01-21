import { useState } from 'react';
import { Welcome } from './pages/Welcome';
import { Home } from './pages/Home';
import { Locais } from './pages/Locais';
import { Servicos } from './pages/Servicos';
import { Eventos } from './pages/Eventos';
import { Comunidade } from './pages/Comunidade';
import { Perfil } from './pages/Perfil';
import { EditarPerfil } from './pages/EditarPerfil';
import { Configuracoes } from './pages/Configuracoes';
import { Notificacoes } from './pages/Notificacoes';
import { PostDetails } from './pages/PostDetails';
import { MeusFavoritos } from './pages/MeusFavoritos';
import { PlaceDetails } from './components/PlaceDetails';
import { ServiceDetails } from './components/ServiceDetails';
import { EventDetails } from './components/EventDetails';
import { ServiceCategoryList } from './pages/ServiceCategoryList';
import { CreateReview } from './pages/CreateReview';
import { GlobalSearch } from './components/GlobalSearch';
import { Admin } from './pages/Admin';
import { AdminCadastro } from './pages/AdminCadastro';
import { AdminCadastrarLocal } from './pages/AdminCadastrarLocal';
import { AdminCadastrarServico } from './pages/AdminCadastrarServico';
import { AdminCadastrarEvento } from './pages/AdminCadastrarEvento';

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [previousPage, setPreviousPage] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | undefined>(undefined);
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>(undefined);

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

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
    } else if (page.startsWith('services:')) {
      // Formato: 'services:Categoria' - navegar para serviços com categoria pré-selecionada
      const category = page.split(':')[1];
      setSelectedCategory(category);
      setCurrentPage('services');
    } else if (page.startsWith('post-details:')) {
      const postId = page.split(':')[1];
      setSelectedPostId(postId);
      setCurrentPage('post-details');
    } else if (page.startsWith('create-review:')) {
      // Formato: 'create-review:place:id', 'create-review:service:id', 'create-review:event:id'
      const parts = page.split(':');
      const itemType = parts[1]; // place, service ou event
      const itemId = parts[2];
      
      if (itemType === 'place') {
        setSelectedPlaceId(itemId);
      } else if (itemType === 'service') {
        setSelectedServiceId(itemId);
      } else if (itemType === 'event') {
        setSelectedEventId(itemId);
      }
      setCurrentPage('create-review');
    } else {
      setSelectedCategory(undefined); // Limpar categoria ao navegar para outras páginas
      setCurrentPage(page);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome onNavigate={handleNavigate} />;
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'places':
        return <Locais onNavigate={handleNavigate} />;
      case 'place-details':
        return <PlaceDetails 
          placeId={selectedPlaceId}
          onNavigate={handleNavigate} 
          onBack={() => {
            setCurrentPage(previousPage === 'places' ? 'places' : 'home');
            setSelectedPlaceId(undefined);
          }} 
        />;
      case 'create-review':
        // Determinar qual tipo de item baseado nos IDs disponíveis
        if (selectedPlaceId) {
          return <CreateReview 
            onNavigate={handleNavigate} 
            placeId={selectedPlaceId}
            itemType="place"
            onBack={() => {
              setCurrentPage('place-details');
            }}
          />;
        } else if (selectedServiceId) {
          return <CreateReview 
            onNavigate={handleNavigate} 
            serviceId={selectedServiceId}
            itemType="service"
            onBack={() => {
              setCurrentPage('service-details');
            }}
          />;
        } else if (selectedEventId) {
          return <CreateReview 
            onNavigate={handleNavigate} 
            eventId={selectedEventId}
            itemType="event"
            onBack={() => {
              setCurrentPage('event-details');
            }}
          />;
        }
        return <CreateReview onNavigate={handleNavigate} />;
      case 'services':
        return <Servicos onNavigate={handleNavigate} initialCategory={selectedCategory} />;
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
      case 'post-details':
        return (
          <PostDetails 
            postId={selectedPostId || ''}
            onNavigate={handleNavigate}
            onBack={() => {
              setCurrentPage('community');
              setSelectedPostId(undefined);
            }}
          />
        );
      case 'profile':
        return <Perfil onNavigate={handleNavigate} />;
      case 'edit-profile':
        return <EditarPerfil onNavigate={handleNavigate} />;
      case 'settings':
        return <Configuracoes onBack={() => setCurrentPage('profile')} />;
      case 'notifications':
        return <Notificacoes onNavigate={handleNavigate} />;
      case 'favoritos':
        return <MeusFavoritos onNavigate={handleNavigate} />;
      case 'admin':
        return <Admin onNavigate={handleNavigate} />;
      case 'admin-cadastrar-usuario':
        return <AdminCadastro onNavigate={handleNavigate} />;
      case 'admin-cadastrar-local':
        return <AdminCadastrarLocal onNavigate={handleNavigate} />;
      case 'admin-cadastrar-servico':
        return <AdminCadastrarServico onNavigate={handleNavigate} />;
      case 'admin-cadastrar-evento':
        return <AdminCadastrarEvento onNavigate={handleNavigate} />;
      default:
        return <Welcome onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onNavigate={handleNavigate}
      />
    </>
  );
}