import { useState } from 'react';
import { ArrowLeft, Mail, Lock, User, Heart, Eye, EyeOff, CheckCircle } from 'lucide-react';
import logoAmooora from "../../assets/5a07ef013ecd4a0869fe2fae41fafe9f484c2b89.png";

interface CadastroProps {
  onNavigate: (page: string) => void;
}

export function Cadastro({ onNavigate }: CadastroProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    pronomes: '',
    aceitaTermos: false,
    maiorIdade: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    // Limpa erro do campo ao digitar
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
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

  const handleCadastrar = () => {
    if (validateStep2()) {
      console.log('Dados do cadastro:', formData);
      // Aqui você implementaria a lógica de cadastro
      // Por enquanto, vamos direto para o home
      onNavigate('home');
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

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white border-2 border-secondary text-secondary py-4 px-6 rounded-full font-semibold hover:bg-secondary/5 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={handleCadastrar}
                className="flex-1 bg-secondary text-white py-4 px-6 rounded-full font-semibold hover:bg-secondary/90 transition-colors"
              >
                Criar Conta
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
