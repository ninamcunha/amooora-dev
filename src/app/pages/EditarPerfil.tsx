import { useState } from 'react';
import { ArrowLeft, Camera, User, AtSign, MapPin, Heart, AlignLeft, Lock } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface EditarPerfilProps {
  onNavigate: (page: string) => void;
}

export function EditarPerfil({ onNavigate }: EditarPerfilProps) {
  const [formData, setFormData] = useState({
    nome: 'Ana Paula',
    username: 'anapaula',
    pronomes: 'ela/dela',
    cidade: 'São Paulo, SP',
    bio: 'Apaixonada por café, cultura e boas conversas. Ativista pelos direitos LGBTQIA+. 🌈',
    interesses: ['Música', 'Arte', 'Viagens', 'Fotografia'],
    tipoDeRelacionamento: 'Amizades e networking',
    privacidade: 'publica',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const interessesDisponiveis = [
    'Música',
    'Arte',
    'Viagens',
    'Fotografia',
    'Literatura',
    'Gastronomia',
    'Esportes',
    'Natureza',
    'Cinema',
    'Moda',
    'Tecnologia',
    'Ativismo',
  ];

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleInteresse = (interesse: string) => {
    const novosInteresses = formData.interesses.includes(interesse)
      ? formData.interesses.filter((i) => i !== interesse)
      : [...formData.interesses, interesse];
    setFormData({ ...formData, interesses: novosInteresses });
  };

  const handleSalvar = () => {
    // Aqui você implementaria a lógica de salvar
    console.log('Dados salvos:', formData);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onNavigate('profile');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl pb-6">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-border">
          <div className="px-5 py-4 flex items-center justify-between">
            <button
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-semibold text-lg text-primary">Editar Perfil</h1>
            <button
              onClick={handleSalvar}
              className="px-4 py-2 bg-secondary text-white rounded-full font-medium text-sm hover:bg-secondary/90 transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="px-5 py-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZyaWVuZHMlMjBncm91cCUyMGhhcHB5fGVufDF8fHx8MTc2NzgzNDM1MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Foto de perfil</p>
              <button className="text-sm text-secondary font-medium hover:text-secondary/80 transition-colors">
                Alterar foto
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-5 py-6 space-y-6">
          {/* Nome */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 text-primary" />
              Nome
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
              placeholder="Seu nome"
            />
          </div>

          {/* Username */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <AtSign className="w-4 h-4 text-primary" />
              Nome de usuário
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
              placeholder="@seunome"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Seu nome de usuário único na Amooora
            </p>
          </div>

          {/* Pronomes */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Heart className="w-4 h-4 text-primary" />
              Pronomes
            </label>
            <select
              value={formData.pronomes}
              onChange={(e) => handleChange('pronomes', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors appearance-none"
            >
              <option value="ela/dela">Ela/Dela</option>
              <option value="ele/dele">Ele/Dele</option>
              <option value="elu/delu">Elu/Delu</option>
              <option value="qualquer">Qualquer pronome</option>
              <option value="preferir-nao-informar">Prefiro não informar</option>
            </select>
          </div>

          {/* Cidade */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              Cidade
            </label>
            <input
              type="text"
              value={formData.cidade}
              onChange={(e) => handleChange('cidade', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors"
              placeholder="Sua cidade"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <AlignLeft className="w-4 h-4 text-primary" />
              Sobre você
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors resize-none"
              rows={4}
              placeholder="Conte um pouco sobre você..."
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {formData.bio.length}/200
            </p>
          </div>

          {/* Interesses */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Heart className="w-4 h-4 text-primary" />
              Interesses
            </label>
            <div className="flex flex-wrap gap-2">
              {interessesDisponiveis.map((interesse) => {
                const isSelected = formData.interesses.includes(interesse);
                return (
                  <button
                    key={interesse}
                    onClick={() => toggleInteresse(interesse)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-secondary text-white'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {interesse}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Selecione seus interesses para conectar com pessoas afins
            </p>
          </div>

          {/* Tipo de relacionamento buscado */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Heart className="w-4 h-4 text-primary" />
              O que você busca?
            </label>
            <select
              value={formData.tipoDeRelacionamento}
              onChange={(e) => handleChange('tipoDeRelacionamento', e.target.value)}
              className="w-full px-4 py-3 bg-muted rounded-xl border border-transparent focus:border-secondary focus:outline-none transition-colors appearance-none"
            >
              <option value="amizades">Amizades</option>
              <option value="networking">Networking profissional</option>
              <option value="amizades-networking">Amizades e networking</option>
              <option value="relacionamento">Relacionamento romântico</option>
              <option value="tudo">Aberta a tudo</option>
            </select>
          </div>

          {/* Privacidade */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Lock className="w-4 h-4 text-primary" />
              Privacidade do perfil
            </label>
            <div className="space-y-2">
              <button
                onClick={() => handleChange('privacidade', 'publica')}
                className={`w-full px-4 py-3 rounded-xl text-left transition-colors ${
                  formData.privacidade === 'publica'
                    ? 'bg-secondary text-white font-medium'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <p className="font-medium text-sm">Pública</p>
                <p className="text-xs opacity-80 mt-1">
                  Qualquer pessoa pode ver seu perfil
                </p>
              </button>
              <button
                onClick={() => handleChange('privacidade', 'privada')}
                className={`w-full px-4 py-3 rounded-xl text-left transition-colors ${
                  formData.privacidade === 'privada'
                    ? 'bg-secondary text-white font-medium'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                <p className="font-medium text-sm">Privada</p>
                <p className="text-xs opacity-80 mt-1">
                  Apenas membros conectados podem ver seu perfil
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-6 py-3 rounded-full shadow-lg animate-in slide-in-from-top z-50">
            ✓ Perfil atualizado com sucesso!
          </div>
        )}
      </div>
    </div>
  );
}
