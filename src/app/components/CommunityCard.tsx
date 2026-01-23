import { Star, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface CommunityCardData {
  id: string;
  name: string;
  avatar: string;
  description?: string;
  membersCount?: number;
  postsCount?: number;
  rating?: number;
}

interface CommunityCardProps {
  community: CommunityCardData;
  onClick?: () => void;
}

export function CommunityCard({ community, onClick }: CommunityCardProps) {
  const { name, avatar, description, membersCount, rating } = community;
  
  // Formatar número de membros
  const formatMembers = (count?: number) => {
    if (!count) return '0 membros';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+ membros`;
    return `${count} membros`;
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-border/50 hover:shadow-md transition-shadow mb-4 cursor-pointer relative"
    >
      {/* Imagem de fundo */}
      <div className="relative h-56 overflow-hidden">
        <ImageWithFallback 
          src={avatar} 
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Overlay escuro para melhorar legibilidade do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        
        {/* Conteúdo sobre a imagem */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
          <div className="flex items-center gap-2 text-white">
            {rating !== undefined && (
              <>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-base font-semibold">{rating}</span>
              </>
            )}
            {membersCount !== undefined && (
              <>
                <span className="text-base">•</span>
                <span className="text-base">({formatMembers(membersCount)})</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Botão "Ver Comunidade" */}
      <div className="p-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="w-full px-4 py-3 bg-white border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <span>Ver Comunidade</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
