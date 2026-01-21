import { Heart, Star, Check, Share2, Flag, UserPlus, ArrowLeft, MapPin, MessageCircle, Send } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { usePlace } from '../hooks/usePlaces';
import { usePlaceReviews } from '../hooks/useReviews';
import { Review } from '../types';
import { calculateAverageRating } from '../services/reviews';
import { shareContent, getShareUrl, getShareText } from '../utils/share';

interface ReviewWithReplies extends Review {
  likes?: number;
  replies?: ReviewWithReplies[];
}

interface PlaceDetailsProps {
  placeId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function PlaceDetails({ placeId, onNavigate, onBack }: PlaceDetailsProps) {
  const { place, loading, error } = usePlace(placeId);
  const { reviews: realReviews, loading: reviewsLoading, refetch: refetchReviews } = usePlaceReviews(placeId);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const favorite = placeId ? isFavorite('places', placeId) : false;
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = async () => {
    if (!place || !placeId) return;
    
    const shared = await shareContent({
      title: place.name,
      text: getShareText('place', place.name),
      url: getShareUrl('place', placeId),
    });

    if (shared) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  // Converter reviews reais para o formato esperado
  const reviews: ReviewWithReplies[] = realReviews.map(review => ({
    ...review,
    avatar: review.avatar || review.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: review.author || review.userName || 'Usuário',
    date: review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'),
    likes: 0, // Por enquanto sem sistema de likes
    replies: [],
  }));

  // Calcular rating médio
  const averageRating = reviews.length > 0 ? calculateAverageRating(reviews) : place?.rating || 0;
  const reviewCount = reviews.length || place?.reviewCount || 0;

  // Refetch reviews quando voltar da página de criação
  useEffect(() => {
    const handleFocus = () => {
      refetchReviews();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchReviews]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index}
            className={`w-3.5 h-3.5 ${index < rating ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <p className="text-muted-foreground mb-2">Carregando local...</p>
            {!placeId && (
              <p className="text-xs text-muted-foreground text-center">
                Aguarde enquanto buscamos as informações
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !place) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">Erro ao carregar local</p>
              <p className="text-sm text-muted-foreground">
                {error?.message || 'Local não encontrado'}
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
        <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />

        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Galeria de Fotos */}
          <div className="p-4">
            <div className="flex gap-1 h-[200px]">
              {/* Foto principal */}
              <div className="flex-1 rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Fotos menores - usando a mesma imagem por enquanto */}
              <div className="flex flex-col gap-1 w-[130px]">
                <div className="flex-1 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src={place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
                    alt={place.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Local */}
          <div className="px-4 pb-4">
            {/* Categoria e Favoritar */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1 text-[#932d6f] font-bold text-sm">
                <span>{place.category}</span>
                {place.isSafe && (
                  <>
                    <span>·</span>
                    <span>Seguro</span>
                  </>
                )}
              </div>
              <button 
                onClick={() => placeId && toggleFavorite('places', placeId)}
                className="p-1"
              >
                <Heart className={`w-6 h-6 transition-colors ${
                  favorite ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300 hover:fill-[#932d6f] hover:text-[#932d6f]'
                }`} />
              </button>
            </div>

            {/* Nome */}
            <h2 className="text-3xl font-bold text-black mb-2">{place.name}</h2>

            {/* Descrição */}
            {place.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-3">
                {place.description}
              </p>
            )}

            {/* Endereço com link para Google Maps */}
            {place.address && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 mb-3 hover:opacity-80 transition-opacity"
              >
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{place.address}</span>
              </a>
            )}

                  {/* Avaliação */}
                  <div className="flex items-center gap-2 pt-2">
                    <Star className="w-4 h-4 fill-[#932d6f] text-[#932d6f]" />
                    <span className="font-bold text-black text-lg">
                      {averageRating.toFixed(1)} ({reviewCount})
                    </span>
                  </div>
          </div>

          {/* Botões de Ação */}
          <div className="bg-[#fffbfa] px-4 py-3">
            <div className="flex gap-2 overflow-x-auto">
                    <button 
                      onClick={() => placeId && onNavigate?.(`create-review:place:${placeId}`)}
                      className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Já fui
                    </button>
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? 'Link copiado!' : 'Compartilhar'}
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap">
                <Flag className="w-4 h-4" />
                Denunciar
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap">
                <UserPlus className="w-4 h-4" />
                Seguir
              </button>
            </div>
          </div>

          {/* Seção de Comentários */}
          <div className="mt-6 pb-32">
            <div className="px-4 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Comentários ({reviews.length})
              </h3>
            </div>

            {/* Lista de Reviews */}
            {reviewsLoading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-muted-foreground text-sm">Carregando avaliações...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewItem 
                  key={review.id} 
                  review={review}
                  onReply={(id) => setReplyingTo(replyingTo === id ? null : id)}
                  replyingTo={replyingTo}
                  replyText={replyText}
                  onReplyTextChange={setReplyText}
                  onSendReply={(id) => {
                    // Respostas serão implementadas depois quando tiver sistema de comentários completo
                    console.log('Resposta:', { reviewId: id, text: replyText });
                    setReplyText('');
                    setReplyingTo(null);
                  }}
                />
              ))
            ) : (
              <div className="px-4 py-12 text-center">
                <p className="text-muted-foreground">Nenhum comentário ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* Campo de Comentário Fixo - Posicionado acima do BottomNav */}
        <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-border px-4 py-3 z-40">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Seu avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <button
              onClick={() => placeId && onNavigate?.(`create-review:place:${placeId}`)}
              className="flex-1 px-4 py-2 bg-muted rounded-full border-0 text-left text-sm text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer"
            >
              Escreva uma avaliação...
            </button>
            <button
              onClick={() => placeId && onNavigate?.(`create-review:place:${placeId}`)}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
              title="Criar avaliação completa"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navegação inferior - z-index maior para ficar acima */}
        <BottomNav activeItem="places" onItemClick={onNavigate} />
      </div>
    </div>
  );
}

// Componente para renderizar um review com suporte a respostas
function ReviewItem({ 
  review, 
  onReply, 
  replyingTo, 
  replyText, 
  onReplyTextChange, 
  onSendReply,
  isReply = false 
}: { 
  review: ReviewWithReplies; 
  onReply: (id: string) => void;
  replyingTo: string | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSendReply: (id: string) => void;
  isReply?: boolean;
}) {
  return (
    <div className={isReply ? 'ml-12 mt-3' : ''}>
      <div className="px-4 py-4 border-b border-gray-100">
        {/* Header do Review */}
        <div className="flex items-center gap-3 mb-2">
          <ImageWithFallback
            src={review.avatar || review.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080'}
            alt={review.author || review.userName || 'Usuário'}
            className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover flex-shrink-0`}
          />
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm">{review.author || review.userName || 'Usuário'}</h4>
            <p className="text-xs text-gray-500">{review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível')}</p>
          </div>
        </div>

        {/* Avaliação com Estrelas (apenas para comentários principais) */}
        {!isReply && review.rating > 0 && (
          <div className="mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => (
                <Star 
                  key={index}
                  className={`w-3.5 h-3.5 ${index < review.rating ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Comentário */}
        <p className="text-sm text-gray-700 leading-relaxed mb-2">{review.comment}</p>

        {/* Ações: Curtir e Responder */}
        <div className="flex items-center gap-4 mt-2">
          {review.likes !== undefined && (
            <button className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{review.likes}</span>
            </button>
          )}
          {!isReply && (
            <button
              onClick={() => onReply(review.id)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs"
            >
              <MessageCircle className="w-4 h-4" />
              Responder
            </button>
          )}
        </div>

        {/* Campo de resposta */}
        {replyingTo === review.id && !isReply && (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => onReplyTextChange(e.target.value)}
              placeholder="Escreva uma resposta..."
              className="flex-1 px-3 py-2 text-sm bg-muted rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSendReply(review.id);
                }
              }}
            />
            <button
              onClick={() => onSendReply(review.id)}
              className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Enviar
            </button>
          </div>
        )}

        {/* Respostas aninhadas */}
        {review.replies && review.replies.length > 0 && (
          <div className="mt-3">
            {review.replies.map((reply) => (
              <ReviewItem
                key={reply.id}
                review={reply}
                onReply={onReply}
                replyingTo={replyingTo}
                replyText={replyText}
                onReplyTextChange={onReplyTextChange}
                onSendReply={onSendReply}
                isReply={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}