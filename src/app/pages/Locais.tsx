import { useState, useMemo, useEffect } from 'react';
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
import { usePlaceReviews } from '../hooks/useReviews';
import { calculateAverageRating } from '../services/reviews';
import { useFilterPreferences } from '../hooks/useFilterPreferences';
import { useAdmin } from '../hooks/useAdmin';

const categories = ['Todos', 'Cafés', 'Bares', 'Restaurantes', 'Cultura'];

interface LocaisProps {
  onNavigate: (page: string) => void;
}

export function Locais({ onNavigate }: LocaisProps) {
  const { places, loading, error } = usePlaces();
  const { isAdmin } = useAdmin();
  const { filters, updateFilters, clearFilters } = useFilterPreferences();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  // Estado para ratings médios reais calculados das reviews
  const [placeRatings, setPlaceRatings] = useState<Record<string, number>>({});
  
  // Calcular ratings médios reais para todos os lugares
  useEffect(() => {
    if (places.length > 0) {
      // Por enquanto, usar o rating do lugar como base
      // Em uma implementação futura, buscaríamos reviews de todos os lugares
      const ratingsMap: Record<string, number> = {};
      places.forEach(place => {
        ratingsMap[place.id] = place.rating || 0;
      });
      setPlaceRatings(ratingsMap);
    }
  }, [places]);

  // Gerar tags mockadas baseadas na descrição do lugar (simulação)
  const getPlaceTags = useMemo(() => {
    return (place: typeof places[0]): string[] => {
      const tags: string[] = [];
      const desc = (place.description || '').toLowerCase();
      
      // Tags baseadas em palavras-chave na descrição
      if (desc.includes('vegano') || desc.includes('vegetariano')) tags.push('vegano');
      if (desc.includes('pet') || desc.includes('animal')) tags.push('aceita-pets');
      if (desc.includes('acessível') || desc.includes('cadeirante')) tags.push('acessivel');
      if (desc.includes('drag') || desc.includes('show')) tags.push('drag-shows');
      if (desc.includes('wifi') || desc.includes('internet')) tags.push('wifi-gratis');
      if (desc.includes('estacionamento') || desc.includes('parking')) tags.push('estacionamento');
      if (desc.includes('música') || desc.includes('música ao vivo')) tags.push('musica-ao-vivo');
      if (desc.includes('ar livre') || desc.includes('terraço') || desc.includes('varanda')) tags.push('ar-livre');
      
      return tags;
    };
  }, [places]);

  // Filtrar lugares por categoria, busca, rating e tags
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

    // Filtro por rating (usar rating médio real se disponível)
    if (filters.rating !== 'any') {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((place) => {
        const placeRating = placeRatings[place.id] || place.rating;
        return placeRating >= minRating;
      });
    }

    // Filtro por tags
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((place) => {
        const placeTags = place.tags || getPlaceTags(place);
        // O lugar deve ter pelo menos uma das tags selecionadas
        return filters.tags!.some(tag => placeTags.includes(tag));
      });
    }

    // Filtro por distância (por enquanto apenas visual, pois não temos coordenadas do usuário)
    // TODO: Implementar cálculo de distância quando tivermos localização do usuário
    if (filters.distance !== 'any') {
      // Por enquanto, apenas manter o filtro selecionado
      // Futuramente: calcular distância real baseada em latitude/longitude
    }

    return filtered;
  }, [places, activeCategory, searchQuery, filters, placeRatings, getPlaceTags]);

  // Converter Place para formato do PlaceCardExpanded
  const placesForCards = useMemo(() => {
    return filteredPlaces.map((place) => {
      const placeTags = place.tags || getPlaceTags(place);
      const realRating = placeRatings[place.id] || place.rating;
      
      // Mapear tags para formato visual com cores
      const tagColors: Record<string, string> = {
        'vegano': '#10b981', // Verde
        'aceita-pets': '#f59e0b', // Laranja
        'acessivel': '#3b82f6', // Azul
        'drag-shows': '#ec4899', // Rosa
        'wifi-gratis': '#8b5cf6', // Roxo
        'estacionamento': '#6366f1', // Índigo
        'musica-ao-vivo': '#ef4444', // Vermelho
        'ar-livre': '#22c55e', // Verde claro
      };
      
      const tagLabels: Record<string, string> = {
        'vegano': 'Vegano',
        'aceita-pets': 'Aceita Pets',
        'acessivel': 'Acessível',
        'drag-shows': 'Drag Shows',
        'wifi-gratis': 'Wifi Grátis',
        'estacionamento': 'Estacionamento',
        'musica-ao-vivo': 'Música ao Vivo',
        'ar-livre': 'Ar Livre',
      };

      const visualTags = [
        { label: place.category, color: '#932d6f' }, // Categoria sempre aparece
        ...placeTags.slice(0, 3).map(tag => ({ // Limitar a 3 tags adicionais para não sobrecarregar
          label: tagLabels[tag] || tag,
          color: tagColors[tag] || '#932d6f',
        })),
      ];

      return {
        id: place.id,
        name: place.name,
        description: place.description || 'Sem descrição',
        rating: realRating,
        reviewCount: place.reviewCount || 0,
        distance: place.distance || 'N/A',
        address: place.address || 'Endereço não informado',
        imageUrl: place.imageUrl || place.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
        tags: visualTags,
        isSafe: place.isSafe ?? true,
        lat: place.latitude,
        lng: place.longitude,
      };
    });
  }, [filteredPlaces, placeRatings, getPlaceTags]);

  const handleApplyFilters = () => {
    // Filtros já estão sendo aplicados automaticamente via useFilterPreferences
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    updateFilters(newFilters);
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
        onFiltersChange={handleFiltersChange}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}