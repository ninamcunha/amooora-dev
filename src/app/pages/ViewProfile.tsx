import { ArrowLeft, Calendar, MapPin, Heart, Star, Users, CheckCircle2, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Header, BottomNav, ImageWithFallback } from '../shared/components';
import { supabase } from '../infra/supabase';
import { 
  getProfileStats, 
  getSavedPlaces, 
  getUpcomingEvents,
  getInterestedEvents,
  getAttendedEvents,
  getUserReviews,
  getFollowedCommunities,
  type SavedPlace,
  type UpcomingEvent,
  type AttendedEvent,
  type UserReview,
  type FollowedCommunity,
} from '../services/profile';

interface ViewProfileProps {
  userId?: string;
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

interface Profile {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  pronouns?: string;
  city?: string;
}

export function ViewProfile({ userId, onNavigate, onBack }: ViewProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ eventsCount: 0, placesCount: 0, friendsCount: 0 });
  const [favoritePlaces, setFavoritePlaces] = useState<SavedPlace[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [interestedEvents, setInterestedEvents] = useState<UpcomingEvent[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<AttendedEvent[]>([]);
  const [myReviews, setMyReviews] = useState<UserReview[]>([]);
  const [followedCommunities, setFollowedCommunities] = useState<FollowedCommunity[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Buscar perfil do usuário
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          setLoading(false);
          return;
        }

        if (!data) {
          setLoading(false);
          return;
        }

        const username = data.email?.split('@')[0] || undefined;

        setProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          username: username,
          avatar: data.avatar || undefined,
          phone: data.phone || undefined,
          bio: data.bio || undefined,
          pronouns: data.pronouns || undefined,
          city: data.city || undefined,
        });

        // Carregar dados do perfil
        const [statsData, placesData, upcomingData, interestedData, attendedData, reviewsData, communitiesData] = await Promise.all([
          getProfileStats(userId),
          getSavedPlaces(userId),
          getUpcomingEvents(userId),
          getInterestedEvents(userId),
          getAttendedEvents(userId),
          getUserReviews(userId),
          getFollowedCommunities(userId),
        ]);

        setStats(statsData);
        setFavoritePlaces(placesData);
        setUpcomingEvents(upcomingData);
        setInterestedEvents(interestedData);
        setAttendedEvents(attendedData);
        setMyReviews(reviewsData);
        setFollowedCommunities(communitiesData);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Perfil não encontrado</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-primary text-white rounded-full"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const username = profile.username || profile.email?.split('@')[0] || 'usuario';

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        <Header onNavigate={onNavigate} showBackButton onBack={onBack} />

        <div className="flex-1 overflow-y-auto pb-24 pt-24">
          {/* Perfil Header */}
          <div className="px-5 pt-6 pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <ImageWithFallback
                  src={profile.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground text-center mb-2">
              {profile.name}
            </h1>

            {profile.bio && (
              <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs mx-auto">
                {profile.bio}
              </p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{stats.eventsCount}</div>
                <div className="text-xs text-muted-foreground">Eventos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{stats.placesCount}</div>
                <div className="text-xs text-muted-foreground">Locais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{stats.friendsCount}</div>
                <div className="text-xs text-muted-foreground">Amigas</div>
              </div>
            </div>
          </div>

          {/* Eventos que Tenho Interesse */}
          {interestedEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Tenho Interesse</h2>
              <div className="space-y-3">
                {interestedEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#932d6f] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-medium">{event.date.split(' ')[1]}</span>
                        <span className="text-lg font-bold">{event.date.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{event.time} • {event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Próximos Eventos */}
          {upcomingEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-[#fffbfa] rounded-2xl p-4 border border-[#932d6f]/10">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#932d6f] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0">
                        <span className="text-xs font-medium">{event.date.split(' ')[1]}</span>
                        <span className="text-lg font-bold">{event.date.split(' ')[0]}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{event.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{event.time} • {event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Eventos que Participei */}
          {attendedEvents.length > 0 && (
            <div className="px-5 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Participei</h2>
              <div className="space-y-2">
                {attendedEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-gray-900">{event.name}</h3>
                      <p className="text-xs text-gray-500">{event.date} • {event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <BottomNav activeItem="profile" onItemClick={onNavigate!} />
      </div>
    </div>
  );
}
