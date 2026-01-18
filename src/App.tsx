import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './app/layouts/AuthLayout';
import { AppLayout } from './app/layouts/AppLayout';
import { Splash } from './app/pages/Splash';
import { Welcome } from './app/pages/Welcome';
import { Cadastro } from './app/pages/Cadastro';
import { Home } from './app/pages/Home';
import { Locais } from './app/pages/Locais';
import { PlaceDetails } from './app/pages/PlaceDetails';
import { Servicos } from './app/pages/Servicos';
import { ServiceDetails } from './app/pages/ServiceDetails';
import { ServicesByCategory } from './app/pages/ServicesByCategory';
import { Eventos } from './app/pages/Eventos';
import { EventDetails } from './app/pages/EventDetails';
import { Comunidade } from './app/pages/Comunidade';
import { Perfil } from './app/pages/Perfil';
import { EditarPerfil } from './app/pages/EditarPerfil';
import { Configuracoes } from './app/pages/Configuracoes';
import { CreateReview } from './app/pages/CreateReview';

function App() {
  return (
    <Routes>
      {/* Rotas de autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/splash" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Route>

      {/* Rotas da aplicação com navegação */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        
        {/* Locais */}
        <Route path="/locais" element={<Locais />} />
        <Route path="/locais/:id" element={<PlaceDetails />} />
        
        {/* Serviços */}
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/servicos/:id" element={<ServiceDetails />} />
        <Route path="/servicos/categoria/:slug" element={<ServicesByCategory />} />
        
        {/* Eventos */}
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/eventos/:id" element={<EventDetails />} />
        
        {/* Comunidade */}
        <Route path="/comunidade" element={<Comunidade />} />
        
        {/* Perfil */}
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfil/editar" element={<EditarPerfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        
        {/* Avaliação */}
        <Route path="/avaliacao/criar" element={<CreateReview />} />
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;