import { X } from 'lucide-react';

export interface FilterOptions {
  distance: string;
  rating: string;
  amenities: string[];
  accessibility: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onApply: () => void;
  onClear: () => void;
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

const amenitiesOptions = [
  { label: 'Wi-Fi', value: 'wifi' },
  { label: 'Pet-friendly', value: 'pet' },
  { label: 'Vegano', value: 'vegan' },
  { label: 'Estacionamento', value: 'parking' },
  { label: 'Ao ar livre', value: 'outdoor' },
];

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: FilterModalProps) {
  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onFiltersChange({ ...filters, amenities: newAmenities });
  };

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
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-lg text-primary">Filtros</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-6 max-h-[70vh] overflow-y-auto">
          {/* Distance */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Distância
            </h3>
            <div className="space-y-2">
              {distanceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onFiltersChange({ ...filters, distance: option.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl text-sm text-left transition-colors ${
                    filters.distance === option.value
                      ? 'bg-secondary text-white font-medium'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Avaliação
            </h3>
            <div className="space-y-2">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    onFiltersChange({ ...filters, rating: option.value })
                  }
                  className={`w-full px-4 py-3 rounded-xl text-sm text-left transition-colors ${
                    filters.rating === option.value
                      ? 'bg-secondary text-white font-medium'
                      : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Comodidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {amenitiesOptions.map((option) => {
                const isSelected = filters.amenities.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleAmenity(option.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-secondary text-white'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Accessibility */}
          <div className="mb-4">
            <label className="flex items-center justify-between p-4 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors">
              <span className="font-medium text-sm text-foreground">
                Apenas lugares acessíveis
              </span>
              <input
                type="checkbox"
                checked={filters.accessibility}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    accessibility: e.target.checked,
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-secondary transition-colors peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:right-[22px] peer-checked:after:right-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform"></div>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-border flex gap-3">
          <button
            onClick={onClear}
            className="flex-1 px-6 py-3 rounded-full font-medium text-secondary bg-white border-2 border-secondary hover:bg-secondary/5 transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={onApply}
            className="flex-1 px-6 py-3 rounded-full font-medium text-white bg-secondary hover:bg-secondary/90 transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  );
}
