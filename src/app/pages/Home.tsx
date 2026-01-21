import { useMemo } from 'react';
import { MapPin, Calendar, Scissors, MessageCircle, Scale, Heart, Sparkles, Briefcase, Stethoscope, GraduationCap, ShoppingBag, UtensilsCrossed, Palette, Dumbbell, Music, BookOpen, Camera, Car, Home as HomeIcon, UserCheck, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Header } from '../components/Header';
import { SectionHeader } from '../components/SectionHeader';
import { PlaceCard } from '../components/PlaceCard';
import { EventCard } from '../components/EventCard';
import { ServiceCard } from '../components/ServiceCard';
import { BottomNav } from '../components/BottomNav';
import { usePlaces } from '../hooks/usePlaces';
import { useEvents } from '../hooks/useEvents';
import { useServices } from '../hooks/useServices';
import { useAdmin } from '../hooks/useAdmin';
import logoAmooora from "../../assets/2bcf17d7cfb76a60c14cf40243974d7d28fb3842.png";

// Mapeamento de categorias para ícones
const categoryIconMap: { [key: string]: LucideIcon } = {
  'Terapia': MessageCircle,
  'Advocacia': Scale,
  'Saúde': Heart,
  'Carreira': Briefcase,
  'Saude': Heart,
  'Beleza': Sparkles,
  'Educação': GraduationCap,
  'Comércio': ShoppingBag,
  'Alimentação': UtensilsCrossed,
  'Arte': Palette,
  'Esporte': Dumbbell,
  'Música': Music,
  'Livros': BookOpen,
  'Fotografia': Camera,
  'Transporte': Car,
  'Construção': HomeIcon,
  'Recursos Humanos': UserCheck,
  'Negócios': Building2,
  // Adicionar mais mapeamentos conforme necessário
};

// Cores padrão - usar variáveis do tema
const DEFAULT_COLOR = '#932d6f'; // Primary (roxo)

