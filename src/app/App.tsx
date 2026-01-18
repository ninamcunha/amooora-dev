import { useState } from 'react';
import { Splash } from './pages/Splash';
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

export default function App() {
  const [currentPage, setCurrentPage] = useState('welcome');
  const [previousPage, setPreviousPage] = useState('home');

  const handleNavigate = (page: string) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'splash':
        return <Splash onComplete={() => setCurrentPage('welcome')} />;
      case 'welcome':
        return <Welcome onNavigate={handleNavigate} />;
      case 'register':
        return <Cadastro onNavigate={handleNavigate} />;
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'places':
        return <Locais onNavigate={handleNavigate} />;
      case 'place-details':
        return <PlaceDetails onNavigate={handleNavigate} onBack={() => {
          // Volta para a página anterior (home ou places)
          setCurrentPage(previousPage === 'places' ? 'places' : 'home');
        }} />;
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
      default:
        return <Welcome onNavigate={handleNavigate} />;
    }
  };

  return renderPage();
}