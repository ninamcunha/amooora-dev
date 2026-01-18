import { Bell, UserPen, ArrowLeft } from 'lucide-react';
import logoAmooora from "figma:asset/2bcf17d7cfb76a60c14cf40243974d7d28fb3842.png";

interface HeaderProps {
  onNavigate?: (page: string) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function Header({ onNavigate, showBackButton, onBack }: HeaderProps) {
  return (
    <header className="px-5 py-4 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between">
        {/* Botão voltar à esquerda (se showBackButton) */}
        {showBackButton && (
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        {/* Logo sempre visível no centro/esquerda */}
        <div className={`flex-shrink-0 ${showBackButton ? 'flex-1 flex justify-center' : ''}`}>
          <img
            src={logoAmooora}
            alt="Amooora"
            className="h-[70px]"
          />
        </div>

        {/* Botões à direita */}
        <div className="flex items-center gap-2">
          {/* Botão de Notificação */}
          <button className="w-10 h-10 rounded-full bg-[#932d6f] flex items-center justify-center hover:bg-[#7d2660] transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </button>

          {/* Botão de Editar Perfil */}
          <button 
            onClick={() => onNavigate?.('profile')}
            className="w-10 h-10 rounded-full bg-[#FF6B7A] flex items-center justify-center hover:bg-[#ff5766] transition-colors"
          >
            <UserPen className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}