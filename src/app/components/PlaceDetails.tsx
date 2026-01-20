import { Heart, Star, Check, Share2, Flag, UserPlus, ArrowLeft, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { usePlace } from '../hooks/usePlaces';

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

interface PlaceDetailsProps {
  placeId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function PlaceDetails({ placeId, onNavigate, onBack }: PlaceDetailsProps) {
  const { place, loading, error } = usePlace(placeId);

  // Mock de reviews (será substituído quando implementarmos reviews do Supabase)
  const reviews: Review[] = [];

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
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Carregando local...</p>
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

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
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
              <button className="p-1">
                <Heart className="w-6 h-6 text-gray-300 hover:fill-[#932d6f] hover:text-[#932d6f] transition-colors" />
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

            {/* Endereço */}
            {place.address && (
              <div className="flex items-start gap-2 mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{place.address}</span>
              </div>
            )}

            {/* Avaliação */}
            <div className="flex items-center gap-2 pt-2">
              <Star className="w-4 h-4 fill-[#932d6f] text-[#932d6f]" />
              <span className="font-bold text-black text-lg">
                {place.rating.toFixed(1)} ({place.reviewCount || 0})
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="bg-[#fffbfa] px-4 py-3">
            <div className="flex gap-2 overflow-x-auto">
              <button 
                onClick={() => onNavigate?.('create-review')}
                className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
              >
                <Check className="w-4 h-4" />
                Já fui
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap">
                <Share2 className="w-4 h-4" />
                Compartilhar
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
          <div className="mt-6 pb-6">
            <div className="px-4 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Comentários</h3>
            </div>

            {/* Lista de Reviews */}
            {reviews.map((review) => (
              <div key={review.id} className="px-4 py-4 border-b border-gray-100">
                {/* Header do Review */}
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={review.avatar} 
                    alt={review.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
                    <p className="text-xs text-gray-500">Review postado {review.date}</p>
                  </div>
                </div>

                {/* Avaliação com Estrelas */}
                <div className="mb-2">
                  {renderStars(review.rating)}
                </div>

                {/* Comentário */}
                <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navegação inferior */}
        <BottomNav />
      </div>
    </div>
  );
}