import { useState, useEffect, useMemo } from 'react';
import { Settings, Edit, Calendar, MapPin, Heart, Star, Users, ChevronRight, CheckCircle2, MessageCircle, Briefcase } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';
import { useProfile } from '../hooks/useProfile';
import { useAdmin } from '../hooks/useAdmin';
import { useAttendedEvents } from '../hooks/useAttendedEvents';
import { useEvents } from '../hooks/useEvents';
import { 
  getProfileStats, 
  getSavedPlaces, 
  getUpcomingEvents, 
  getUserReviews,
  getFollowedCommunities,
  type SavedPlace,
  type UpcomingEvent,
  type UserReview,
  type FollowedCommunity,
} from '../services/profile';

interface PerfilProps {
  onNavigate: (page: string) => void;
}

export function Perfil({ onNavigate }: PerfilProps) {
  const { profile, loading: profileLoading } = useProfile();
  const { isAdmin } = useAdmin();
  const { getAttendedEvents: getAttendedEventIds } = useAttendedEvents();
  const { events: allEvents } = useEvents();
  const [stats, setStats] = useState({ eventsCount: 0, placesCount: 0, friendsCount: 0 });
  const [favoritePlaces, setFavoritePlaces] = useState<SavedPlace[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [myReviews, setMyReviews] = useState<UserReview[]>([]);
  const [followedCommunities, setFollowedCommunities] = useState<FollowedCommunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Carregar todos os dados do perfil em paralelo
        const [statsData, placesData, upcomingData, attendedData, reviewsData, communitiesData] = await Promise.all([
          getProfileStats(profile.id),
          getSavedPlaces(profile.id),
          getUpcomingEvents(profile.id),
          getAttendedEvents(profile.id),
          getUserReviews(profile.id),
          getFollowedCommunities(profile.id),
        ]);

        setStats(statsData);
        setFavoritePlaces(placesData);
        setUpcomingEvents(upcomingData);
        setAttendedEvents(attendedData);
        setMyReviews(reviewsData);
        setFollowedCommunities(communitiesData);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [profile?.id]);

  // Mock data para quando não houver dados reais
  const mockFavoritePlaces: SavedPlace[] = [
    {
      id: 'mock-1',
      place_id: 'mock-1',
      name: 'Café da Vila',
      category: 'Café',
      rating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWZlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3ODM0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'mock-2',
      place_id: 'mock-2',
      name: 'Bar da Lua',
      category: 'Bar',
      rating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXIlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'mock-3',
      place_id: 'mock-3',
      name: 'Restaurante Arco-Íris',
      category: 'Restaurante',
      rating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3ODM0MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const mockUpcomingEvents: UpcomingEvent[] = [
    {
      id: 'mock-1',
      event_id: 'mock-1',
      name: 'Sarau Sáfico',
      date: '15 Fev',
      time: '19:00',
      location: 'Centro Cultural',
    },
    {
      id: 'mock-2',
      event_id: 'mock-2',
      name: 'Roda de Conversa',
      date: '22 Fev',
      time: '18:30',
      location: 'Casa Amooora',
    },
  ];

  const mockAttendedEvents: AttendedEvent[] = [
    {
      id: 'mock-1',
      event_id: 'mock-1',
      name: 'Pride Fest 2025',
      date: '10 Jan',
      location: 'Parque Ibirapuera',
    },
    {
      id: 'mock-2',
      event_id: 'mock-2',
      name: 'Encontro de Mulheres',
      date: '05 Dez',
      location: 'Centro Cultural',
    },
  ];

  const mockReviews: UserReview[] = [
    {
      id: 'mock-1',
      place_id: 'mock-1',
      placeName: 'Café da Vila',
      rating: 5,
      comment: 'Adorei o ambiente! Super acolhedor e com opções veganas deliciosas. O atendimento foi impecável, me senti muito à vontade. Com certeza voltarei!',
      date: '2 dias atrás',
    },
    {
      id: 'mock-2',
      service_id: 'mock-1',
      serviceName: 'Terapia LGBTQIA+',
      rating: 5,
      comment: 'Profissional incrível! Me sinto muito acolhida e segura durante as sessões. Recomendo demais!',
      date: '1 semana atrás',
    },
    {
      id: 'mock-3',
      event_id: 'mock-1',
      eventName: 'Sarau Sáfico',
      rating: 4,
      comment: 'Evento incrível! A atmosfera era acolhedora e as performances foram emocionantes. Já estou ansiosa para o próximo!',
      date: '2 semanas atrás',
    },
  ];

  // Usar dados reais ou mock
  const displayFavoritePlaces = favoritePlaces.length > 0 ? favoritePlaces : mockFavoritePlaces;
  const displayUpcomingEvents = upcomingEvents.length > 0 ? upcomingEvents : mockUpcomingEvents;
  // Buscar eventos participados do localStorage e mapear para eventos completos
  const attendedEventIds = getAttendedEventIds();
  const displayAttendedEventsFromStorage = useMemo(() => {
    if (!allEvents || allEvents.length === 0) return [];
    
    return attendedEventIds
      .map(eventId => {
        const event = allEvents.find(e => e.id === eventId);
        if (!event) return null;
        
        const eventDate = new Date(event.date);
        const day = eventDate.getDate().toString().padStart(2, '0');
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const month = months[eventDate.getMonth()];
        
        return {
          id: event.id,
          event_id: event.id,
          name: event.name,
          date: `${day} ${month}`,
          location: event.location || 'Local não informado',
        };
      })
      .filter((event): event is AttendedEvent => event !== null);
  }, [attendedEventIds, allEvents]);

  const displayAttendedEvents = displayAttendedEventsFromStorage.length > 0 
    ? displayAttendedEventsFromStorage 
    : (attendedEvents.length > 0 ? attendedEvents : mockAttendedEvents);
  
  // Separar reviews por tipo
  const placeReviews = myReviews.filter(review => review.place_id);
  const serviceReviews = myReviews.filter(review => review.service_id);
  const eventReviews = myReviews.filter(review => review.event_id);
  
  // Stats mockados se não houver dados
  const displayStats = stats.eventsCount > 0 || stats.placesCount > 0 || stats.friendsCount > 0
    ? stats
    : {
        eventsCount: 4,
        placesCount: 3,
        friendsCount: 12,
      };

  // Se não houver perfil, mostrar mensagem ou redirecionar
  if (profileLoading || loading) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Se não houver perfil, usar perfil mockado para demonstração
  const displayProfile = profile || {
    id: 'mock',
    name: 'Usuário Amooora',
    email: 'usuario@amooora.com',
    username: 'usuario',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  };

  // Gerar username a partir do email se não existir
  const username = displayProfile.username || displayProfile.email?.split('@')[0] || 'usuario';
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'fill-[#932d6f] text-[#932d6f]' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />

        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Perfil Header - Estrutura similar à imagem */}
          <div className="px-5 pt-6 pb-4">
            {/* Avatar centralizado */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <ImageWithFallback
                  src={displayProfile.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080'}
                  alt={displayProfile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Nome */}
            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              {displayProfile.name}
            </h1>

            {/* Bio */}
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs mx-auto">
              {displayProfile.bio || 'Apaixonada por café, cultura e boas conversas. Ativista pelos direitos LGBTQIA+. 🌈'}
            </p>

            {/* Stats - 3 colunas */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{displayStats.eventsCount}</div>
                <div className="text-xs text-muted-foreground">Eventos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{displayStats.placesCount}</div>
                <div className="text-xs text-muted-foreground">Lugares</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{displayStats.friendsCount}</div>
                <div className="text-xs text-muted-foreground">Amigos</div>
              </div>
            </div>

            {/* Botões de Ação - Meus Favoritos e Editar Perfil */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Meus Favoritos - Padrão da tag "Seguro" */}
              <button
                onClick={() => onNavigate('favoritos')}
                className="px-4 py-3 rounded-full font-medium text-sm transition-colors bg-primary/10 text-primary hover:bg-primary/20"
              >
                Meus Favoritos
              </button>
              
              {/* Editar Perfil - Padrão da tag "Seguro" */}
              <button
                onClick={() => onNavigate('edit-profile')}
                className="px-4 py-3 rounded-full font-medium text-sm transition-colors bg-primary/10 text-primary hover:bg-primary/20"
              >
                Editar Perfil
              </button>
            </div>
          </div>

          {/* Locais Favoritos */}
          <div className="px-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Locais Favoritos</h2>
              <button 
                onClick={() => onNavigate('favoritos')}
                className="text-sm text-[#932d6f] font-medium flex items-center gap-1"
              >
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {displayFavoritePlaces.length > 0 ? (
                displayFavoritePlaces.slice(0, 5).map((place) => (
                  <div key={place.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{place.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{place.category}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#932d6f] text-[#932d6f]" />
                        <span className="text-xs font-medium text-gray-700">{place.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-sm text-muted-foreground">
                  Nenhum local favorito ainda
                </div>
              )}
            </div>
          </div>

          {/* Comunidades que Sigo */}
          <div className="px-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Comunidades que Sigo</h2>
              <button 
                onClick={() => onNavigate('minhas-comunidades')}
                className="text-sm text-[#932d6f] font-medium flex items-center gap-1"
              >
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {followedCommunities.length > 0 ? (
                followedCommunities.slice(0, 4).map((community) => (
                  <div 
                    key={community.id} 
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigate(`community-details:${community.community_id}`)}
                  >
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={community.imageUrl}
                        alt={community.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{community.name}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{community.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Users className="w-3 h-3" />
                        <span>{community.membersCount >= 1000 ? `${(community.membersCount / 1000).toFixed(1)}k` : community.membersCount}</span>
                        <MessageCircle className="w-3 h-3 ml-1" />
                        <span>{community.postsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-sm text-muted-foreground">
                  Você ainda não segue nenhuma comunidade
                </div>
              )}
            </div>
          </div>

          {/* Próximos Eventos */}
          <div className="px-5 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
            <div className="space-y-3">
              {displayUpcomingEvents.length > 0 ? (
                displayUpcomingEvents.map((event) => (
                  <div key={event.id} className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#932d6f] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-medium">{event.date.split(' ')[1]}</span>
                        <span className="text-lg font-bold">{event.date.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{event.time} • {event.location}</p>
                        <span className="inline-block px-2 py-0.5 bg-[#932d6f]/10 text-[#932d6f] text-xs font-medium rounded-full">
                          Confirmado
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhum evento próximo
                </div>
              )}
            </div>
          </div>

          {/* Eventos que Participei */}
          <div className="px-5 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Participei</h2>
            <div className="space-y-2">
              {displayAttendedEvents.length > 0 ? (
                displayAttendedEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900">{event.name}</h3>
                      <p className="text-xs text-gray-500">{event.date} • {event.location}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhum evento participado ainda
                </div>
              )}
            </div>
          </div>

          {/* Calendário Simples */}
          <div className="px-5 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Meu Calendário</h2>
            <div className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10">
              {/* Mini calendário visual */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  // Verificar se há evento futuro neste dia
                  const hasUpcomingEvent = displayUpcomingEvents.some(event => {
                    const eventDay = parseInt(event.date.split(' ')[0]);
                    return eventDay === day;
                  });
                  
                  // Verificar se há evento passado neste dia
                  const hasAttendedEvent = displayAttendedEvents.some(event => {
                    const eventDay = parseInt(event.date.split(' ')[0]);
                    return eventDay === day;
                  });
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                        hasUpcomingEvent
                          ? 'bg-[#932d6f] text-white font-bold'
                          : hasAttendedEvent
                          ? 'bg-green-100 text-green-700 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#932d6f] rounded"></div>
                  <span className="text-gray-600">Próximos eventos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 rounded"></div>
                  <span className="text-gray-600">Participei</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amigos da Comunidade - Será implementado depois */}
          <div className="px-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Amigos da Comunidade</h2>
              <button className="text-sm text-[#932d6f] font-medium flex items-center gap-1">
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center py-8 text-sm text-muted-foreground">
              Em breve: conecte-se com outras pessoas da comunidade
            </div>
          </div>

          {/* Minhas Reviews - Separadas por tipo */}
          <div className="px-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Minhas Reviews</h2>
            </div>

            {/* Reviews de Locais */}
            {placeReviews.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[#932d6f]" />
                  <h3 className="text-base font-semibold text-gray-900">Locais</h3>
                </div>
                <div className="space-y-3">
                  {placeReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">
                            {review.placeName || 'Local avaliado'}
                          </h3>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews de Serviços */}
            {serviceReviews.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-[#932d6f]" />
                  <h3 className="text-base font-semibold text-gray-900">Serviços</h3>
                </div>
                <div className="space-y-3">
                  {serviceReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">
                            {review.serviceName || 'Serviço avaliado'}
                          </h3>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews de Eventos */}
            {eventReviews.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-[#932d6f]" />
                  <h3 className="text-base font-semibold text-gray-900">Eventos</h3>
                </div>
                <div className="space-y-3">
                  {eventReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-sm text-gray-900 mb-1">
                            {review.eventName || 'Evento avaliado'}
                          </h3>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem quando não há reviews */}
            {placeReviews.length === 0 && serviceReviews.length === 0 && eventReviews.length === 0 && (
              <div className="text-center py-8 text-sm text-muted-foreground">
                Nenhuma avaliação ainda
              </div>
            )}
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
