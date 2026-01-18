import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CommunityStats } from '../components/CommunityStats';
import { CommunityFilters } from '../components/CommunityFilters';
import { CommunityPostCard } from '../components/CommunityPostCard';
import { BottomNav } from '../components/BottomNav';

const categories = ['Todos', 'Apoio', 'Dicas', 'Eventos', 'Geral'];

const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Maria Santos',
      avatarUrl: 'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY3Nzg5MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    timeAgo: '2h atrás',
    title: 'Lugares seguros para viajar sozinha?',
    description: 'Estou planejando uma viagem para o nordeste e gostaria de dicas de lugares acolhedores...',
    category: {
      label: 'Dicas',
      color: '#FF6B7A',
    },
    likes: 45,
    replies: 23,
    isTrending: false,
  },
  {
    id: '2',
    author: {
      name: 'Ana Costa',
      avatarUrl: 'https://images.unsplash.com/photo-1650784854945-264d5b0b6b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwd29tYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY3ODM0MTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    timeAgo: '5h atrás',
    title: 'Como lidar com a família?',
    description: 'Preciso de conselhos sobre como conversar com meus pais...',
    category: {
      label: 'Apoio',
      color: '#932d6f',
    },
    likes: 128,
    replies: 67,
    isTrending: false,
  },
  {
    id: '3',
    author: {
      name: 'Julia Ferreira',
      avatarUrl: 'https://images.unsplash.com/photo-1617931928012-3d65dcfffee2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbmElMjB3b21hbiUyMGhhcHB5fGVufDF8fHwxNzY3ODM0MTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    timeAgo: '1d atrás',
    title: 'Recomendações de profissionais de saúde',
    description: 'Alguém conhece médicas ginecologistas que sejam respeitosas e acolhedoras?',
    category: {
      label: 'Dicas',
      color: '#FF6B7A',
    },
    likes: 89,
    replies: 34,
    isTrending: false,
  },
  {
    id: '4',
    author: {
      name: 'Camila Souza',
      avatarUrl: 'https://images.unsplash.com/photo-1589553009868-c7b2bb474531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NzU0NDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    timeAgo: '2d atrás',
    title: 'Grupo de corrida às 7h no parque',
    description: 'Quem quer se juntar ao nosso grupo de corrida matinal? Todas são bem-vindas!',
    category: {
      label: 'Eventos',
      color: '#932d6f',
    },
    likes: 34,
    replies: 12,
    isTrending: false,
  },
];

interface ComunidadeProps {
  onNavigate: (page: string) => void;
}

export function Comunidade({ onNavigate }: ComunidadeProps) {
  const [activeView, setActiveView] = useState<'feed' | 'trending' | 'members'>('feed');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Page Header com Título e Botão + */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-primary">Comunidade</h1>
              <button className="w-14 h-14 bg-[#932d6f] rounded-full flex items-center justify-center hover:bg-[#7d2660] transition-colors shadow-lg">
                <Plus className="w-7 h-7 text-white" />
              </button>
            </div>

            {/* Barra de busca */}
            <div className="mb-4">
              <SearchBar 
                placeholder="Buscar tópicos, pessoas..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
          </div>

          {/* Estatísticas da Comunidade */}
          <CommunityStats 
            members={1243}
            posts={567}
            activeToday={89}
          />

          {/* Filtros (duas linhas) */}
          <CommunityFilters
            activeView={activeView}
            activeCategory={activeCategory}
            categories={categories}
            onViewChange={setActiveView}
            onCategoryChange={setActiveCategory}
          />

          {/* Lista de Posts */}
          <div className="px-5 space-y-4 pb-6">
            {mockPosts
              .filter((post) => {
                if (activeCategory !== 'Todos' && post.category.label !== activeCategory) {
                  return false;
                }
                if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                    !post.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                  return false;
                }
                return true;
              })
              .map((post) => (
                <CommunityPostCard key={post.id} {...post} />
              ))}
          </div>
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="community" onItemClick={onNavigate} />
      </div>
    </div>
  );
}