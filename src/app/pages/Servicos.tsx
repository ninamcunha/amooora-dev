import { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ServiceCardExpanded } from '../components/ServiceCardExpanded';
import { BottomNav } from '../components/BottomNav';
import { useServices } from '../hooks/useServices';
import { useAdmin } from '../hooks/useAdmin';

const categories = ['Todos', 'Costura', 'Marcenaria', 'Pintura', 'Reparos', 'Bem-estar', 'Beleza', 'Outros'];

interface ServicosProps {
  onNavigate: (page: string) => void;
}

export function Servicos({ onNavigate }: ServicosProps) {
  const { services, loading, error } = useServices();
  const { isAdmin } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  // Filtrar serviços por categoria e busca
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filtro por categoria
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter((service) => service.category === activeCategory);
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query) ||
          service.provider?.toLowerCase().includes(query) ||
          service.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [services, activeCategory, searchQuery]);

  // Converter Service para formato do ServiceCardExpanded
  const servicesForCards = useMemo(() => {
    return filteredServices.map((service) => ({
      id: service.id,
      name: service.name,
      description: service.description || 'Sem descrição',
      provider: service.provider || 'Prestador não informado',
      category: service.category,
      rating: service.rating || 0,
      reviewCount: 0, // Será implementado quando houver reviews
      price: service.price ? `R$ ${service.price.toFixed(2)}` : 'A consultar',
      imageUrl: service.imageUrl || service.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
    }));
  }, [filteredServices]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Page Header */}
          <div className="px-5 pt-6 pb-4">
            <h1 className="text-2xl font-semibold text-primary mb-4">Serviços</h1>
            
            {/* Search */}
            <div className="mb-4">
              <SearchBar
                placeholder="Buscar serviços..."
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
            <div className="px-5 py-12 text-center">
              <p className="text-muted-foreground">Carregando serviços...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-5 py-12 text-center">
              <p className="text-red-500">Erro ao carregar serviços: {error.message}</p>
            </div>
          )}

          {/* Services List */}
          {!loading && !error && (
            <div className="px-5 space-y-4 pb-6">
              {servicesForCards.length > 0 ? (
                servicesForCards.map((service) => (
                  <ServiceCardExpanded 
                    key={service.id} 
                    {...service} 
                    onClick={() => onNavigate(`service-details:${service.id}`)}
                  />
                ))
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Nenhum serviço encontrado</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="services" onItemClick={onNavigate} />
      </div>
    </div>
  );
}