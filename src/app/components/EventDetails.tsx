import { Calendar, Clock, MapPin, Users, Heart, Share2, Flag, CheckCircle, Star, User } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

interface EventDetailsProps {
  onNavigate?: (page: string) => void;
  onBack?: () => void;
}

export function EventDetails({ onNavigate, onBack }: EventDetailsProps) {
  const [isGoing, setIsGoing] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const event = {
    id: '1',
    name: 'Sarau Lésbico - Noite de Poesia e Música',
    description: 'Uma noite especial dedicada à arte e cultura sáfica! Venha compartilhar suas poesias, cantar, tocar ou simplesmente apreciar talentos incríveis da nossa comunidade. Espaço seguro, acolhedor e cheio de afeto. Traga seu coração aberto e sua arte!',
    date: '15 Jan 2026',
    dayOfWeek: 'Quinta-feira',
    startTime: '19:00',
    endTime: '23:00',
    location: 'Centro Cultural da Diversidade',
    address: 'Rua Augusta, 1230 - Consolação, São Paulo/SP',
    organizer: {
      name: 'Coletivo Sapatão',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
    },
    images: [
      'https://images.unsplash.com/photo-1759658697230-cfae8940f0f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwb2V0cnklMjBnYXRoZXJpbmd8ZW58MXx8fHwxNjc3ODMwOTQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVudHxlbnwxfHx8fDE3Njc3ODU5Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVudHxlbnwxfHx8fDE3Njc3ODU5Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    goingCount: 45,
    interestedCount: 89,
    price: 'Entrada Solidária',
    priceDetails: 'Contribuição consciente - sugestão R$ 10',
    tags: ['Cultura', 'Poesia', 'Música', 'Arte', 'Comunidade'],
    rules: [
      'Espaço seguro e livre de LGBTfobia',
      'Respeito às artistas e participantes',
      'Proibido fotografar sem consentimento',
      'Bebidas alcoólicas apenas para maiores de 18 anos',
    ],
    attendees: [
      {
        id: '1',
        name: 'Mariana Silva',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '2',
        name: 'Julia Costa',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '3',
        name: 'Beatriz Alves',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '4',
        name: 'Fernanda Lima',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      {
        id: '5',
        name: 'Amanda Santos',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2dpc3QlMjB3b21lbnxlbnwxfHx8fDE3Njc4MzQzNTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
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

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col relative">
        {/* Header fixo */}
        <Header onNavigate={onNavigate!} showBackButton onBack={onBack} />

        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Galeria de Fotos */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {event.images.map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 snap-start">
                  <ImageWithFallback
                    src={image}
                    alt={`${event.name} - ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
            {/* Indicador de Fotos */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {event.images.map((_, index) => (
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
          <div className="bg-white px-4 py-5">
            {/* Nome do Evento */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {event.name}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#932d6f]/10 text-[#932d6f] rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Organizador */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Organizado por</p>
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-gray-900">{event.organizer.name}</p>
                  {event.organizer.verified && (
                    <CheckCircle className="w-4 h-4 text-[#932d6f]" />
                  )}
                </div>
              </div>
            </div>

            {/* Descrição */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              {event.description}
            </p>
          </div>

          {/* Informações de Data e Hora */}
          <div className="bg-[#fffbfa] px-4 py-4 border-y border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Quando</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">{event.date}</p>
                  <p className="text-sm text-gray-600">{event.dayOfWeek}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {event.startTime} - {event.endTime}
                  </p>
                  <p className="text-sm text-gray-600">Horário de Brasília</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações de Local */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Onde</h3>
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 text-[#932d6f] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{event.location}</p>
                <p className="text-sm text-gray-600">{event.address}</p>
              </div>
            </div>
            {/* Mapa Placeholder */}
            <div className="w-full h-40 bg-gray-200 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976793884914!2d-46.66172492377132!3d-23.561686778786926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1704903600000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Mapa do evento"
              ></iframe>
            </div>
            <button className="w-full mt-3 py-2 text-sm text-[#932d6f] font-semibold border border-[#932d6f] rounded-xl hover:bg-[#932d6f]/5 transition-colors">
              Ver no Google Maps
            </button>
          </div>

          {/* Preço/Ingresso */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-2">Ingresso</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-[#932d6f]">{event.price}</p>
                <p className="text-sm text-gray-600">{event.priceDetails}</p>
              </div>
            </div>
          </div>

          {/* Participantes */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">Participantes</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{event.goingCount} confirmadas</span>
              </div>
            </div>

            {/* Avatares dos Participantes */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {event.attendees.map((attendee) => (
                  <img
                    key={attendee.id}
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    title={attendee.name}
                  />
                ))}
              </div>
              {event.goingCount > event.attendees.length && (
                <span className="text-sm text-gray-600">
                  + {event.goingCount - event.attendees.length} outras pessoas
                </span>
              )}
            </div>

            {/* Contador de Interessadas */}
            <div className="text-sm text-gray-600">
              <Heart className="w-4 h-4 inline mr-1" />
              {event.interestedCount} pessoas interessadas
            </div>
          </div>

          {/* Regras do Evento */}
          <div className="bg-[#fffbfa] px-4 py-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3">Regras e Orientações</h3>
            <ul className="space-y-2">
              {event.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[#932d6f] mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Botões de Ação Secundários */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex gap-2 overflow-x-auto">
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors">
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
              <button className="flex items-center gap-2 px-4 py-1.5 bg-[rgba(147,45,111,0.1)] text-[#932d6f] rounded-full text-sm font-medium whitespace-nowrap hover:bg-[rgba(147,45,111,0.2)] transition-colors">
                <Flag className="w-4 h-4" />
                Denunciar
              </button>
            </div>
          </div>

          {/* Espaço extra no final */}
          <div className="h-6"></div>
        </div>

        {/* Barra de Ação Fixa no Bottom */}
        <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
          <div className="max-w-md mx-auto flex gap-3">
            <button
              onClick={handleInterestedClick}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                isInterested
                  ? 'bg-[#FF6B7A] text-white'
                  : 'border-2 border-[#FF6B7A] text-[#FF6B7A] hover:bg-[#FF6B7A]/5'
              }`}
            >
              <Star className={`w-5 h-5 ${isInterested ? 'fill-white' : ''}`} />
              {isInterested ? 'Interessada' : 'Tenho Interesse'}
            </button>
            <button
              onClick={handleGoingClick}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                isGoing
                  ? 'bg-[#932d6f] text-white'
                  : 'bg-gradient-to-r from-[#932d6f] to-[#FF6B7A] text-white hover:shadow-lg'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              {isGoing ? 'Confirmado!' : 'Vou Comparecer'}
            </button>
          </div>
        </div>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="events" onItemClick={onNavigate!} />
      </div>
    </div>
  );
}