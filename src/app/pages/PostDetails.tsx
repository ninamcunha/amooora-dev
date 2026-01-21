import { useState } from 'react';
import { Heart, MessageCircle, Send, MoreVertical } from 'lucide-react';
import { Header } from '../components/Header';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Tag } from '../components/Tag';
import { useAdmin } from '../hooks/useAdmin';

interface Comment {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
  replies?: Comment[];
  isLiked?: boolean;
}

interface PostDetailsProps {
  postId: string;
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

// Dados mockados do post
const mockPost = {
  id: '1',
  author: {
    name: 'Maria Santos',
    avatarUrl: 'https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY3Nzg5MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  timeAgo: '2h atrás',
  title: 'Lugares seguros para viajar sozinha?',
  description: 'Estou planejando uma viagem para o nordeste e gostaria de dicas de lugares acolhedores e seguros. Alguém tem recomendações de cidades, bairros ou estabelecimentos que sejam LGBTQIA+ friendly? Preciso de lugares onde me sinta confortável e segura.',
  category: {
    label: 'Dicas',
    color: '#FF6B7A',
  },
  likes: 46,
  replies: 23,
};

// Comentários mockados
const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Ana Costa',
      avatarUrl: 'https://images.unsplash.com/photo-1650784854945-264d5b0b6b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwd29tYW4lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY3ODM0MTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    content: 'Olha, eu já viajei bastante pelo nordeste e posso recomendar alguns lugares incríveis! Em Recife, o bairro de Boa Viagem é super seguro e tem vários lugares LGBTQIA+ friendly. Também recomendo Olinda, que é linda e acolhedora.',
    timeAgo: '1h atrás',
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Maria Santos',
          avatarUrl: mockPost.author.avatarUrl,
        },
        content: 'Obrigada pela dica! Vou pesquisar sobre Boa Viagem.',
        timeAgo: '30min atrás',
        likes: 3,
        isLiked: false,
      },
    ],
  },
  {
    id: '2',
    author: {
      name: 'Julia Ferreira',
      avatarUrl: 'https://images.unsplash.com/photo-1617931928012-3d65dcfffee2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbmElMjB3b21hbiUyMGhhcHB5fGVufDF8fHwxNzY3ODM0MTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    content: 'Salvador também é uma ótima opção! O Pelourinho e o Rio Vermelho são bairros muito seguros e com uma cena LGBTQIA+ bem ativa. Tem vários hostels e pousadas que são super acolhedores.',
    timeAgo: '45min atrás',
    likes: 8,
    isLiked: false,
  },
  {
    id: '3',
    author: {
      name: 'Camila Souza',
      avatarUrl: 'https://images.unsplash.com/photo-1589553009868-c7b2bb474531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NzU0NDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    content: 'Eu recomendo muito Fortaleza! A Praia de Iracema tem uma vibe incrível e é super segura. Tem vários bares e restaurantes LGBTQIA+ friendly. Fiquei hospedada no Hotel Iracema e foi perfeito!',
    timeAgo: '30min atrás',
    likes: 15,
    isLiked: true,
  },
];

export function PostDetails({ postId, onNavigate, onBack }: PostDetailsProps) {
  const { isAdmin } = useAdmin();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(mockPost.likes);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleCommentLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      // Verificar também nas respostas
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => 
            reply.id === commentId
              ? {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                }
              : reply
          ),
        };
      }
      return comment;
    }));
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `new-${Date.now()}`,
      author: {
        name: 'Você',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      content: newComment,
      timeAgo: 'Agora',
      likes: 0,
      isLiked: false,
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleSendReply = (commentId: string) => {
    if (!replyText.trim()) return;

    const reply: Comment = {
      id: `reply-${Date.now()}`,
      author: {
        name: 'Você',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      content: replyText,
      timeAgo: 'Agora',
      likes: 0,
      isLiked: false,
    };

    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        };
      }
      return comment;
    }));

    setReplyText('');
    setReplyingTo(null);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={isReply ? 'ml-12 mt-3' : ''}>
      <div className="flex items-start gap-3">
        <ImageWithFallback
          src={comment.author.avatarUrl}
          alt={comment.author.name}
          className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-sm text-foreground">{comment.author.name}</p>
            <p className="text-xs text-muted-foreground">{comment.timeAgo}</p>
          </div>
          <p className="text-sm text-foreground mb-2">{comment.content}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleCommentLike(comment.id)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${comment.isLiked ? 'fill-accent text-accent' : ''}`}
              />
              <span className="text-xs">{comment.likes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors text-xs"
              >
                Responder
              </button>
            )}
          </div>
          {/* Campo de resposta */}
          {replyingTo === comment.id && !isReply && (
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escreva uma resposta..."
                className="flex-1 px-3 py-2 text-sm bg-muted rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendReply(comment.id);
                  }
                }}
              />
              <button
                onClick={() => handleSendReply(comment.id)}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Enviar
              </button>
            </div>
          )}
          {/* Respostas aninhadas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex flex-col">
        {/* Header fixo */}
        <Header onNavigate={onNavigate} isAdmin={isAdmin} showBackButton onBack={onBack} />
        
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto pb-32">
          {/* Post Principal */}
          <div className="bg-white rounded-2xl mx-5 mt-6 p-4 shadow-sm border border-border/50">
            {/* Header: Avatar, nome e badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <ImageWithFallback
                  src={mockPost.author.avatarUrl}
                  alt={mockPost.author.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{mockPost.author.name}</p>
                  <p className="text-xs text-muted-foreground">{mockPost.timeAgo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tag color={mockPost.category.color}>{mockPost.category.label}</Tag>
                <button className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Título */}
            <h1 className="font-semibold text-lg text-primary mb-3">{mockPost.title}</h1>

            {/* Descrição completa */}
            <p className="text-sm text-foreground mb-4 leading-relaxed">{mockPost.description}</p>

            {/* Footer: Likes e respostas */}
            <div className="flex items-center gap-6 pt-4 border-t border-border">
              <button
                onClick={handleLike}
                className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? 'fill-accent text-accent' : ''}`}
                />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{mockPost.replies} respostas</span>
              </div>
            </div>
          </div>

          {/* Lista de Comentários */}
          <div className="px-5 mt-6">
            <h2 className="font-semibold text-foreground mb-4">
              {comments.length} {comments.length === 1 ? 'resposta' : 'respostas'}
            </h2>
            
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>

        {/* Campo de Comentário Fixo */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Seu avatar"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 px-4 py-2 bg-muted rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendComment();
                }
              }}
            />
            <button
              onClick={handleSendComment}
              disabled={!newComment.trim()}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