interface HomeProps {
  onNavigate: (page: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  // Buscar dados reais do Supabase
  const { places, loading: loadingPlaces, error: errorPlaces } = usePlaces();
  const { events, loading: loadingEvents, error: errorEvents } = useEvents();
  const { services, loading: loadingServices, error: errorServices } = useServices();
  // Sem autenticação: sempre permitir acesso admin
  const { isAdmin } = useAdmin();

  // Limitar a 3 locais e 3 eventos para exibição na home
  const limitedPlaces = places.slice(0, 3);
  const limitedEvents = events.slice(0, 3);

  // Agrupar serviços por categoria e pegar as 4 mais comuns
  const topCategories = useMemo(() => {
    if (!services || services.length === 0) {
      // Fallback para categorias padrão se não houver serviços
      return [
        { id: '1', name: 'Terapia', icon: MessageCircle, color: DEFAULT_COLOR, count: 0 },
        { id: '2', name: 'Advocacia', icon: Scale, color: DEFAULT_COLOR, count: 0 },
        { id: '3', name: 'Saúde', icon: Heart, color: DEFAULT_COLOR, count: 0 },
        { id: '4', name: 'Carreira', icon: Sparkles, color: DEFAULT_COLOR, count: 0 },
      ];
    }

    // Agrupar por categoria
    const categoryCount: { [key: string]: number } = {};
    const categorySlugs: { [key: string]: string } = {};
    
    services.forEach((service) => {
      const category = service.category || 'Outros';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      if (service.categorySlug) {
        categorySlugs[category] = service.categorySlug;
      }
    });

    // Converter para array e ordenar por quantidade (maior para menor)
    const sortedCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({
        category,
        count,
        slug: categorySlugs[category] || category.toLowerCase().replace(/\s+/g, '-'),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4); // Pegar top 4

    // Mapear para formato do ServiceCard
    return sortedCategories.map((item, index) => ({
      id: `category-${index + 1}`,
      name: item.category,
      icon: categoryIconMap[item.category] || Scissors, // Ícone padrão se não encontrado
      color: DEFAULT_COLOR,
      count: item.count,
      slug: item.slug,
    }));
  }, [services]);

  const handleServiceClick = (categorySlug: string) => {
    if (categorySlug) {
      onNavigate(`service-category-${categorySlug}`);
    } else {
      // Fallback para navegação geral
      onNavigate('services');
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Container mobile-first */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Main content com scroll */}
        <main className="flex-1 overflow-y-auto px-5 py-6 space-y-8 pb-24">
          {/* Logo Amooora */}
          <div className="flex justify-center mb-6">
            <img
              src={logoAmooora}
              alt="Amooora"
              className="h-20"
            />
          </div>

          {/* Seção: Lugares Seguros Próximos */}
          <section>
            <SectionHeader 
              icon={<MapPin className="w-5 h-5" />}
              title="Lugares Seguros Próximos"
              onViewAll={() => onNavigate('places')}
            />
            <div className="space-y-4">
              {loadingPlaces ? (
                <p className="text-center text-muted-foreground text-sm py-4">Carregando locais...</p>
              ) : errorPlaces ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">Erro ao carregar locais</p>
                  <p className="text-red-500 text-xs mt-1">{errorPlaces.message}</p>
                </div>
              ) : limitedPlaces.length > 0 ? (
                limitedPlaces.map((place) => (
                  <PlaceCard 
                    key={place.id}
                    name={place.name}
                    category={place.category}
                    rating={place.rating}
                    reviewCount={place.reviewCount || 0}
                    distance={place.distance || 'Distância não disponível'}
                    imageUrl={place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
                    isSafe={place.isSafe}
                    onClick={() => onNavigate(`place-details:${place.id}`)}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm py-4">Nenhum local encontrado</p>
              )}
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
              {loadingEvents ? (
                <p className="text-center text-muted-foreground text-sm py-4">Carregando eventos...</p>
              ) : errorEvents ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">Erro ao carregar eventos</p>
                  <p className="text-red-500 text-xs mt-1">{errorEvents.message}</p>
                </div>
              ) : limitedEvents.length > 0 ? (
                limitedEvents.map((event) => {
                  // Formatar data para exibição
                  const eventDate = new Date(event.date);
                  const day = eventDate.getDate().toString().padStart(2, '0');
                  const month = eventDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
                  const time = event.time || eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                  
                  return (
                    <EventCard 
                      key={event.id}
                      name={event.name}
                      date={`${day} ${month}`}
                      time={time || 'Horário não disponível'}
                      location={event.location}
                      participants={event.participants || 0}
                      imageUrl={event.imageUrl || event.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem'}
                      onClick={() => onNavigate(`event-details:${event.id}`)}
                    />
                  );
                })
              ) : (
                <p className="text-center text-muted-foreground text-sm py-4">Nenhum evento encontrado</p>
              )}
            </div>
          </section>

          {/* Seção: Serviços para Você */}
          <section>
            <SectionHeader 
              icon={<Scissors className="w-5 h-5" />}
              title="Serviços para Você"
              onViewAll={() => onNavigate('services')}
            />
            <div className="grid grid-cols-2 gap-3">
              {loadingServices ? (
                <div className="col-span-2 text-center text-muted-foreground text-sm py-4">
                  Carregando serviços...
                </div>
              ) : errorServices ? (
                <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">Erro ao carregar serviços</p>
                  <p className="text-red-500 text-xs mt-1">{errorServices.message}</p>
                </div>
              ) : topCategories.length > 0 ? (
                topCategories.map((category) => (
                  <ServiceCard 
                    key={category.id} 
                    name={category.name}
                    icon={category.icon}
                    color={category.color}
                    onClick={() => handleServiceClick(category.slug || category.name.toLowerCase())}
                  />
                ))
              ) : (
                <div className="col-span-2 text-center text-muted-foreground text-sm py-4">
                  Nenhum serviço encontrado
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Navegação inferior fixa */}
        <BottomNav activeItem="home" onItemClick={onNavigate} />
      </div>
    </div>
  );
}