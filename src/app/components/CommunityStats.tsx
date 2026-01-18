import { Users, MessageCircle, TrendingUp } from 'lucide-react';

interface CommunityStatsProps {
  members: number;
  posts: number;
  activeToday: number;
}

export function CommunityStats({ members, posts, activeToday }: CommunityStatsProps) {
  return (
    <div className="flex gap-3 px-5 mb-4">
      {/* Membros */}
      <div className="flex-1 bg-[#932d6f] rounded-xl p-3 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-4 h-4" />
          <span className="text-xs font-medium">Membros</span>
        </div>
        <p className="text-lg font-bold">{members.toLocaleString()}</p>
      </div>

      {/* Posts */}
      <div className="flex-1 bg-[#FF6B7A] rounded-xl p-3 text-white">
        <div className="flex items-center gap-2 mb-1">
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Posts</span>
        </div>
        <p className="text-lg font-bold">{posts.toLocaleString()}</p>
      </div>

      {/* Ativas hoje */}
      <div className="flex-1 bg-gradient-to-br from-[#932d6f] to-[#FF6B7A] rounded-xl p-3 text-white">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs font-medium">Ativas hoje</span>
        </div>
        <p className="text-lg font-bold">{activeToday}</p>
      </div>
    </div>
  );
}