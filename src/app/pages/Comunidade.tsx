import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from '../components/Header';
import { CommunityPostCard } from '../components/CommunityPostCard';
import { CommunityCardCarousel } from '../components/CommunityCardCarousel';
import { CreatePostForm } from '../components/CreatePostForm';
import { MessageCircle, Heart, Users, Calendar, Sparkles } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { EmptyState } from '../components/EmptyState';
import { SkeletonListExpanded } from '../components/Skeleton';
import { InfiniteScroll } from '../components/InfiniteScroll';
import { useAdmin } from '../hooks/useAdmin';
import { useCommunityPosts } from '../hooks/useCommunityPosts';
import { useCommunities } from '../hooks/useCommunities';
import { createPost } from '../services/community';
import { MessageSquare } from 'lucide-react';
import { Community } from '../services/communities';

// Dados mockados de comunidades (fallback caso não haja dados no banco)
const mockCommunities = [
  {
    id: 'apoio',
    name: 'Apoio',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    description: 'Espaço seguro para compartilhar experiências e buscar apoio',
    membersCount: 1243,
    postsCount: 567,
  },
  {
    id: 'saude-mental',
    name: 'Saúde Mental',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop',
    description: 'Bem-estar mental e autocuidado',
    membersCount: 892,
    postsCount: 334,
  },
  {
    id: 'relacionamentos',
    name: 'Relacionamentos',
    avatar: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=200&h=200&fit=crop',
    description: 'Experiências e dicas sobre relacionamentos',
    membersCount: 1567,
    postsCount: 445,
  },
  {
    id: 'carreira',
    name: 'Carreira',
    avatar: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=200&fit=crop',
    description: 'Networking e oportunidades profissionais',
    membersCount: 678,
    postsCount: 234,
  },
  {
    id: 'eventos',
    name: 'Eventos',
    avatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=200&h=200&fit=crop',
    description: 'Eventos e encontros da comunidade',
    membersCount: 2134,
    postsCount: 892,
  },
  {
    id: 'arte-cultura',
    name: 'Arte & Cultura',
    avatar: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop',
    description: 'Criações artísticas e cultura LGBTQIA+',
    membersCount: 987,
    postsCount: 456,
  },
  {
    id: 'esportes',
    name: 'Esportes',
    avatar: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
    description: 'Atividades físicas e esportes inclusivos',
    membersCount: 543,
    postsCount: 189,
  },
  {
    id: 'viagens',
    name: 'Viagens',
    avatar: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=200&fit=crop',
    description: 'Destinos LGBTQIA+ friendly',
    membersCount: 1123,
    postsCount: 378,
  },
  {
    id: 'beleza-estilo',
    name: 'Beleza & Estilo',
    avatar: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&h=200&fit=crop',
    description: 'Dicas de beleza, moda e estilo',
    membersCount: 1456,
    postsCount: 623,
  },
  {
    id: 'familia',
    name: 'Família',
    avatar: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop',
    description: 'Família e paternidade/maternidade',
    membersCount: 789,
    postsCount: 267,
  },
];

// Mapear categoria para cor
const categoryColors: Record<string, string> = {
  'Apoio': '#932d6f', // Primary
  'Dicas': '#dca0c8', // Secondary (rosa claro)
  'Eventos': '#c4532f', // Accent (laranja)
  'Geral': '#3a184f', // Tertiary (roxo escuro)
};

