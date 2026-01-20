import { useState, useEffect, useRef } from 'react';

interface WelcomeProps {
  onNavigate: (page: string) => void;
}

export function Welcome({ onNavigate }: WelcomeProps) {
  const [gifFinished, setGifFinished] = useState(false);
  const [staticImageSrc, setStaticImageSrc] = useState<string | null>(null);
  const gifRef = useRef<HTMLImageElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const captureAttemptsRef = useRef(0);
  const gifSrc = "https://i.postimg.cc/jdQR89Wp/0108.gif";
  // Duração do GIF em milissegundos - ajuste conforme necessário (baseado na descrição: ~2-3 segundos)
  const GIF_DURATION = 3000;

  useEffect(() => {
    // Reseta tudo quando o componente monta
    setGifFinished(false);
    setStaticImageSrc(null);
    captureAttemptsRef.current = 0;

    // Limpa timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const img = gifRef.current;
    if (!img) return;

    // Força o GIF a reiniciar
    const timestamp = Date.now();
    img.src = `${gifSrc}?t=${timestamp}`;

    // Função para capturar o frame atual e substituir o GIF
    const captureAndReplace = () => {
      if (gifFinished) return;

      // IMPORTANTE: Captura o frame ANTES de remover o src
      const attemptCapture = (attempt = 0) => {
        if (attempt >= 3) {
          // Se falhou todas as tentativas, usa o próprio GIF como fallback estático
          setStaticImageSrc(gifSrc);
          setGifFinished(true);
          if (img) img.src = '';
          return;
        }

        try {
          if (!img || !img.complete || img.naturalWidth === 0) {
            // Aguarda um pouco e tenta novamente
            setTimeout(() => attemptCapture(attempt + 1), 150);
            return;
          }

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            setStaticImageSrc(gifSrc);
            setGifFinished(true);
            if (img) img.src = '';
            return;
          }

          const width = img.naturalWidth || 256;
          const height = img.naturalHeight || 213;
          
          canvas.width = width;
          canvas.height = height;
          
          // Desenha o frame atual do GIF (ainda animando)
          ctx.drawImage(img, 0, 0, width, height);
          
          // Converte para PNG
          const staticSrc = canvas.toDataURL('image/png');
          
          if (staticSrc && staticSrc !== 'data:,' && staticSrc.length > 100) {
            // Sucesso! Capturou o frame
            setStaticImageSrc(staticSrc);
            setGifFinished(true);
            // Agora remove o src do GIF para parar a animação
            if (img) img.src = '';
          } else {
            // Se a conversão falhar, tenta novamente
            setTimeout(() => attemptCapture(attempt + 1), 100);
          }
          
        } catch (error) {
          console.error('Erro ao capturar frame:', error);
          // Fallback: usa o próprio GIF
          if (attempt >= 2) {
            setStaticImageSrc(gifSrc);
            setGifFinished(true);
            if (img) img.src = '';
          } else {
            setTimeout(() => attemptCapture(attempt + 1), 100);
          }
        }
      };

      // Aguarda um momento para garantir que está no frame final do loop
      setTimeout(() => attemptCapture(0), 300);
    };

    // Aguarda o GIF completar uma animação (loop)
    const handleGifLoaded = () => {
      // Aguarda um pouco para garantir que a animação começou
      setTimeout(() => {
        // Agenda a captura após o GIF rodar uma vez
        timerRef.current = setTimeout(() => {
          captureAndReplace();
        }, GIF_DURATION + 200); // +200ms para garantir que terminou o loop
      }, 100);
    };

    // Verifica se já está carregado ou aguarda o evento load
    if (img.complete && img.naturalWidth > 0) {
      handleGifLoaded();
    } else {
      img.addEventListener('load', handleGifLoaded, { once: true });
    }

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (img) {
        img.removeEventListener('load', handleGifLoaded);
      }
    };
  }, []); // Executa apenas quando o componente monta

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex items-center justify-center px-6">
        <div className="w-full">
          {/* Logo - GIF Animado (substituído por imagem estática após primeira reprodução) */}
          <div className="flex justify-center mb-16">
            {gifFinished && staticImageSrc ? (
              // Mostra a imagem estática após o GIF terminar
              <img
                src={staticImageSrc}
                alt="Amooora - Um mundo inteiro de acolhimento e liberdade"
                className="w-64"
                key="static-image"
              />
            ) : (
              // Mostra o GIF animado até terminar
              <img
                ref={gifRef}
                src={gifSrc}
                alt="Amooora - Um mundo inteiro de acolhimento e liberdade"
                className="w-64"
                key="animated-gif"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => onNavigate('login')}
              className="w-full bg-primary text-white py-4 px-6 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              Entrar
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="w-full bg-transparent border-2 border-primary text-primary py-4 px-6 rounded-full font-semibold text-lg hover:bg-primary/5 transition-colors"
            >
              Cadastrar
            </button>
          </div>

          {/* Tagline */}
          <p className="text-center text-muted-foreground text-sm mt-8">
            Um mundo inteiro de acolhimento e liberdade
          </p>

          {/* Botão Temporário de Administrador */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <button
              onClick={() => onNavigate('admin')}
              className="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-800 py-2 px-4 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Área Administrativa (Temporária)
            </button>
            <p className="text-center text-yellow-700 text-[10px] mt-1.5">
              Acesso temporário para gerenciar usuários
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
