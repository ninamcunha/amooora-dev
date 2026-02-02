import { X } from 'lucide-react';

export interface FilterOptions {
  distance: string;
  rating: string;
  tags: string[]; // Array de tags selecionadas
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApply: () => void;
  onClear: () => void;
  eventTags?: boolean; // Se true, usa tags de eventos ao invés de tags de locais
}

const distanceOptions = [
  { label: 'Até 1 km', value: '1' },
  { label: 'Até 3 km', value: '3' },
  { label: 'Até 5 km', value: '5' },
  { label: 'Até 10 km', value: '10' },
  { label: 'Qualquer distância', value: 'any' },
];

const ratingOptions = [
  { label: '4.5+ estrelas', value: '4.5' },
  { label: '4.0+ estrelas', value: '4.0' },
  { label: '3.5+ estrelas', value: '3.5' },
  { label: 'Qualquer avaliação', value: 'any' },
];

const availableTags = [
  { label: 'Vegano', value: 'vegano', icon: '🌱' },
  { label: 'Aceita Pets', value: 'aceita-pets', icon: '🐾' },
  { label: 'Acessível', value: 'acessivel', icon: '♿' },
  { label: 'Drag Shows', value: 'drag-shows', icon: '🎭' },
  { label: 'Wifi Grátis', value: 'wifi-gratis', icon: '📶' },
  { label: 'Estacionamento', value: 'estacionamento', icon: '🅿️' },
  { label: 'Música ao Vivo', value: 'musica-ao-vivo', icon: '🎵' },
  { label: 'Ar Livre', value: 'ar-livre', icon: '🌳' },
];

const eventTags = [
  { label: 'Gratuito', value: 'gratuito', icon: '🆓' },
  { label: 'Ar Livre', value: 'ar-livre', icon: '🌳' },
  { label: 'Música', value: 'musica', icon: '🎵' },
  { label: 'Workshop', value: 'workshop', icon: '🎓' },
  { label: 'Networking', value: 'networking', icon: '🤝' },
  { label: 'Cultural', value: 'cultural', icon: '🎭' },
  { label: 'Esportivo', value: 'esportivo', icon: '⚽' },
  { label: 'Festa', value: 'festa', icon: '🎉' },
  { label: 'Gastronomia', value: 'gastronomia', icon: '🍽️' },
  { label: 'Arte', value: 'arte', icon: '🎨' },
];

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
  eventTags = false,
}: FilterModalProps) {
  if (!isOpen) return null;

  // Escolher tags baseado no tipo (eventos ou locais)
  const tagsToUse = eventTags ? eventTags : availableTags;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-w-md mx-auto shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-lg text-primary">Filtros</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-6 max-h-[70vh] overflow-y-auto">
          {/* Distance */}
          <div className="mb-6">
            <h3 className="font-semibold text-base text-foreground mb-3">
              Distância
            </h3>
            <div className="flex flex-wrap gap-2">
              {distanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onFiltersChange({ ...filters, distance: option.value })
                  }
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    filters.distance === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-foreground hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-semibold text-base text-foreground mb-3">
              Avaliação
            </h3>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onFiltersChange({ ...filters, rating: option.value })
                  }
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    filters.rating === option.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-foreground hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <h3 className="font-semibold text-base text-foreground mb-3">
              Tags e Características
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagsToUse.map((tag) => {
                const isSelected = filters.tags?.includes(tag.value) || false;
                return (
                  <button
                    key={tag.value}
                    onClick={() => {
                      const currentTags = filters.tags || [];
                      const newTags = isSelected
                        ? currentTags.filter((t) => t !== tag.value)
                        : [...currentTags, tag.value];
                      onFiltersChange({ ...filters, tags: newTags });
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                      isSelected
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-foreground hover:bg-gray-200'
                    }`}
                  >
                    <span>{tag.icon}</span>
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClear}
            className="flex-1 px-6 py-3 rounded-full font-medium text-primary bg-white border-2 border-primary hover:bg-primary/5 transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-6 py-3 rounded-full font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  );
}