// Função para calcular tempo relativo
const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d atrás`;
  return date.toLocaleDateString('pt-BR');
};

interface ComunidadeProps {
  onNavigate: (page: string) => void;
}

export function Comunidade({ onNavigate }: ComunidadeProps) {
  const { isAdmin } = useAdmin();
  const [activeTab, setActiveTab] = useState<'feed' | 'communities'>('feed');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);


  // Usar hook para buscar posts do banco (sem filtros de busca/categoria por padrão)
  const { posts, loading, error, hasMore, loadMore, refetch } = useCommunityPosts({
    category: undefined,
    searchQuery: undefined,
    limit: 20,
  });



  // Filtrar posts baseado no tab ativo
  const filteredPosts = useMemo(() => {
    // "Meu feed" - mostrar todos os posts
    return posts;
  }, [posts]);

  // Buscar comunidades do banco de dados
  const { communities: dbCommunities } = useCommunities();

  // Usar comunidades do banco ou fallback para mock
  const communities = useMemo(() => {
    if (dbCommunities && dbCommunities.length > 0) {
      return dbCommunities;
    }
    // Fallback para mock se não houver dados no banco
    return mockCommunities.map((mock) => ({
      id: mock.id,
      name: mock.name,
      description: mock.description,
      image: mock.avatar,
      imageUrl: mock.avatar,
      icon: undefined,
      category: undefined,
      membersCount: mock.membersCount,
      postsCount: mock.postsCount,
      isActive: true,
    }));
  }, [dbCommunities]);

  // Função para obter ícone baseado na categoria
  const getCommunityIcon = (community: Community): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      'Apoio': <Heart className="w-6 h-6 text-white" />,
      'Dicas': <Sparkles className="w-6 h-6 text-white" />,
      'Eventos': <Calendar className="w-6 h-6 text-white" />,
      'Geral': <Users className="w-6 h-6 text-white" />,
    };
    
    return iconMap[community.category || ''] || <MessageCircle className="w-6 h-6 text-white" />;
  };

  // Mapear comunidades para o formato do carrossel
  const communitiesForCarousel = useMemo(() => {
    return communities.map((community) => ({
      id: community.id,
      name: community.name,
      description: community.description,
      imageUrl: community.image || community.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
      icon: getCommunityIcon(community),
      membersCount: community.membersCount || 0,
      postsCount: community.postsCount || 0,
    }));
  }, [communities]);
  
  // Mapear comunidades para o formato do CreatePostForm
  const communitiesForForm = useMemo(() => {
    if (!communities || communities.length === 0) {
      // Fallback para mock se não houver dados no banco
      return mockCommunities.map((mock) => ({
        id: mock.id,
        name: mock.name,
        avatar: mock.avatar,
      }));
    }
    return communities.map((c) => ({
      id: c.id,
      name: c.name,
      avatar: c.image || c.imageUrl || '',
    }));
  }, [communities]);

  const handleCreatePost = async (content: string, communityId: string) => {
    // Buscar categoria da comunidade selecionada
    const selectedCommunity = communities.find((c) => c.id === communityId);
    const category = selectedCommunity?.category || 'Geral';
    
    // Usar primeiras palavras do conteúdo como título (ou criar um título padrão)
    const title = content.split('\n')[0].substring(0, 100) || 'Novo Post';
    
    await createPost(title, content, category);
    await refetch();
  };

  // Recarregar posts quando a página receber foco (quando voltar de outra página)
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  // Converter posts filtrados para o formato esperado pelo CommunityPostCard
  const postsForCards = filteredPosts.map((post) => ({
    id: post.id,
    author: {
      name: post.author?.name || 'Usuário',
      avatarUrl: post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    timeAgo: getTimeAgo(post.createdAt),
    title: post.title,
    description: post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content,
    category: {
      label: post.category,
      color: categoryColors[post.category] || '#932d6f',
    },
    likes: post.likesCount,
    replies: post.repliesCount,
    isTrending: post.isTrending,
  }));

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-primary">Comunidade</h1>
              <button 
                onClick={() => onNavigate('minhas-comunidades')}
                className="text-sm text-accent font-medium hover:opacity-80 transition-opacity"
              >
                Ver todas
              </button>
            </div>
          </div>

          {/* Carrossel de Comunidades em Destaque */}
          <CommunityCardCarousel
            communities={communitiesForCarousel}
            onCommunityClick={(communityId) => {
              onNavigate(`community-details:${communityId}`);
            }}
            onJoinClick={(communityId) => {
              onNavigate(`community-details:${communityId}`);
            }}
          />

          {/* Tabs: Meu feed / Minhas comunidades */}
          <div className="px-5 mb-4">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('feed');
                  setSelectedCommunityId(null);
                }}
                className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                  activeTab === 'feed'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Meu feed
              </button>
              <button
                onClick={() => {
                  setActiveTab('communities');
                  onNavigate('minhas-comunidades');
                }}
                className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                  activeTab === 'communities'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Minhas comunidades
              </button>
            </div>
          </div>

          {/* Formulário de Criação de Post */}
          <CreatePostForm
            communities={communitiesForForm}
            onSubmit={handleCreatePost}
          />

          {/* Lista de Posts */}
          <div className="px-5 space-y-4 pb-6">
            {loading && posts.length === 0 ? (
              <SkeletonListExpanded count={3} />
            ) : error ? (
              <EmptyState
                icon={MessageSquare}
                title="Erro ao carregar posts"
                description={error.message || 'Não foi possível carregar os posts da comunidade.'}
              />
            ) : postsForCards.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="Nenhum post encontrado"
                description="Ainda não há posts na comunidade. Seja o primeiro a compartilhar!"
              />
            ) : (
              <InfiniteScroll
                onLoadMore={loadMore}
                hasMore={hasMore}
                loading={loading}
              >
                {postsForCards.map((post) => (
                  <CommunityPostCard 
                    key={post.id} 
                    {...post} 
                    onClick={() => onNavigate(`post-details:${post.id}`)}
                  />
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="community" onItemClick={onNavigate} />
      </div>
    </div>
  );
}