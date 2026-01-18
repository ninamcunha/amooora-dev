import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { SimpleMap } from '../components/SimpleMap';
import { PlaceCardExpanded } from '../components/PlaceCardExpanded';
import { BottomNav } from '../components/BottomNav';
import { FilterModal, FilterOptions } from '../components/FilterModal';

const categories = ['Todos', 'Cafés', 'Bares', 'Restaurantes', 'Cultura'];

const mockPlaces = [
  {
    id: '1',
    name: 'Café das Minas',
    description: 'Café acolhedor com ambiente seguro e inclusivo',
    rating: 4.8,
    reviewCount: 124,
    distance: '0.8 km',
    address: 'Rua das Flores, 123',
    imageUrl: 'https://images.unsplash.com/photo-1739723745132-97df9db49db2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwY2FmZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NzgyNDAzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: [
      { label: 'Wi-Fi', color: '#932d6f' },
      { label: 'Pet-friendly', color: '#932d6f' },
      { label: 'Vegano', color: '#9B7EDE' },
    ],
    isSafe: true,
    lat: -23.5505,
    lng: -46.6333,
  },
  {
    id: '2',
    name: 'Bar Sapatão',
    description: 'Bar exclusivo para mulheres lésbicas',
    rating: 4.9,
    reviewCount: 89,
    distance: '1.2km',
    address: 'Av. Arco-Íris, 456',
    imageUrl: 'https://images.unsplash.com/photo-1697738855045-d61710a9e509?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZXNiaWFuJTIwYmFyJTIwbGdidHxlbnwxfHx8fDE3Njc4MzM0MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tags: [
      { label: 'Wi-Fi', color: '#932d6f' },
      { label: 'Pet-friendly', color: '#932d6f' },
      { label: 'Vegano', color: '#9B7EDE' },
    ],
    isSafe: true,
    lat: -23.5515,
    lng: -46.6343,
  },
  {
    id: '3',
    name: 'Restaurante Plural',
    description: 'Culinária diversa em ambiente acolhedor',
    rating: 4.7,
    reviewCount: 156,
    distance: '2.1 km',
    address: 'Praça da Diversidade, 789',
    imageUrl: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nfGVufDF8fHx8MTc2Nzc2MzE3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    tags: [
      { label: 'Vegano', color: '#9B7EDE' },
      { label: 'Wi-Fi', color: '#932d6f' },
      { label: 'Acessível', color: '#932d6f' },
    ],
    isSafe: true,
    lat: -23.5495,
    lng: -46.6323,
  },
];

interface LocaisProps {
  onNavigate: (page: string) => void;
}

export function Locais({ onNavigate }: LocaisProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    distance: 'any',
    rating: 'any',
    amenities: [],
    accessibility: false,
  });

  const handleApplyFilters = () => {
    // Aqui você pode implementar a lógica de filtragem
    console.log('Filtros aplicados:', filters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      distance: 'any',
      rating: 'any',
      amenities: [],
      accessibility: false,
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Search e filtros */}
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Locais Seguros</h1>
            
            {/* Search */}
            <div className="mb-4">
              <SearchBar
                placeholder="Buscar lugares..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>

            {/* Category Filters */}
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Map */}
          <div className="px-5 mb-6">
            <SimpleMap
              places={mockPlaces}
              center={{ lat: -23.5505, lng: -46.6333 }}
            />
          </div>

          {/* Results Header */}
          <div className="px-5 mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {mockPlaces.length} lugares encontrados
            </p>
            <button
              className="flex items-center gap-2 text-primary font-medium text-sm hover:text-primary/80 transition-colors"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Places List */}
          <div className="px-5 space-y-4 pb-6">
            {mockPlaces.map((place) => (
              <PlaceCardExpanded 
                key={place.id} 
                {...place} 
                onClick={() => onNavigate('place-details')}
              />
            ))}
          </div>
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="places" onItemClick={onNavigate} />
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}