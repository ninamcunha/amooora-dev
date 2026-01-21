import { useState, useEffect } from 'react';
import { Settings, Edit, Calendar, MapPin, Heart, Star, Users, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';
import { useProfile } from '../hooks/useProfile';
import { useAdmin } from '../hooks/useAdmin';
import { 
  getProfileStats, 
  getSavedPlaces, 
  getUpcomingEvents, 
  getAttendedEvents, 
  getUserReviews,
  type SavedPlace,
  type UpcomingEvent,
  type AttendedEvent,
  type UserReview,
} from '../services/profile';

interface PerfilProps {
  onNavigate: (page: string) => void;
}

export function Perfil({ onNavigate }: PerfilProps) {
  const { profile, loading: profileLoading } = useProfile();
  const { isAdmin } = useAdmin();
  const [stats, setStats] = useState({ eventsCount: 0, placesCount: 0, friendsCount: 0 });
  const [favoritePlaces, setFavoritePlaces] = useState<SavedPlace[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [myReviews, setMyReviews] = useState<UserReview[]>([]);
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
        const [statsData, placesData, upcomingData, attendedData, reviewsData] = await Promise.all([
          getProfileStats(profile.id),
          getSavedPlaces(profile.id),
          getUpcomingEvents(profile.id),
          getAttendedEvents(profile.id),
          getUserReviews(profile.id),
        ]);

        setStats(statsData);
        setFavoritePlaces(placesData);
        setUpcomingEvents(upcomingData);
        setAttendedEvents(attendedData);
        setMyReviews(reviewsData);
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [profile?.id]);

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted">
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
          <Header onNavigate={onNavigate} isAdmin={isAdmin} />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Você precisa fazer login para ver seu perfil</p>
              <button
                onClick={() => onNavigate('welcome')}
                className="px-6 py-2 bg-[#932d6f] text-white rounded-full"
              >
                Fazer Login
              </button>
            </div>
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

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Cabeçalho do Perfil com Gradiente */}
          <div className="relative bg-gradient-to-br from-[#A84B8E] to-[#8B3A7A] pt-6 pb-6 px-5">
            <div className="flex items-center gap-4">
              {/* Avatar à esquerda */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-white p-1">
                  <ImageWithFallback
                    src={profile.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080'}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Name and Username ao centro */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white mb-0.5 truncate">{profile.name}</h1>
                <p className="text-white/80 text-sm truncate">@{username}</p>
              </div>

              {/* Botão Editar Perfil à direita */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => onNavigate('edit-profile')}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full font-medium text-[#932d6f] hover:bg-white/90 transition-colors text-sm whitespace-nowrap border border-[#932d6f]/20"
                >
                  <Edit className="w-4 h-4" />
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-5 mt-4 mb-6 relative z-10">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <Calendar className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
                <div className="font-bold text-lg text-gray-900">{stats.eventsCount}</div>
                <div className="text-xs text-gray-600">Eventos</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <MapPin className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
                <div className="font-bold text-lg text-gray-900">{stats.placesCount}</div>
                <div className="text-xs text-gray-600">Lugares</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <Users className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
                <div className="font-bold text-lg text-gray-900">{stats.friendsCount}</div>
                <div className="text-xs text-gray-600">Amigos</div>
              </div>
            </div>
          </div>

          {/* Locais Favoritos */}
          <div className="px-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Locais Favoritos</h2>
              <button className="text-sm text-[#932d6f] font-medium flex items-center gap-1">
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {favoritePlaces.length > 0 ? (
                favoritePlaces.slice(0, 5).map((place) => (
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

          {/* Próximos Eventos */}
          <div className="px-5 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
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
              {attendedEvents.length > 0 ? (
                attendedEvents.map((event) => (
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
                  const hasUpcomingEvent = upcomingEvents.some(event => {
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

          {/* Minhas Reviews */}
          <div className="px-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Minhas Reviews</h2>
              <button className="text-sm text-[#932d6f] font-medium flex items-center gap-1">
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {myReviews.length > 0 ? (
                myReviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 mb-1">
                          {review.placeName || review.serviceName || review.eventName || 'Item avaliado'}
                        </h3>
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhuma avaliação ainda
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="profile" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
