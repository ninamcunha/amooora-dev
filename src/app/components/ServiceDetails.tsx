import { Heart, Star, Share2, Flag, Phone, MessageCircle, Clock, DollarSign, Check, MapPin } from 'lucide-react';
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

interface ServiceDetailsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function ServiceDetails({ onNavigate, onBack }: ServiceDetailsProps) {
  const service = {
    name: 'Dra. Marina Silva - Psicoterapia',
    category: 'Psicologia',
    description: 'Psicóloga especializada em atendimento à comunidade LGBTQIA+, com foco em questões de identidade, relacionamentos e saúde mental. Atendimento presencial e online.',
    price: '$$$$',
    priceValue: 'R$ 150 - R$ 250',
    phone: '(11) 98765-4321',
    whatsapp: '5511987654321',
    email: 'contato@marinapsi.com.br',
    address: 'Av. Paulista, 1000 - São Paulo/SP',
    rating: 4.8,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2dpc3QlMjB3b21lbnxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1551836022-4c4c79ecde51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVyYXB5JTIwb2ZmaWNlJTIwcm9vbXxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Vuc2VsaW5nJTIwc2Vzc2lvbnxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    specialties: [
      'Terapia LGBTQIA+',
      'Ansiedade',
      'Depressão',
      'Relacionamentos',
      'Identidade de Gênero',
    ],
    hours: [
      { day: 'Segunda a Sexta', time: '09:00 - 18:00' },
      { day: 'Sábado', time: '09:00 - 13:00' },
    ],
    verified: true,
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

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${service.whatsapp}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${service.phone}`, '_blank');
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
              {service.images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 snap-start">
                  <ImageWithFallback
                    src={image}
                    alt={`${service.name} - ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Indicador de Fotos */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {service.images.map((_, index) => (
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
            {/* Categoria e Verificação */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#932d6f]/10 text-[#932d6f] rounded-full text-xs font-medium">
                {service.category}
              </span>
              {service.verified && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Verificado
                </span>
              )}
            </div>

            {/* Nome do Serviço */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {service.name}
            </h1>

            {/* Descrição */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {service.description}
            </p>

            {/* Rating e Preço */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-[#932d6f] text-[#932d6f]" />
                <span className="font-bold text-black text-lg">
                  {service.rating} ({service.reviewCount})
                </span>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-[#932d6f] font-bold text-lg">{service.price}</div>
                <div className="text-xs text-gray-500">{service.priceValue}</div>
              </div>
            </div>
          </div>

          {/* Especialidades */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Especialidades</h3>
            <div className="flex flex-wrap gap-2">
              {service.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-white border border-[#932d6f]/20 text-gray-700 rounded-full text-xs font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Informações de Contato */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Informações de Contato</h3>
            <div className="space-y-3">
              {/* Endereço */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">{service.address}</p>
                </div>
              </div>

              {/* Telefone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">{service.phone}</p>
                </div>
              </div>

              {/* Horário */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {service.hours.map((hour, index) => (
                    <p key={index} className="text-sm text-gray-700">
                      <span className="font-medium">{hour.day}:</span> {hour.time}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Botões de Ação Principal */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-xl font-semibold text-sm hover:bg-[#22c55e] transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#932d6f] text-white rounded-xl font-semibold text-sm hover:bg-[#7d2660] transition-colors shadow-sm"
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
