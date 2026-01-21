import { useState, useMemo } from 'react';
import { SlidersHorizontal, MapPin } from 'lucide-react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { PlaceCardExpanded } from '../components/PlaceCardExpanded';
import { BottomNav } from '../components/BottomNav';
import { FilterModal, FilterOptions } from '../components/FilterModal';
import { EmptyState } from '../components/EmptyState';
import { SkeletonListExpanded } from '../components/Skeleton';
import { usePlaces } from '../hooks/usePlaces';
import { useAdmin } from '../hooks/useAdmin';

const categories = ['Todos', 'Cafés', 'Bares', 'Restaurantes', 'Cultura'];

interface LocaisProps {
  onNavigate: (page: string) => void;
}

export function Locais({ onNavigate }: LocaisProps) {
  const { places, loading, error } = usePlaces();
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    distance: 'any',
    rating: 'any',
  });

  // Filtrar lugares por categoria e busca
  const filteredPlaces = useMemo(() => {
    let filtered = places;

    // Filtro por categoria
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter((place) => place.category === activeCategory);
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.description?.toLowerCase().includes(query) ||
          place.address?.toLowerCase().includes(query)
      );
    }

    // Filtro por rating
    if (filters.rating !== 'any') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((place) => place.rating >= minRating);
    }

    // Filtro por distância (por enquanto apenas visual, pois não temos coordenadas do usuário)
    // TODO: Implementar cálculo de distância quando tivermos localização do usuário
    if (filters.distance !== 'any') {
      // Por enquanto, apenas manter o filtro selecionado
      // Futuramente: calcular distância real baseada em latitude/longitude
    }

    return filtered;
  }, [places, activeCategory, searchQuery, filters]);

  // Converter Place para formato do PlaceCardExpanded
  const placesForCards = useMemo(() => {
    return filteredPlaces.map((place) => ({
      id: place.id,
      name: place.name,
      description: place.description || 'Sem descrição',
      rating: place.rating,
      reviewCount: place.reviewCount || 0,
      distance: place.distance || 'N/A',
      address: place.address || 'Endereço não informado',
      imageUrl: place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
      tags: [
        { label: place.category, color: '#932d6f' },
      ],
      isSafe: place.isSafe ?? true,
      lat: place.latitude,
      lng: place.longitude,
    }));
  }, [filteredPlaces]);

  const handleApplyFilters = () => {
    // Aqui você pode implementar a lógica de filtragem
    console.log('Filtros aplicados:', filters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      distance: 'any',
      rating: 'any',
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Conteúdo scrollável - padding-top para compensar header fixo */}
        <div className="flex-1 overflow-y-auto pb-24 pt-24">
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

          {/* Loading */}
          {loading && (
            <div className="px-5 space-y-4 pb-6">
              <SkeletonListExpanded count={3} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-5">
              <EmptyState
                title="Erro ao carregar locais"
                description={error.message}
              />
            </div>
          )}

          {/* Results Header */}
          {!loading && !error && (
            <div className="px-5 mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredPlaces.length} {filteredPlaces.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
              </p>
              <button
                className="flex items-center gap-2 text-primary font-medium text-sm hover:text-primary/80 transition-colors"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
              </button>
            </div>
          )}

          {/* Places List */}
          {!loading && !error && (
            <div className="px-5 space-y-4 pb-6">
              {placesForCards.length > 0 ? (
                placesForCards.map((place) => (
                  <PlaceCardExpanded 
                    key={place.id} 
                    {...place} 
                    onClick={() => onNavigate(`place-details:${place.id}`)}
                  />
                ))
              ) : (
                <EmptyState
                  icon={MapPin}
                  title="Nenhum lugar encontrado"
                  description={searchQuery || activeCategory !== 'Todos' || Object.values(filters).some(v => v !== 'any')
                    ? "Tente ajustar os filtros ou a busca"
                    : "Ainda não há lugares cadastrados"}
                />
              )}
            </div>
          )}
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