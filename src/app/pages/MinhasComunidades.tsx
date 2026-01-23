import { useState } from 'react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { CommunityCard, CommunityCardData } from '../components/CommunityCard';
import { EmptyState } from '../components/EmptyState';
import { SkeletonListExpanded } from '../components/Skeleton';
import { Users, Search } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

interface MinhasComunidadesProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

// Dados mockados de comunidades (temas LGBTQIA+)
const mockCommunities: CommunityCardData[] = [
  {
    id: 'apoio',
    name: 'Apoio & Acolhimento',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=300&fit=crop',
    description: 'Espaço seguro para compartilhar experiências, buscar apoio e acolhimento na comunidade LGBTQIA+',
    membersCount: 1243,
    postsCount: 567,
    rating: 4.8,
  },
  {
    id: 'saude-mental',
    name: 'Saúde Mental',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop',
    description: 'Discussões sobre bem-estar mental, terapia LGBTQIA+ friendly e autocuidado',
    membersCount: 892,
    postsCount: 334,
    rating: 4.7,
  },
  {
    id: 'relacionamentos',
    name: 'Relacionamentos',
    avatar: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=300&fit=crop',
    description: 'Compartilhe experiências, dicas e histórias sobre relacionamentos na comunidade',
    membersCount: 1567,
    postsCount: 445,
    rating: 4.6,
  },
  {
    id: 'carreira',
    name: 'Carreira & Profissão',
    avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop',
    description: 'Networking, oportunidades de trabalho e discussões sobre carreira em ambientes inclusivos',
    membersCount: 678,
    postsCount: 234,
    rating: 4.5,
  },
  {
    id: 'eventos',
    name: 'Eventos & Festas',
    avatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop',
    description: 'Organize e descubra eventos, festas e encontros da comunidade LGBTQIA+',
    membersCount: 2134,
    postsCount: 892,
    rating: 4.9,
  },
  {
    id: 'arte-cultura',
    name: 'Arte & Cultura',
    avatar: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop',
    description: 'Compartilhe criações artísticas, cultura LGBTQIA+ e inspire-se com outros artistas',
    membersCount: 987,
    postsCount: 456,
    rating: 4.7,
  },
  {
    id: 'esportes',
    name: 'Esportes & Atividades',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    description: 'Grupos esportivos, atividades físicas e eventos esportivos inclusivos',
    membersCount: 543,
    postsCount: 189,
    rating: 4.4,
  },
  {
    id: 'viagens',
    name: 'Viagens & Turismo',
    avatar: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    description: 'Compartilhe destinos LGBTQIA+ friendly, dicas de viagem e experiências',
    membersCount: 1123,
    postsCount: 378,
    rating: 4.6,
  },
  {
    id: 'beleza-estilo',
    name: 'Beleza & Estilo',
    avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
    description: 'Dicas de beleza, moda, estilo e expressão pessoal na comunidade',
    membersCount: 1456,
    postsCount: 623,
    rating: 4.8,
  },
  {
    id: 'familia',
    name: 'Família & Paternidade',
    avatar: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop',
    description: 'Discussões sobre família, paternidade/maternidade e criação de filhos na comunidade LGBTQIA+',
    membersCount: 789,
    postsCount: 267,
    rating: 4.7,
  },
];

export function MinhasComunidades({ onNavigate, onBack }: MinhasComunidadesProps) {
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading] = useState(false);

  // Filtrar comunidades baseado na busca
  const filteredCommunities = mockCommunities.filter((community) =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCommunityClick = (communityId: string) => {
    // Por enquanto, filtrar posts na página de comunidade
    // No futuro, pode abrir uma página específica da comunidade
    onNavigate('community');
    // Poderia passar o communityId como parâmetro para filtrar
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Minhas Comunidades</h1>
            
            {/* Campo de Busca */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar comunidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Lista de Comunidades */}
          <div className="px-5 pb-6">
            {loading ? (
              <SkeletonListExpanded count={3} />
            ) : filteredCommunities.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Nenhuma comunidade encontrada"
                description={searchQuery ? 'Tente ajustar sua busca.' : 'Ainda não há comunidades disponíveis.'}
              />
            ) : (
              <div className="space-y-4">
                {filteredCommunities.map((community) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    onClick={() => handleCommunityClick(community.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="community" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
