import { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { CategoryFilter } from '../components/CategoryFilter';
import { EventCardExpanded } from '../components/EventCardExpanded';
import { BottomNav } from '../components/BottomNav';
import { useEvents } from '../hooks/useEvents';
import { useAdmin } from '../hooks/useAdmin';

const categories = ['Todos', 'Hoje', 'Semana', 'Gratuitos'];

interface EventosProps {
  onNavigate: (page: string) => void;
}

export function Eventos({ onNavigate }: EventosProps) {
  const { events, loading, error } = useEvents();
  const { isAdmin } = useAdmin();
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const month = months[date.getMonth()];
    return `${day} ${month}`;
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Filtrar eventos por categoria
  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Aplicar filtros baseados na categoria selecionada
    if (activeCategory === 'Todos') {
      // Mostrar todos os eventos (sem filtro)
      filtered = events;
    } else if (activeCategory === 'Hoje') {
      // Filtrar apenas eventos de hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filtered = events.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && eventDate < tomorrow;
      });
    } else if (activeCategory === 'Semana') {
      // Filtrar eventos da semana (próximos 7 dias)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      filtered = events.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && eventDate < nextWeek;
      });
    } else if (activeCategory === 'Gratuitos') {
      // Filtrar apenas eventos gratuitos
      filtered = events.filter((event) => !event.price || event.price === 0);
    }

    return filtered;
  }, [events, activeCategory]);

  // Converter Event para formato do EventCardExpanded
  const eventsForCards = useMemo(() => {
    return filteredEvents.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description || 'Sem descrição',
      date: event.date ? formatDate(event.date) : 'Data não informada',
      fullDate: event.date ? formatFullDate(event.date) : 'Data não informada',
      time: event.time || 'Horário não informado',
      location: event.location || 'Local não informado',
      participants: `${event.participants || 0} participantes`,
      imageUrl: event.imageUrl || event.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
      category: {
        label: event.category || 'Evento',
        color: '#932d6f',
      },
      price: event.price && event.price > 0 ? `R$ ${event.price.toFixed(2)}` : 'Gratuito',
      isPaid: event.price ? event.price > 0 : false,
    }));
  }, [filteredEvents]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Eventos</h1>
            
            {/* Category Filters */}
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-5 py-12 text-center">
              <p className="text-muted-foreground">Carregando eventos...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-5 py-12 text-center">
              <p className="text-red-500">Erro ao carregar eventos: {error.message}</p>
            </div>
          )}

          {/* Events List */}
          {!loading && !error && (
            <div className="px-5 space-y-4 pb-6">
              {eventsForCards.length > 0 ? (
                eventsForCards.map((event) => (
                  <EventCardExpanded 
                    key={event.id} 
                    {...event} 
                    onClick={() => onNavigate(`event-details:${event.id}`)}
                  />
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum evento encontrado</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="events" onItemClick={onNavigate} />
      </div>
    </div>
  );
}