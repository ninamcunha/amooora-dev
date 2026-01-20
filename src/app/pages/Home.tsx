import { MapPin, Calendar, Scissors, MessageCircle, Scale, Heart, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { SectionHeader } from '../components/SectionHeader';
import { PlaceCard } from '../components/PlaceCard';
import { EventCard } from '../components/EventCard';
import { ServiceCard } from '../components/ServiceCard';
import { BottomNav } from '../components/BottomNav';

// Mock data
const places = [
  {
    id: '1',
    name: 'Café da Vila',
    category: 'Café',
    rating: 4.8,
    reviewCount: 124,
    distance: '0.5 km',
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY3NzY4MzY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isSafe: true,
  },
  {
    id: '2',
    name: 'Bar Liberdade',
    category: 'Bar',
    rating: 4.9,
    reviewCount: 89,
    distance: '1.2 km',
    imageUrl: 'https://images.unsplash.com/photo-1694165823915-3e5a4c881d65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXIlMjByZXN0YXVyYW50JTIwbmlnaHR8ZW58MXx8fHwxNzY3ODMwOTQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    isSafe: true,
  },
  {
    id: '3',
    name: 'Livraria Plural',
    category: 'Livraria',
    rating: 4.7,
    reviewCount: 156,
    distance: '2.1 km',
    imageUrl: 'https://images.unsplash.com/photo-1628977613138-dcfede720de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBsaWJyYXJ5fGVufDF8fHx8MTc2NzgwMDU2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    isSafe: true,
  },
];

const events = [
  {
    id: '1',
    name: 'Sarau Lésbico',
    date: '15 Dez',
    time: '19:00',
    location: 'Centro Cultural',
    participants: 45,
    imageUrl: 'https://images.unsplash.com/photo-1759658697230-cfae8940f0f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwb2V0cnklMjBnYXRoZXJpbmd8ZW58MXx8fHwxNzY3ODMwOTQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    name: 'Noite de Música',
    date: '18 Dez',
    time: '21:00',
    location: 'Bar Liberdade',
    participants: 62,
    imageUrl: 'https://images.unsplash.com/photo-1743791022256-40413c5f019b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwbXVzaWMlMjBldmVudHxlbnwxfHx8fDE3Njc3ODU5Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    name: 'Encontro Literário',
    date: '20 Dez',
    time: '16:00',
    location: 'Livraria Plural',
    participants: 28,
    imageUrl: 'https://images.unsplash.com/photo-1628977613138-dcfede720de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBsaWJyYXJ5fGVufDF8fHx8MTc2NzgwMDU2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const services = [
  { id: '1', name: 'Terapia', icon: MessageCircle, color: '#932d6f' },
  { id: '2', name: 'Advocacia', icon: Scale, color: '#932d6f' },
  { id: '3', name: 'Saúde', icon: Heart, color: '#932d6f' },
  { id: '4', name: 'Carreira', icon: Sparkles, color: '#932d6f' },
];

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const handleServiceClick = (serviceName: string) => {
    const categoryMap: { [key: string]: string } = {
      'Terapia': 'terapia',
      'Advocacia': 'advocacia',
      'Saúde': 'saude',
      'Carreira': 'carreira',
    };
    
    const category = categoryMap[serviceName];
    if (category) {
      onNavigate(`service-category-${category}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Container mobile-first */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} />
        
        {/* Main content com scroll */}
        <main className="flex-1 overflow-y-auto px-5 py-6 space-y-8 pb-24">
          {/* Seção: Lugares Seguros Próximos */}
          <section>
            <SectionHeader 
              icon={<MapPin className="w-5 h-5" />}
              title="Lugares Seguros Próximos"
              onViewAll={() => onNavigate('places')}
            />
            <div className="space-y-4">
              {places.map((place) => (
                <PlaceCard 
                  key={place.id} 
                  {...place} 
                  onClick={() => onNavigate(`place-details:${place.id}`)}
                />
              ))}
            </div>
          </section>

          {/* Seção: Eventos Recomendados */}
          <section>
            <SectionHeader 
              icon={<Calendar className="w-5 h-5" />}
              title="Eventos Recomendados"
              onViewAll={() => onNavigate('events')}
            />
            <div>
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  {...event} 
                  onClick={() => onNavigate('event-details')}
                />
              ))}
            </div>
          </section>

          {/* Seção: Serviços para Você */}
          <section>
            <SectionHeader 
              icon={<Scissors className="w-5 h-5" />}
              title="Serviços para Você"
              onViewAll={() => console.log('Ver todos serviços')}
            />
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <ServiceCard key={service.id} {...service} onClick={() => handleServiceClick(service.name)} />
              ))}
            </div>
          </section>
        </main>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="home" onItemClick={onNavigate} />
      </div>
    </div>
  );
}