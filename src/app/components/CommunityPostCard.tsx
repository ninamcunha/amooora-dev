import { Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tag } from './Tag';

interface CommunityPostCardProps {
  author: {
    name: string;
    avatarUrl: string;
  };
  timeAgo: string;
  title: string;
  description: string;
  category: {
    label: string;
    color: string;
  };
  likes: number;
  replies: number;
  isTrending?: boolean;
}

export function CommunityPostCard({
  author,
  timeAgo,
  title,
  description,
  category,
  likes,
  replies,
  isTrending = false,
}: CommunityPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
      {/* Header: Avatar, nome e badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <ImageWithFallback
            src={author.avatarUrl}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-foreground">{author.name}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        <Tag color={category.color}>{category.label}</Tag>
      </div>

      {/* Título com ícone trending */}
      <div className="flex items-start gap-2 mb-2">
        <h3 className="font-semibold text-base text-primary flex-1">{title}</h3>
        {isTrending && <TrendingUp className="w-4 h-4 text-accent flex-shrink-0 mt-1" />}
      </div>

      {/* Descrição */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

      {/* Footer: Likes e respostas */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isLiked ? 'fill-accent text-accent' : ''}`}
          />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>
        <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{replies} respostas</span>
        </button>
      </div>
    </div>
  );
}
