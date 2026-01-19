import { ArrowLeft, UserPlus, MapPin, Calendar, Scissors } from 'lucide-react';

interface AdminProps {
  onNavigate: (page: string) => void;
}

export function Admin({ onNavigate }: AdminProps) {
  const adminMenuItems = [
    {
      id: 'admin-cadastrar-usuario',
      title: 'Cadastrar Usuário',
      description: 'Criar novo usuário no sistema',
      icon: UserPlus,
      color: 'bg-[#932d6f]',
    },
    {
      id: 'admin-cadastrar-local',
      title: 'Cadastrar Local',
      description: 'Adicionar novo local seguro ao sistema',
      icon: MapPin,
      color: 'bg-blue-500',
    },
    {
      id: 'admin-cadastrar-servico',
      title: 'Cadastrar Serviço',
      description: 'Adicionar novo serviço ao catálogo',
      icon: Scissors,
      color: 'bg-green-500',
    },
    {
      id: 'admin-cadastrar-evento',
      title: 'Cadastrar Evento',
      description: 'Criar novo evento na plataforma',
      icon: Calendar,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={() => onNavigate('home')}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-primary">
            Painel Administrativo
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="px-5 py-6 space-y-4">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Área temporária de administração
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {adminMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="w-full p-4 bg-white border border-border rounded-xl hover:bg-muted transition-colors flex items-start gap-4 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Warning */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              ⚠️ Esta é uma área temporária de administração. A autenticação e permissões serão implementadas em breve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
