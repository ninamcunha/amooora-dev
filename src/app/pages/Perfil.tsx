import { useState, useEffect, useMemo } from 'react';
import { Settings, Edit, Calendar, MapPin, Heart, Star, Users, ChevronRight, CheckCircle2, MessageCircle, Briefcase, Check } from 'lucide-react';
import { ImageWithFallback } from '../shared/components';
import { BottomNav } from '../shared/components';
import { Header } from '../shared/components';
import { useProfile } from '../hooks/useProfile';
import { useAdmin } from '../shared/hooks';
import { supabase } from '../infra/supabase';
import { 
  getProfileStats, 
  getSavedPlaces,
  getFavoriteEvents,
  getFavoriteServices,
  getVisitedPlaces,
  getUpcomingEvents,
  getInterestedEvents,
  getAttendedEvents,
  getUserReviews,
  getFollowedCommunities,
  type SavedPlace,
  type VisitedPlace,
  type UpcomingEvent,
  type AttendedEvent,
  type UserReview,
  type FollowedCommunity,
} from '../services/profile';

interface PerfilProps {
  onNavigate: (page: string) => void;
}

export function Perfil({ onNavigate }: PerfilProps) {
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const { isAdmin } = useAdmin();
  const [stats, setStats] = useState({ eventsCount: 0, placesCount: 0, friendsCount: 0 });
  const [favoritePlaces, setFavoritePlaces] = useState<SavedPlace[]>([]);
  const [visitedPlaces, setVisitedPlaces] = useState<VisitedPlace[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<UpcomingEvent[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<Array<{
    id: string;
    service_id: string;
    name: string;
    category: string;
    provider: string;
    imageUrl: string;
  }>>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<UpcomingEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [myReviews, setMyReviews] = useState<UserReview[]>([]);
  const [followedCommunities, setFollowedCommunities] = useState<FollowedCommunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Recarregar perfil quando receber evento de atualização
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('🔄 [Perfil] Evento profile-updated recebido, recarregando perfil...');
      refetchProfile();
    };
    
    window.addEventListener('profile-updated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [refetchProfile]);

  useEffect(() => {
    const loadProfileData = async () => {
      console.log('🔍 [Perfil] loadProfileData chamado, profile:', {
        id: profile?.id,
        name: profile?.name,
        avatar: profile?.avatar,
        hasAvatar: !!profile?.avatar,
        avatarType: typeof profile?.avatar,
        avatarLength: profile?.avatar?.length,
        isUrl: profile?.avatar?.startsWith('http'),
      });
      
      if (!profile?.id) {
        console.log('⚠️ [Perfil] Profile.id não disponível, aguardando...');
        setLoading(false);
        return;
      }

      console.log('✅ [Perfil] Profile.id disponível:', profile.id);
      console.log('📸 [Perfil] Avatar do perfil:', {
        avatar: profile.avatar,
        hasAvatar: !!profile.avatar,
        isUrl: profile.avatar?.startsWith('http'),
        avatarType: typeof profile.avatar,
      });
      console.log('📸 [Perfil] Avatar do perfil:', profile.avatar);

      try {
        setLoading(true);
        
        // Verificar sessão antes de buscar dados
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        console.log('🔍 [Perfil] Verificação de sessão:', {
          authUser: authUser?.id,
          profileId: profile.id,
          match: authUser?.id === profile.id,
          authError: authError?.message,
        });
        
        if (authError || !authUser) {
          console.error('❌ [Perfil] Erro de autenticação:', authError);
          setLoading(false);
          return;
        }
        
        // Carregar todos os dados do perfil em paralelo
        console.log('🔄 [Perfil] Iniciando busca de dados para userId:', profile.id);
        const [
          statsData,
          placesData,
          visitedPlacesData,
          eventsData,
          servicesData,
          upcomingData,
          interestedData,
          attendedData,
          reviewsData,
          communitiesData,
        ] = await Promise.all([
          getProfileStats(profile.id),
          getSavedPlaces(profile.id),
          getVisitedPlaces(profile.id),
          getFavoriteEvents(profile.id),
          getFavoriteServices(profile.id),
          getUpcomingEvents(profile.id),
          getInterestedEvents(profile.id),
          getAttendedEvents(profile.id),
          getUserReviews(profile.id),
          getFollowedCommunities(profile.id),
        ]);

        console.log('📊 [Perfil] Dados recebidos:', {
          stats: statsData,
          places: placesData.length,
          visitedPlaces: visitedPlacesData.length,
          favoriteEvents: eventsData.length,
          favoriteServices: servicesData.length,
          upcomingEvents: upcomingData.length,
          interestedEvents: interestedData.length,
          attendedEvents: attendedData.length,
          reviews: reviewsData.length,
          communities: communitiesData.length,
        });

        setStats(statsData);
        setFavoritePlaces(placesData);
        setVisitedPlaces(visitedPlacesData);
        setFavoriteEvents(eventsData);
        setFavoriteServices(servicesData);
        setUpcomingEvents(upcomingData);
        setInterestedEvents(interestedData);
        setAttendedEvents(attendedData);
        setMyReviews(reviewsData);
        setFollowedCommunities(communitiesData);
        
        // Debug logs
        console.log('✅ [Perfil] Dados do perfil carregados e salvos no estado:', {
          interestedEvents: interestedData.length,
          attendedEvents: attendedData.length,
          upcomingEvents: upcomingData.length,
        });
      } catch (error) {
        console.error('❌ [Perfil] Erro ao carregar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();

    // Listener para atualizar quando um local é marcado como visitado
    const handlePlaceVisitChanged = () => {
      console.log('🔄 [Perfil] Evento place-visit-changed recebido, recarregando locais visitados...');
      setTimeout(() => {
        loadProfileData();
      }, 500);
    };

    window.addEventListener('place-visit-changed', handlePlaceVisitChanged);

    return () => {
      window.removeEventListener('place-visit-changed', handlePlaceVisitChanged);
    };
  }, [profile?.id]);

  // Separar reviews por tipo
  const placeReviews = myReviews.filter(review => review.place_id);
  const serviceReviews = myReviews.filter(review => review.service_id);
  const eventReviews = myReviews.filter(review => review.event_id);

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

  // Se não houver perfil, mostrar mensagem
  if (!profile) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Perfil não encontrado</p>
          </div>
        </div>
      </div>
    );
  }

  // Gerar username a partir do email se não existir
  const username = profile.username || profile.email?.split('@')[0] || 'usuario';
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
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
                {profile.avatar ? (
                  <ImageWithFallback
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#932d6f] to-[#dca0c8] text-white text-2xl font-bold">
                    {profile.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Nome */}
            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              {profile.name}
            </h1>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs mx-auto">
                {profile.bio}
              </p>
            )}

            {/* Stats - 3 colunas - apenas se houver dados */}
            {(stats.eventsCount > 0 || stats.placesCount > 0 || stats.friendsCount > 0) && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.eventsCount}</div>
                  <div className="text-xs text-muted-foreground">Eventos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.placesCount}</div>
                  <div className="text-xs text-muted-foreground">Lugares</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{stats.friendsCount}</div>
                  <div className="text-xs text-muted-foreground">Amigos</div>
                </div>
              </div>
            )}

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

          {/* Locais Frequentados - apenas se houver dados */}
          {visitedPlaces.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Locais que Já Frequentei</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {visitedPlaces.slice(0, 5).map((place) => (
                  <div 
                    key={place.id} 
                    onClick={() => onNavigate(`place-details:${place.place_id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-[#932d6f] rounded-full p-1">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
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
                ))}
              </div>
            </div>
          )}

          {/* Locais Favoritos - apenas se houver dados */}
          {favoritePlaces.length > 0 && (
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
                {favoritePlaces.slice(0, 5).map((place) => (
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
                ))}
              </div>
            </div>
          )}

          {/* Eventos Favoritos - apenas se houver dados */}
          {favoriteEvents.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Eventos Favoritos</h2>
              </div>
              <div className="space-y-3">
                {favoriteEvents.slice(0, 5).map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onNavigate(`event-details:${event.event_id}`)}
                    className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10 cursor-pointer hover:bg-[#fff5f0] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#932d6f] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-medium">{event.date.split(' ')[1] || ''}</span>
                        <span className="text-lg font-bold">{event.date.split(' ')[0] || ''}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                        <p className="text-sm text-gray-600">{event.time} • {event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Serviços Favoritos - apenas se houver dados */}
          {favoriteServices.length > 0 && (
            <div className="px-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Serviços Favoritos</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {favoriteServices.slice(0, 4).map((service) => (
                  <div 
                    key={service.id} 
                    onClick={() => onNavigate(`service-details:${service.service_id}`)}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-24">
                      <ImageWithFallback
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{service.name}</h3>
                      <p className="text-xs text-gray-500 mb-1">{service.category}</p>
                      <p className="text-xs text-gray-400 truncate">{service.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comunidades que Sigo - apenas se houver dados */}
          {followedCommunities.length > 0 && (
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
                {followedCommunities.slice(0, 4).map((community) => (
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
                ))}
              </div>
            </div>
          )}

          {/* Eventos que Tenho Interesse - apenas se houver dados */}
          {interestedEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Tenho Interesse</h2>
              <div className="space-y-3">
                {interestedEvents.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onNavigate(`event-details:${event.event_id}`)}
                    className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10 cursor-pointer hover:bg-[#fff5f0] transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#932d6f] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-medium">{event.date.split(' ')[1]}</span>
                        <span className="text-lg font-bold">{event.date.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{event.time} • {event.location}</p>
                        <span className="inline-block px-2 py-0.5 bg-[#F5EBFF] text-primary text-xs font-medium rounded-full">
                          Tenho Interesse
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Próximos Eventos - apenas se houver dados */}
          {upcomingEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onNavigate(`event-details:${event.event_id}`)}
                    className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10 cursor-pointer hover:bg-[#fff5f0] transition-colors"
                  >
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
                ))}
              </div>
            </div>
          )}

          {/* Eventos que Participei - apenas se houver dados */}
          {attendedEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Participei</h2>
              <div className="space-y-2">
                {attendedEvents.map((event) => (
                  <div 
                    key={event.id} 
                    onClick={() => onNavigate(`event-details:${event.event_id}`)}
                    className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#932d6f] flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900">{event.name}</h3>
                      <p className="text-xs text-gray-500">{event.date} • {event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendário Simples - apenas se houver eventos */}
          {(upcomingEvents.length > 0 || interestedEvents.length > 0 || attendedEvents.length > 0) && (
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
                    // Combinar eventos confirmados e eventos de interesse como próximos eventos
                    const allUpcomingEvents = [...upcomingEvents, ...interestedEvents];
                    
                    // Verificar se há evento futuro neste dia (confirmado ou interesse)
                    const hasUpcomingEvent = allUpcomingEvents.some(event => {
                      const eventDay = parseInt(event.date.split(' ')[0]);
                      return eventDay === day;
                    });
                    
                    // Verificar se há evento passado neste dia
                    const hasAttendedEvent = attendedEvents.some(event => {
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
                            ? 'bg-pink-100 text-pink-700 font-medium'
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
                    <div className="w-3 h-3 bg-pink-100 rounded"></div>
                    <span className="text-gray-600">Participei</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
