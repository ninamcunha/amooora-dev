import { Heart, Star, Check, Share2, Flag, UserPlus, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

interface PlaceDetailsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function PlaceDetails({ onNavigate, onBack }: PlaceDetailsProps) {
  const reviews: Review[] = [
    {
      id: '1',
      author: 'Ana Paula',
      avatar: 'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3Njc4ODgxMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'há 3 dias',
      rating: 4,
      comment: 'A massa estava excelente e a atmosfera estava perfeita.'
    },
    {
      id: '2',
      author: 'Joana Faria',
      avatar: 'https://images.unsplash.com/photo-1609091289242-735df7a2207a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNhc3VhbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2Nzk2ODEwMXww&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'há 3 dias',
      rating: 4,
      comment: 'Uma experiência gastronômica encantadora que te leva à Itália a cada mordida.'
    }
  ];

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
                  src="https://images.unsplash.com/photo-1567600175325-3573c56bee05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVzdGF1cmFudCUyMGludGVyaW9yfGVufDF8fHx8MTc2NzkwMjI4MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Foto principal do local"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Fotos menores */}
              <div className="flex flex-col gap-1 w-[130px]">
                <div className="flex-1 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1766812782166-e243111f703d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcmVzdGF1cmFudCUyMGRpbmluZ3xlbnwxfHx8fDE3Njc5MDQzNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Foto 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 rounded-xl overflow-hidden">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1760982192590-de2b005bb4d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwYmFyJTIwYW1iaWFuY2V8ZW58MXx8fHwxNzY3OTkyOTcwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Foto 3"
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
                <span>$$</span>
                <span>·</span>
                <span>Italiano</span>
                <span>·</span>
                <span>30-40 mins</span>
              </div>
              <button className="p-1">
                <Heart className="w-6 h-6 fill-[#932d6f] text-[#932d6f]" />
              </button>
            </div>

            {/* Nome */}
            <h2 className="text-3xl font-bold text-black mb-2">Café da Vila</h2>

            {/* Descrição */}
            <p className="text-gray-500 text-sm leading-relaxed mb-3">
              Bella Cucina é um restaurante italiano renomado, conhecido por suas autênticas massas e ambiente acolhedor. Bella Cucina é um restaurante italiano renomado, conhecido por suas autênticas massas e ambiente acolhedor.
            </p>

            {/* Avaliação */}
            <div className="flex items-center gap-2 pt-2">
              <Star className="w-4 h-4 fill-[#932d6f] text-[#932d6f]" />
              <span className="font-bold text-black text-lg">4.5 (200)</span>
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