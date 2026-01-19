import { useState, useMemo } from 'react';
import { Search, MapPin, Star, Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { useServices } from '../hooks/useServices';

const categories = ['Todos', 'Costura', 'Marcenaria', 'Pintura', 'Reparos', 'Bem-estar', 'Beleza', 'Outros'];

interface ServicosProps {
  onNavigate: (page: string) => void;
}

export function Servicos({ onNavigate }: ServicosProps) {
  const { services, loading, error } = useServices();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Filtrar serviços por categoria e busca
  const filteredServices = useMemo(() => {
    let filtered = services;

    // Filtro por categoria
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter((service) => service.category === activeCategory);
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(query) ||
          service.description?.toLowerCase().includes(query) ||
          service.provider?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [services, activeCategory, searchTerm]);

  // Converter Service para formato do card
  const servicesForCards = useMemo(() => {
    return filteredServices.map((service) => ({
      id: service.id,
      title: service.name,
      name: service.provider || 'Prestador não informado',
      description: service.description || 'Sem descrição',
      location: 'Localização não informada',
      rating: service.rating || 0,
      reviews: 0, // Será implementado quando houver reviews
      price: service.price ? `R$ ${service.price.toFixed(2)}` : 'A consultar',
      category: service.category,
      isHighlight: false,
      imageUrl: service.imageUrl || service.image || 'https://via.placeholder.com/400x300?text=Sem+Imagem',
    }));
  }, [filteredServices]);

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* Header Section */}
          <div className="px-5 pt-6 pb-4 bg-white">
            <div className="text-center mb-4">
              <h1 className="text-xl font-semibold text-primary mb-2">Precisa de um serviço?</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Encontre profissionais qualificadas da comunidade! Conectamos você com quem faz acontecer: costureiras, marceneiras, pintoras e muito mais. Seguro, acolhedor e feito pra nós.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Location Input */}
            <div className="relative mb-3">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Sua localização..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'bg-background text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Create Service Button */}
            <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Oferecer Serviço
            </button>
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

          {/* Services/Events List */}
          {!loading && !error && (
            <div className="px-5 space-y-4 pb-6">
              {servicesForCards.length > 0 ? (
                servicesForCards.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border-2 border-primary/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header with Gradient */}
                <div className="relative h-48 overflow-hidden">
                  {service.isHighlight && (
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full z-10 shadow-md">
                      <span className="text-xs font-semibold text-primary">Destaque</span>
                    </div>
                  )}
                  <img 
                    src={service.imageUrl} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.title}</h3>
                  
                  {/* Category Badge */}
                  <div className="inline-block mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
                      {service.category}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span>{service.rating} ({service.reviews} avaliações)</span>
                    </div>
                  </div>

                  {/* Organizer and Price */}
                  <div className="flex items-center justify-between mb-4 pt-3 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      Por: {service.name}
                    </span>
                    <span className="text-lg font-bold text-primary">{service.price}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onNavigate('service-details')}
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-shadow"
                    >
                      Ver Detalhes
                    </button>
                    <button className="px-6 py-3 rounded-full border-2 border-primary text-primary font-medium hover:bg-primary/5 transition-colors">
                      Contato
                    </button>
                  </div>
                </div>
              </div>
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