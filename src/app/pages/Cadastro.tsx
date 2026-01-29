import { useState, useRef } from 'react';
import { ArrowLeft, Mail, Lock, User, Heart, Eye, EyeOff, CheckCircle, AlertCircle, Camera, X } from 'lucide-react';
import logoAmooora from "../../assets/5a07ef013ecd4a0869fe2fae41fafe9f484c2b89.png";
import { signUp } from '../../lib/auth';
import { uploadImage } from '../services/storage';
import { ImageWithFallback } from '../shared/components';

interface CadastroProps {
  onNavigate: (page: string) => void;
}

export function Cadastro({ onNavigate }: CadastroProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    pronomes: '',
    aceitaTermos: false,
    maiorIdade: false,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Limpa erro do campo ao digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setAvatarError('Formato não suportado. Use JPG, PNG ou WEBP.');
      return;
    }

    // Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setAvatarError('Imagem muito grande. Tamanho máximo: 5MB.');
      return;
    }

    setAvatarError(null);
    setAvatarFile(file);

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Por favor, insira seu nome';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Por favor, insira seu e-mail';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Por favor, crie uma senha';
    } else if (formData.senha.length < 8) {
      newErrors.senha = 'A senha deve ter pelo menos 8 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Por favor, confirme sua senha';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.pronomes) {
      newErrors.pronomes = 'Por favor, selecione seus pronomes';
    }

    if (!formData.aceitaTermos) {
      newErrors.aceitaTermos = 'Você precisa aceitar os termos de uso';
    }

    if (!formData.maiorIdade) {
      newErrors.maiorIdade = 'Você precisa ser maior de 18 anos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinuar = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleCadastrar = async () => {
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setSubmitError(null);

    try {
      let avatarUrl: string | undefined = undefined;

      // Upload da foto de perfil se houver
      if (avatarFile) {
        const uploadResult = await uploadImage(avatarFile, 'avatars');
        if (uploadResult.error) {
          setSubmitError(`Erro ao fazer upload da foto: ${uploadResult.error}`);
          setIsLoading(false);
          return;
        }
        avatarUrl = uploadResult.url;
      }

      // Chama a função de signUp do Supabase
      const result = await signUp({
        email: formData.email,
        password: formData.senha,
        name: formData.nome,
        pronouns: formData.pronomes || undefined,
        avatar: avatarUrl,
      });

      if (result.error) {
        setSubmitError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.user) {
        // Cadastro realizado com sucesso!
        console.log('Usuário criado com sucesso:', result.user);
        // Navega para a página inicial
        onNavigate('home');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setSubmitError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-border">
          <button
            onClick={() => step === 1 ? onNavigate('welcome') : setStep(1)}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-semibold text-lg text-primary">
            {step === 1 ? 'Criar Conta' : 'Sobre Você'}
          </h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Progress Indicator */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-1 rounded-full transition-colors ${
              step >= 1 ? 'bg-secondary' : 'bg-muted'
            }`} />
            <div className={`flex-1 h-1 rounded-full transition-colors ${
              step >= 2 ? 'bg-secondary' : 'bg-muted'
            }`} />
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Passo {step} de 2
          </p>
        </div>

        {/* Logo Small */}
        <div className="px-5 pb-6 flex justify-center">
          <img
            src={logoAmooora}
            alt="Amooora"
            className="w-32"
          />
        </div>

        {/* Step 1: Dados Básicos */}
        {step === 1 && (
          <div className="px-5 pb-6 space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-primary mb-2">
                Bem-vinda à Amooora! 💜
              </h2>
              <p className="text-sm text-muted-foreground">
                Vamos criar sua conta em poucos passos
              </p>
            </div>

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
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.nome ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors`}
                placeholder="Seu nome completo"
              />
              {errors.nome && (
                <p className="text-xs text-red-500 mt-1">{errors.nome}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4 text-primary" />
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors`}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Senha */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 text-primary" />
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.senha}
                  onChange={(e) => handleChange('senha', e.target.value)}
                  className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                    errors.senha ? 'border-red-500' : 'border-transparent'
                  } focus:border-secondary focus:outline-none transition-colors pr-12`}
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.senha && (
                <p className="text-xs text-red-500 mt-1">{errors.senha}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Lock className="w-4 h-4 text-primary" />
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmarSenha}
                  onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                  className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                    errors.confirmarSenha ? 'border-red-500' : 'border-transparent'
                  } focus:border-secondary focus:outline-none transition-colors pr-12`}
                  placeholder="Digite sua senha novamente"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmarSenha}</p>
              )}
            </div>

            {/* Botão Continuar */}
            <button
              onClick={handleContinuar}
              className="w-full bg-secondary text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-secondary/90 transition-colors mt-6"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Informações Adicionais */}
        {step === 2 && (
          <div className="px-5 pb-6 space-y-5">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-primary mb-2">
                Quase lá! 🌈
              </h2>
              <p className="text-sm text-muted-foreground">
                Queremos te conhecer melhor
              </p>
            </div>

            {/* Foto de Perfil */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Camera className="w-4 h-4 text-primary" />
                Foto de Perfil (opcional)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-muted border-2 border-gray-200 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleAvatarSelect}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="block px-4 py-2 bg-muted rounded-xl border border-transparent hover:border-secondary cursor-pointer transition-colors text-center text-sm font-medium"
                  >
                    {avatarPreview ? 'Alterar foto' : 'Escolher foto'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    JPG, PNG ou WEBP • Máx. 5MB
                  </p>
                </div>
              </div>
              {avatarError && (
                <p className="text-xs text-red-500 mt-1">{avatarError}</p>
              )}
            </div>

            {/* Pronomes */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Heart className="w-4 h-4 text-primary" />
                Como você se identifica?
              </label>
              <select
                value={formData.pronomes}
                onChange={(e) => handleChange('pronomes', e.target.value)}
                className={`w-full px-4 py-3 bg-muted rounded-xl border ${
                  errors.pronomes ? 'border-red-500' : 'border-transparent'
                } focus:border-secondary focus:outline-none transition-colors appearance-none`}
              >
                <option value="">Selecione seus pronomes</option>
                <option value="ela/dela">Ela/Dela</option>
                <option value="ele/dele">Ele/Dele</option>
                <option value="elu/delu">Elu/Delu</option>
                <option value="qualquer">Qualquer pronome</option>
                <option value="preferir-nao-informar">Prefiro não informar</option>
              </select>
              {errors.pronomes && (
                <p className="text-xs text-red-500 mt-1">{errors.pronomes}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Respeitamos todas as identidades e formas de se expressar
              </p>
            </div>

            {/* Maior de idade */}
            <div>
              <label className={`flex items-start gap-3 p-4 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors ${
                errors.maiorIdade ? 'border border-red-500' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={formData.maiorIdade}
                  onChange={(e) => handleChange('maiorIdade', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-secondary text-secondary focus:ring-secondary"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">
                    Confirmo que sou maior de 18 anos
                  </p>
                </div>
              </label>
              {errors.maiorIdade && (
                <p className="text-xs text-red-500 mt-1">{errors.maiorIdade}</p>
              )}
            </div>

            {/* Termos de uso */}
            <div>
              <label className={`flex items-start gap-3 p-4 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors ${
                errors.aceitaTermos ? 'border border-red-500' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={formData.aceitaTermos}
                  onChange={(e) => handleChange('aceitaTermos', e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-secondary text-secondary focus:ring-secondary"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm text-foreground">
                    Aceito os <span className="text-secondary">Termos de Uso</span> e a{' '}
                    <span className="text-secondary">Política de Privacidade</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A Amooora é um espaço seguro. Leia nossos termos para entender como protegemos sua privacidade.
                  </p>
                </div>
              </label>
              {errors.aceitaTermos && (
                <p className="text-xs text-red-500 mt-1">{errors.aceitaTermos}</p>
              )}
            </div>

            {/* Segurança Info */}
            <div className="bg-gradient-to-br from-[#F5EBFF] to-[#FFE5EA] p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-foreground mb-1">
                    Seu espaço seguro
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Na Amooora, você está em um ambiente feito por e para a comunidade sáfica, 
                    com foco em acolhimento, respeito e pertencimento.
                  </p>
                </div>
              </div>
            </div>

            {/* Mensagem de erro */}
            {submitError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800 mb-1">
                    Erro ao criar conta
                  </p>
                  <p className="text-xs text-red-600">{submitError}</p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setStep(1);
                  setSubmitError(null);
                }}
                disabled={isLoading}
                className="flex-1 bg-white border-2 border-secondary text-secondary py-4 px-6 rounded-full font-semibold hover:bg-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Voltar
              </button>
              <button
                onClick={handleCadastrar}
                disabled={isLoading}
                className="flex-1 bg-secondary text-white py-4 px-6 rounded-full font-semibold hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </div>
          </div>
        )}

        {/* Login link */}
        <div className="px-5 pb-8 text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <button
              onClick={() => onNavigate('welcome')}
              className="text-secondary font-medium hover:text-secondary/80 transition-colors"
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
