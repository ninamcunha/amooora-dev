import { Settings, Edit, Calendar, MapPin, Heart, Star, Users, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { BottomNav } from '../components/BottomNav';
import { Header } from '../components/Header';

const favoritePlaces = [
  {
    id: '1',
    name: 'Café da Vila',
    category: 'Café',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NzY4MzY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    name: 'Bar Liberdade',
    category: 'Bar',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1694165823915-3e5a4c881d65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXIlMjByZXN0YXVyYW50JTIwbmlnaHR8ZW58MXx8fHwxNzY3ODMwOTQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    name: 'Livraria Plural',
    category: 'Livraria',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1628977613138-dcfede720de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBsaWJyYXJ5fGVufDF8fHx8MTc2NzgwMDU2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    name: 'Spa Zen',
    category: 'Bem-estar',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1599137055145-3e6f2ae470f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjB3b21lbnxlbnwxfHx8fDE3Njc4MzM5NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '5',
    name: 'Teatro Plural',
    category: 'Cultura',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwc3RhZ2V8ZW58MXx8fHwxNzY3ODM0MzUwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const upcomingEvents = [
  {
    id: '1',
    name: 'Sarau Lésbico',
    date: '15 Jan',
    time: '19:00',
    location: 'Centro Cultural',
    status: 'upcoming',
  },
  {
    id: '2',
    name: 'Noite de Música',
    date: '18 Jan',
    time: '21:00',
    location: 'Bar Liberdade',
    status: 'upcoming',
  },
];

const attendedEvents = [
  {
    id: '3',
    name: 'Workshop de Autocuidado',
    date: '5 Dez',
    location: 'Spa Zen',
    status: 'attended',
  },
  {
    id: '4',
    name: 'Encontro Literário',
    date: '28 Nov',
    location: 'Livraria Plural',
    status: 'attended',
  },
];

const friends = [
  {
    id: '1',
    name: 'Mariana Silva',
    username: '@mariana',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    name: 'Julia Costa',
    username: '@jucoast',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    name: 'Beatriz Alves',
    username: '@bialves',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    name: 'Fernanda Lima',
    username: '@ferxlima',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const myReviews = [
  {
    id: '1',
    placeName: 'Café da Vila',
    rating: 5,
    comment: 'Lugar maravilhoso, ambiente acolhedor e seguro. Adorei!',
    date: '10 Dez',
  },
  {
    id: '2',
    placeName: 'Bar Liberdade',
    rating: 5,
    comment: 'Melhor bar da cidade! Música boa, drinks incríveis e muita diversidade.',
    date: '5 Dez',
  },
  {
    id: '3',
    placeName: 'Livraria Plural',
    rating: 4,
    comment: 'Ótima seleção de livros LGBTQIA+. Recomendo!',
    date: '1 Dez',
  },
];

interface PerfilProps {
  onNavigate: (page: string) => void;
}

export function Perfil({ onNavigate }: PerfilProps) {
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
        <Header onNavigate={onNavigate} />

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Cabeçalho do Perfil com Gradiente */}
          <div className="relative bg-gradient-to-br from-[#A84B8E] to-[#8B3A7A] pt-6 pb-8 px-5">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full bg-white p-1">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZyaWVuZHMlMjBncm91cCUyMGhhcHB5fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Ana Paula"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Name and Username */}
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-white mb-1">Ana Paula</h1>
              <p className="text-white/80 text-sm">@anapaula</p>
            </div>

            {/* Botão Editar Perfil */}
            <div className="flex justify-center">
              <button
                onClick={() => onNavigate('edit-profile')}
                className="flex items-center gap-2 px-6 py-2.5 bg-white rounded-full font-medium text-[#932d6f] hover:bg-white/90 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar Perfil
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="px-5 -mt-6 mb-6 relative z-10">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <Calendar className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
                <div className="font-bold text-lg text-gray-900">{upcomingEvents.length + attendedEvents.length}</div>
                <div className="text-xs text-gray-600">Eventos</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <MapPin className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
                <div className="font-bold text-lg text-gray-900">{favoritePlaces.length}</div>
                <div className="text-xs text-gray-600">Lugares</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <Users className="w-5 h-5 text-[#932d6f] mx-auto mb-2" />
                <div className="font-bold text-lg text-gray-900">{friends.length}</div>
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
                      <span className="text-xs font-medium text-gray-700">{place.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos Eventos */}
          <div className="px-5 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Próximos Eventos</h2>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
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
              ))}
            </div>
          </div>

          {/* Eventos que Participei */}
          <div className="px-5 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Eventos que Participei</h2>
            <div className="space-y-2">
              {attendedEvents.map((event) => (
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
                  const hasEvent = [15, 18].includes(day); // Dias com eventos futuros
                  const attended = [5, 28].includes(day); // Dias de eventos passados
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex items-center justify-center text-sm rounded-lg ${
                        hasEvent
                          ? 'bg-[#932d6f] text-white font-bold'
                          : attended
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

          {/* Amigos da Comunidade */}
          <div className="px-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Amigos da Comunidade</h2>
              <button className="text-sm text-[#932d6f] font-medium flex items-center gap-1">
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {friends.map((friend) => (
                <div key={friend.id} className="text-center">
                  <div className="w-full aspect-square rounded-full overflow-hidden mb-2 border-2 border-[#932d6f]/20">
                    <ImageWithFallback
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-900 truncate">{friend.name.split(' ')[0]}</p>
                </div>
              ))}
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
              {myReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900 mb-1">{review.placeName}</h3>
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="" onItemClick={onNavigate} />
      </div>
    </div>
  );
}
