import { useState } from 'react';
import { Header } from '../components/Header';
import { CategoryFilter } from '../components/CategoryFilter';
import { EventCardExpanded } from '../components/EventCardExpanded';
import { BottomNav } from '../components/BottomNav';

const categories = ['Todos', 'Hoje', 'Semana', 'Gratuitos'];

const mockEvents = [
  {
    id: '1',
    name: 'Sarau Lésbico',
    description: 'Noite de poesia, música e arte com mulheres da comunidade',
    date: '15 Dez',
    fullDate: '15 de Dezembro, 2024',
    time: '19h00',
    location: 'Centro Cultural - Rua das Artes, 100',
    participants: '45/80 participantes',
    imageUrl: 'https://images.unsplash.com/photo-1756978303719-57095d8bd250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBmZXN0aXZhbCUyMGNyb3dkfGVufDF8fHx8MTc2NzcwODU4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: {
      label: 'Cultura',
      color: '#932d6f',
    },
    price: 'Gratuito',
    isPaid: false,
  },
  {
    id: '2',
    name: 'Workshop de Autocuidado',
    description: 'Práticas de bem-estar e saúde mental para mulheres lésbicas',
    date: '18 Dez',
    fullDate: '18 de Dezembro, 2024',
    time: '14h00',
    location: 'Espaço Violeta - Av. Bem-Estar, 250',
    participants: '28/30 participantes',
    imageUrl: 'https://images.unsplash.com/photo-1599137055145-3e6f2ae470f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjB3b21lbnxlbnwxfHx8fDE3Njc4MzM5NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: {
      label: 'Bem-estar',
      color: '#932d6f',
    },
    price: 'R$ 50',
    isPaid: true,
  },
  {
    id: '3',
    name: 'Festa Sapatão',
    description: 'Festa exclusiva com DJ, open bar e muita diversão',
    date: '20 Dez',
    fullDate: '20 de Dezembro, 2024',
    time: '22h00',
    location: 'Club Arco-Íris - Rua da Festa, 789',
    participants: '120/150 participantes',
    imageUrl: 'https://images.unsplash.com/photo-1561057160-ce83b1bd72f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZ2J0JTIwcHJpZGUlMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3Njc4MzM5NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: {
      label: 'Festa',
      color: '#FF6B7A',
    },
    price: 'R$ 30',
    isPaid: true,
  },
  {
    id: '4',
    name: 'Roda de Conversa',
    description: 'Debate sobre representatividade e visibilidade lésbica',
    date: '22 Dez',
    fullDate: '22 de Dezembro, 2024',
    time: '18h00',
    location: 'Biblioteca Plural - Rua do Conhecimento, 45',
    participants: '15/25 participantes',
    imageUrl: 'https://images.unsplash.com/photo-1628977613138-dcfede720de7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rc3RvcmUlMjBsaWJyYXJ5fGVufDF8fHx8MTc2NzgwMDU2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: {
      label: 'Cultura',
      color: '#932d6f',
    },
    price: 'Gratuito',
    isPaid: false,
  },
];

interface EventosProps {
  onNavigate: (page: string) => void;
}

export function Eventos({ onNavigate }: EventosProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} />
        
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

          {/* Events List */}
          <div className="px-5 space-y-4 pb-6">
            {mockEvents.map((event) => (
              <EventCardExpanded 
                key={event.id} 
                {...event} 
                onClick={() => onNavigate('event-details')}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="events" onItemClick={onNavigate} />
      </div>
    </div>
  );
}