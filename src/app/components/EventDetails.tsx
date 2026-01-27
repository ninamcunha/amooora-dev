import { Calendar, Clock, MapPin, Users, Heart, Share2, Flag, CheckCircle, Star, User, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { useEvent } from '../hooks/useEvents';
import { useEventReviews } from '../hooks/useReviews';
import { useAttendedEvents } from '../hooks/useAttendedEvents';
import { Review } from '../types';
import { calculateAverageRating } from '../services/reviews';
import { shareContent, getShareUrl, getShareText } from '../utils/share';

interface EventDetailsProps {
  eventId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function EventDetails({ eventId, onNavigate, onBack }: EventDetailsProps) {
  const { event, loading, error } = useEvent(eventId);
  const { reviews: realReviews, loading: reviewsLoading, refetch: refetchReviews } = useEventReviews(eventId);
  const { hasAttended, toggleAttendedEvent } = useAttendedEvents();
  const [isGoing, setIsGoing] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShare = async () => {
    if (!event || !eventId) return;
    
    const shared = await shareContent({
      title: event.name,
      text: getShareText('event', event.name),
      url: getShareUrl('event', eventId),
    });

    if (shared) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  // Converter reviews reais para o formato esperado
  const reviews: Review[] = realReviews.map(review => ({
    ...review,
    avatar: review.avatar || review.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTcwMTY1NzYwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: review.author || review.userName || 'Usuário',
    date: review.date || (review.createdAt ? new Date(review.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível'),
  }));

  // Calcular rating médio e contagem
  const averageRating = reviews.length > 0 ? calculateAverageRating(reviews) : 0;
  const reviewCount = reviews.length;

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
            className={`w-3.5 h-3.5 ${index < rating ? 'fill-primary text-primary' : 'text-gray-300'}`}
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
            <p className="text-muted-foreground mb-2">Carregando evento...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-red-500 mb-2">Erro ao carregar evento</p>
              <p className="text-sm text-muted-foreground">
                {error?.message || 'Evento não encontrado'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formatar data do evento
  const eventDate = new Date(event.date);
  const dayOfWeek = eventDate.toLocaleDateString('pt-BR', { weekday: 'long' });
  const formattedDate = eventDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  const startTime = event.time || eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  
  // Imagens do evento
  const eventImages = event.image || event.imageUrl 
    ? [event.image || event.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']
    : ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'];

  // Dados formatados para exibição
  const displayEvent = {
    name: event.name,
    description: event.description || 'Sem descrição disponível.',
    date: formattedDate,
    dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
    startTime: startTime,
    endTime: '', // Não temos esse campo no banco ainda
    location: event.location || 'Local não informado',
    address: '', // Não temos esse campo no banco ainda
    price: event.price && event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito',
    priceDetails: event.price && event.price > 0 ? 'Ingresso pago' : 'Entrada gratuita',
    goingCount: event.participants || 0,
    interestedCount: 0, // Não temos esse campo no banco ainda
    category: event.category || 'Evento',
    images: eventImages,
    tags: [event.category || 'Evento'], // Usar categoria como tag por enquanto
    rules: [
      'Espaço seguro e livre de LGBTfobia',
      'Respeito aos participantes',
    ],
    attendees: [], // Lista vazia por enquanto - será implementado depois
  };

  const handleGoingClick = () => {
    setIsGoing(!isGoing);
    if (!isGoing) {
      setIsInterested(false);
    }
  };

  const handleInterestedClick = () => {
    setIsInterested(!isInterested);
    if (!isInterested) {
      setIsGoing(false);
    }
  };

  const handleAttendedClick = () => {
    if (eventId) {
      toggleAttendedEvent(eventId);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col relative">
        {/* Header fixo */}
        <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />

        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-32 pt-24">
          {/* Galeria de Fotos */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {displayEvent.images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 snap-start">
                  <ImageWithFallback
                    src={image}
                    alt={`${displayEvent.name} - ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Indicador de Fotos */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {displayEvent.images.map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-white/80"
                />
              ))}
            </div>
            {/* Botão Favoritar */}
            <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <Heart className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Informações Principais */}
          <div className="bg-white px-4 py-5">
            {/* Nome do Evento */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {displayEvent.name}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {displayEvent.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Descrição */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {displayEvent.description}
            </p>
          </div>

          {/* Informações de Data e Hora */}
          <div className="bg-[#fffbfa] px-4 py-4 border-y border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Quando</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{displayEvent.date}</p>
                  <p className="text-sm text-gray-600">{displayEvent.dayOfWeek}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {displayEvent.startTime}
                  </p>
                  <p className="text-sm text-gray-600">Horário de Brasília</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Local */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Onde</h3>
            
            {/* Endereço acima do mapa */}
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 leading-tight">
                  {displayEvent.name} - {displayEvent.location}
                </p>
                {displayEvent.address && (
                  <p className="text-sm text-gray-600 mt-1">{displayEvent.address}</p>
                )}
              </div>
            </div>

            {/* Mapa com endereço do evento */}
            {displayEvent.location && displayEvent.location !== 'Local não informado' && (
              <>
                <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden relative mb-3">
                  {/* Botão "Ver mapa ampliado" */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayEvent.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 left-3 z-10 bg-white px-3 py-1.5 rounded-lg shadow-md text-sm text-blue-600 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Ver mapa ampliado
                  </a>

                  {/* Mapa do Google Maps com endereço do evento */}
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(displayEvent.location)}&output=embed`}
                    title={`Mapa: ${displayEvent.location}`}
                  />
                </div>

                {/* Botão "Ver no Google Maps" */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayEvent.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 py-3 px-4 text-sm text-primary font-semibold border border-primary rounded-xl hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  Ver no Google Maps
                  <MapPin className="w-4 h-4" />
                </a>
              </>
            )}
            
            {/* Mensagem se não houver localização */}
            {(!displayEvent.location || displayEvent.location === 'Local não informado') && (
              <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-sm text-gray-500">Localização não informada</p>
              </div>
            )}
          </div>

          {/* Preço/Ingresso */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">Ingresso</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-primary">{displayEvent.price}</p>
                <p className="text-sm text-gray-600">{displayEvent.priceDetails}</p>
              </div>
            </div>
          </div>

          {/* Participantes */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">Participantes</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{displayEvent.goingCount} confirmadas</span>
              </div>
            </div>

            {/* Contador de Interessadas */}
            {displayEvent.interestedCount > 0 && (
              <div className="text-sm text-gray-600">
                <Heart className="w-4 h-4 inline mr-1" />
                {displayEvent.interestedCount} pessoas interessadas
              </div>
            )}
          </div>

          {/* Regras do Evento */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Regras e Orientações</h3>
            <ul className="space-y-2">
              {displayEvent.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-primary mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botões de Ação Secundários */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium whitespace-nowrap hover:bg-primary/20 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                {shareSuccess ? 'Link copiado!' : 'Compartilhar'}
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors">
                <Flag className="w-4 h-4" />
                Denunciar
              </button>
            </div>
          </div>

          {/* Seção de Reviews */}
          <div className="bg-white border-b border-gray-100">
            {/* Header da Seção */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Avaliações</h3>
                  {reviewCount > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="font-bold text-black text-base">
                        {averageRating.toFixed(1)} ({reviewCount})
                      </span>
                    </div>
                  )}
                </div>
                {eventId && (
                  <button 
                    onClick={() => onNavigate?.(`create-review:event:${eventId}`)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium whitespace-nowrap hover:bg-primary/20 transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    Avaliar
                  </button>
                )}
              </div>
            </div>

            {/* Lista de Reviews */}
            {reviewsLoading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-muted-foreground text-sm">Carregando avaliações...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="px-4 py-4 border-b border-gray-100">
                  {/* Header do Review */}
                  <div className="flex items-start gap-3 mb-2">
                    <img
                      src={review.avatar} 
                      alt={review.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm">{review.author}</h4>
                      <p className="text-xs text-gray-500">Avaliação postada {review.date}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Ainda não há avaliações para este evento</p>
                {eventId && (
                  <button
                    onClick={() => onNavigate?.(`create-review:event:${eventId}`)}
                    className="mt-3 px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Seja o primeiro a avaliar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Espaço extra no final */}
          <div className="h-6"></div>
        </div>

        {/* Barra de Ação Fixa no Bottom */}
        <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
          <div className="max-w-md mx-auto flex gap-2">
            <button
              onClick={handleInterestedClick}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors border-2 ${
                isInterested
                  ? 'bg-secondary/10 text-secondary border-secondary/20'
                  : 'bg-white border-secondary text-secondary hover:bg-secondary/5'
              }`}
            >
              <Star className={`w-4 h-4 ${isInterested ? 'fill-secondary text-secondary' : ''}`} />
              {isInterested ? 'Interessada' : 'Tenho Interesse'}
            </button>
            <button
              onClick={handleGoingClick}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors border-2 ${
                isGoing
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'bg-white border-primary text-primary hover:bg-primary/5'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${isGoing ? 'text-primary' : ''}`} />
              {isGoing ? 'Confirmado!' : 'Vou Comparecer'}
            </button>
            <button
              onClick={handleAttendedClick}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors border-2 ${
                eventId && hasAttended(eventId)
                  ? 'bg-accent/10 text-accent border-accent/20'
                  : 'bg-white border-accent text-accent hover:bg-accent/5'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${eventId && hasAttended(eventId) ? 'text-accent' : ''}`} />
              {eventId && hasAttended(eventId) ? 'Eu Fui!' : 'Eu Fui'}
            </button>
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="events" onItemClick={onNavigate!} />
      </div>
    </div>
  );
}