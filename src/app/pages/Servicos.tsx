import { useState } from 'react';
import { Search, MapPin, Star, Plus } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

const categories = ['Todos', 'Costura', 'Marcenaria', 'Pintura', 'Reparos', 'Bem-estar', 'Beleza', 'Outros'];

const mockServices = [
  {
    id: '1',
    title: 'Costureira Profissional',
    name: 'Ana Paula Santos',
    description: 'Conserto de roupas, ajustes, customizações e criação de peças sob medida. Atendimento personalizado e cuidadoso.',
    location: 'Vila Madalena, São Paulo',
    rating: 4.9,
    reviews: 127,
    price: 'A partir de R$ 50',
    category: 'Costura',
    isHighlight: true,
    imageUrl: 'https://images.unsplash.com/photo-1753162659622-371949a713ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNld2luZyUyMHRhaWxvcnxlbnwxfHx8fDE3Njc4OTkyODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    title: 'Marceneira & Restauração',
    name: 'Juliana Oliveira',
    description: 'Móveis planejados, restauração de móveis antigos e trabalhos em madeira. Projetos personalizados para seu espaço.',
    location: 'Pinheiros, São Paulo',
    rating: 5.0,
    reviews: 89,
    price: 'A partir de R$ 200',
    category: 'Marcenaria',
    isHighlight: false,
    imageUrl: 'https://images.unsplash.com/photo-1754747197676-478943a4a185?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNhcnBlbnRlciUyMHdvb2R3b3JrfGVufDF8fHx8MTc2Nzg5OTI4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    title: 'Pintora Residencial',
    name: 'Camila Ferreira',
    description: 'Pintura de ambientes internos e externos, texturas decorativas e acabamentos especiais com qualidade.',
    location: 'Moema, São Paulo',
    rating: 4.8,
    reviews: 64,
    price: 'R$ 80/m²',
    category: 'Pintura',
    isHighlight: false,
    imageUrl: 'https://images.unsplash.com/photo-1635098996137-5d96d2df90b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBhaW50ZXIlMjBwYWludGluZ3xlbnwxfHx8fDE3Njc4OTkyODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    title: 'Faz Tudo & Reparos',
    name: 'Roberta Lima',
    description: 'Instalações elétricas básicas, consertos domésticos, montagem de móveis e pequenos reparos em geral.',
    location: 'Perdizes, São Paulo',
    rating: 4.7,
    reviews: 93,
    price: 'A partir de R$ 100',
    category: 'Reparos',
    isHighlight: false,
    imageUrl: 'https://images.unsplash.com/photo-1602052793312-b99c2a9ee797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhhbmR5bWFuJTIwdG9vbHN8ZW58MXx8fHwxNzY3ODk5MjgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '5',
    title: 'Massoterapia & Bem-estar',
    name: 'Fernanda Costa',
    description: 'Massagens terapêuticas, relaxantes e drenagem linfática. Atendimento em domicílio ou no consultório.',
    location: 'Jardins, São Paulo',
    rating: 4.9,
    reviews: 156,
    price: 'R$ 120/sessão',
    category: 'Bem-estar',
    isHighlight: true,
    imageUrl: 'https://images.unsplash.com/photo-1598901986949-f593ff2a31a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwdGhlcmFweSUyMHdlbGxuZXNzfGVufDF8fHx8MTc2Nzg2MDIyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '6',
    title: 'Cabeleireira & Colorista',
    name: 'Patricia Mendes',
    description: 'Cortes modernos, coloração, mechas, hidratação e tratamentos capilares. Atendimento afirmativo e acolhedor.',
    location: 'Centro, São Paulo',
    rating: 5.0,
    reviews: 201,
    price: 'A partir de R$ 80',
    category: 'Beleza',
    isHighlight: false,
    imageUrl: 'https://images.unsplash.com/photo-1493775379751-a6c3940f3cbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGhhaXJkcmVzc2VyJTIwc2Fsb258ZW58MXx8fHwxNzY3ODk5Mjg0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

interface ServicosProps {
  onNavigate: (page: string) => void;
}

export function Servicos({ onNavigate }: ServicosProps) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

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

          {/* Services/Events List */}
          <div className="px-5 space-y-4 pb-6">
            {mockServices.map((service) => (
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
            ))}
          </div>
        </div>

        {/* Bottom Navigation fixo */}
        <BottomNav activeItem="services" onItemClick={onNavigate} />
      </div>
    </div>
  );
}