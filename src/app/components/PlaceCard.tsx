import { Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './Badge';
import { Rating } from './Rating';

interface PlaceCardProps {
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  distance: string;
  imageUrl: string;
  isSafe?: boolean;
  onClick?: () => void;
}

export function PlaceCard({ 
  name, 
  category, 
  rating, 
  reviewCount, 
  distance, 
  imageUrl, 
  isSafe = true,
  onClick
}: PlaceCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-border/50 hover:shadow-md transition-shadow mb-3 cursor-pointer"
    >
      <div className="flex gap-3 p-3">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
          <ImageWithFallback 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground line-clamp-1 flex-1">{name}</h3>
            {isSafe && <Badge variant="primary">Seguro</Badge>}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{category}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span className="text-xs text-foreground font-medium">{rating}</span>
                <span className="text-xs text-muted-foreground">({reviewCount})</span>
              </div>
              <span className="text-xs text-muted-foreground">• {distance}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}