import { useState, useMemo } from 'react';
import { ArrowLeft, Users, MessageCircle, Heart, Calendar, Palette, Briefcase, Plane, Sparkles, Home } from 'lucide-react';
import { Header } from '../components/Header';
import { CommunityPostCard } from '../components/CommunityPostCard';
import { CreatePostForm } from '../components/CreatePostForm';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { EmptyState } from '../components/EmptyState';
import { SkeletonListExpanded } from '../components/Skeleton';
import { InfiniteScroll } from '../components/InfiniteScroll';
import { useAdmin } from '../hooks/useAdmin';
import { useCommunity } from '../hooks/useCommunities';
import { useCommunityPosts } from '../hooks/useCommunityPosts';
import { createPost } from '../services/community';
import { MessageSquare } from 'lucide-react';

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

// Função para obter ícone baseado na categoria
const getCommunityIcon = (category?: string): React.ReactNode => {
  const iconMap: Record<string, React.ReactNode> = {
    'Apoio': <Heart className="w-6 h-6 text-white" />,
    'Dicas': <Sparkles className="w-6 h-6 text-white" />,
    'Eventos': <Calendar className="w-6 h-6 text-white" />,
    'Geral': <Users className="w-6 h-6 text-white" />,
  };
  
  return iconMap[category || ''] || <MessageCircle className="w-6 h-6 text-white" />;
};

interface CommunityDetailsProps {
  communityId: string;
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

export function CommunityDetails({ communityId, onNavigate, onBack }: CommunityDetailsProps) {
  const { isAdmin } = useAdmin();
  const { community, loading: communityLoading, error: communityError } = useCommunity(communityId);
  
  // Buscar posts da categoria da comunidade
  const { posts, loading: postsLoading, error: postsError, hasMore, loadMore, refetch } = useCommunityPosts({
    category: community?.category,
    searchQuery: undefined,
    limit: 20,
  });

  // Converter posts para o formato esperado pelo CommunityPostCard
  const postsForCards = useMemo(() => {
    return posts.map((post) => ({
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
  }, [posts]);

  // Mapear comunidade para o formato do CreatePostForm
  const communitiesForForm = useMemo(() => {
    if (!community) return [];
    return [{
      id: community.id,
      name: community.name,
      avatar: community.image || community.imageUrl || '',
    }];
  }, [community]);

  const handleCreatePost = async (content: string, selectedCommunityId: string) => {
    if (!community?.category) return;
    
    const title = content.split('\n')[0].substring(0, 100) || 'Novo Post';
    await createPost(title, content, community.category);
    await refetch();
  };

  // Loading state
  if (communityLoading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Carregando comunidade...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (communityError || !community) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">Erro ao carregar comunidade</p>
              <p className="text-sm text-muted-foreground">
                {communityError?.message || 'Comunidade não encontrada'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Banner da Comunidade */}
          <div className="relative w-full h-48 overflow-hidden">
            <ImageWithFallback
              src={community.image || community.imageUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80'}
              alt={community.name}
              className="w-full h-full object-cover"
            />
            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
            
            {/* Ícone circular sobreposto */}
            <div className="absolute bottom-4 left-5 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
              {getCommunityIcon(community.category)}
            </div>

            {/* Informações da comunidade */}
            <div className="absolute bottom-4 left-24 right-5">
              <h1 className="text-2xl font-bold text-white mb-1">{community.name}</h1>
              <p className="text-sm text-white/90 line-clamp-2">{community.description}</p>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="px-5 py-4 bg-white border-b border-gray-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {community.membersCount >= 1000
                      ? `${(community.membersCount / 1000).toFixed(1)}k`
                      : community.membersCount}
                  </p>
                  <p className="text-xs text-gray-500">Membros</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {community.postsCount || posts.length}
                  </p>
                  <p className="text-xs text-gray-500">Posts</p>
                </div>
              </div>
              {community.category && (
                <div className="ml-auto">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: categoryColors[community.category] || '#932d6f' }}
                  >
                    {community.category}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Formulário de Criação de Post */}
          {community.category && (
            <div className="px-5 pt-6">
              <CreatePostForm
                communities={communitiesForForm}
                defaultCommunityId={community.id}
                onSubmit={handleCreatePost}
              />
            </div>
          )}

          {/* Feed de Posts */}
          <div className="px-5 pt-6 pb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Posts da Comunidade</h2>
            
            {postsLoading && posts.length === 0 ? (
              <SkeletonListExpanded count={3} />
            ) : postsError ? (
              <EmptyState
                icon={MessageSquare}
                title="Erro ao carregar posts"
                description={postsError.message || 'Não foi possível carregar os posts da comunidade.'}
              />
            ) : postsForCards.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="Nenhum post ainda"
                description="Seja o primeiro a compartilhar algo nesta comunidade!"
              />
            ) : (
              <InfiniteScroll
                onLoadMore={loadMore}
                hasMore={hasMore}
                loading={postsLoading}
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
      </div>
    </div>
  );
}
