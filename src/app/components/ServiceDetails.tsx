import { Heart, Star, Share2, Flag, Phone, MessageCircle, Clock, DollarSign, Check, MapPin } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useService } from '../hooks/useServices';

interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

interface ServiceDetailsProps {
  serviceId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function ServiceDetails({ serviceId, onNavigate, onBack }: ServiceDetailsProps) {
  const { service, loading, error } = useService(serviceId);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <p className="text-muted-foreground mb-2">Carregando serviço...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !service) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">Erro ao carregar serviço</p>
              <p className="text-sm text-muted-foreground">
                {error?.message || 'Serviço não encontrado'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dados formatados para exibição
  const displayService = {
    name: service.name,
    category: service.category || 'Serviço',
    description: service.description || 'Sem descrição disponível.',
    price: service.price && service.price > 0 ? `R$ ${service.price.toFixed(2)}` : 'A consultar',
    priceValue: service.price && service.price > 0 ? `R$ ${service.price.toFixed(2)}` : 'Valor a consultar',
    provider: service.provider || 'Prestador não informado',
    rating: service.rating || 0,
    reviewCount: 0, // Não temos esse campo no banco ainda
    image: service.image || service.imageUrl || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
    images: service.image || service.imageUrl 
      ? [service.image || service.imageUrl || 'https://via.placeholder.com/400x300?text=Sem+Imagem']
      : ['https://via.placeholder.com/400x300?text=Sem+Imagem'],
  };

  const reviews: Review[] = [
    {
      id: '1',
      author: 'Beatriz Alves',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'há 2 semanas',
      rating: 5,
      comment: 'Profissional incrível! Me sinto muito acolhida e segura durante as sessões. Recomendo demais!',
    },
    {
      id: '2',
      author: 'Julia Costa',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'há 1 mês',
      rating: 5,
      comment: 'A Dra. Marina é super empática e entende bem as questões da comunidade. Mudou minha vida!',
    },
    {
      id: '3',
      author: 'Fernanda Lima',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      date: 'há 2 meses',
      rating: 4,
      comment: 'Ótima profissional, ambiente acolhedor. Único ponto é que às vezes é difícil conseguir horário.',
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Reviews mockadas por enquanto (será implementado depois)
  const reviews: Review[] = [];

  const handleWhatsApp = () => {
    // WhatsApp não está disponível nos dados do Supabase ainda
    // window.open(`https://wa.me/${service.whatsapp}`, '_blank');
  };

  const handleCall = () => {
    // Telefone não está disponível nos dados do Supabase ainda
    // window.open(`tel:${service.phone}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Galeria de Fotos */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {displayService.images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 snap-start">
                  <ImageWithFallback
                    src={image}
                    alt={`${displayService.name} - ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Indicador de Fotos */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {displayService.images.map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-white/80"
                />
              ))}
            </div>
            {/* Botão Favoritar */}
            <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <Heart className="w-5 h-5 text-[#932d6f]" />
            </button>
          </div>

          {/* Informações Principais */}
          <div className="bg-white px-4 py-5 border-b border-gray-100">
            {/* Categoria */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#932d6f]/10 text-[#932d6f] rounded-full text-xs font-medium">
                {displayService.category}
              </span>
            </div>

            {/* Nome do Serviço */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {displayService.name}
            </h1>

            {/* Descrição */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {displayService.description}
            </p>

            {/* Rating e Preço */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-[#932d6f] text-[#932d6f]" />
                <span className="font-bold text-black text-lg">
                  {displayService.rating} ({displayService.reviewCount})
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[#932d6f] font-bold text-lg">{displayService.price}</div>
                <div className="text-xs text-gray-500">{displayService.provider}</div>
              </div>
            </div>
          </div>

          {/* Prestador */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">Prestador</h3>
            <p className="text-sm text-gray-700">{displayService.provider}</p>
          </div>

          {/* Botões de Ação Principal */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsApp}
                disabled
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold text-sm cursor-not-allowed"
                title="WhatsApp não disponível"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={handleCall}
                disabled
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-500 rounded-xl font-semibold text-sm cursor-not-allowed"
                title="Telefone não disponível"
              >
                <Phone className="w-5 h-5" />
                Ligar
              </button>
            </div>
          </div>

          {/* Botões de Ação Secundários */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto">
              <button 
                onClick={() => onNavigate?.('create-review')}
                className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors"
              >
                <Star className="w-4 h-4" />
                Avaliar
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap">
                <Flag className="w-4 h-4" />
                Denunciar
              </button>
            </div>
          </div>

          {/* Seção de Reviews */}
          <div className="mt-6 pb-6">
            <div className="px-4 pb-3">
              <h3 className="text-lg font-bold text-gray-900">Avaliações</h3>
            </div>

            {/* Lista de Reviews */}
            {reviews.length > 0 ? (
              reviews.map((review) => (
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
                    <p className="text-xs text-gray-500">Avaliação postada {review.date}</p>
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

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="services" onItemClick={onNavigate!} />
      </div>
    </div>
  );
}
