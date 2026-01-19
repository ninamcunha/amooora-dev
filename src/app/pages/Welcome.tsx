import { useState, useEffect, useRef } from 'react';

interface WelcomeProps {
  onNavigate: (page: string) => void;
}

export function Welcome({ onNavigate }: WelcomeProps) {
  const [showStatic, setShowStatic] = useState(false);
  const [staticImageSrc, setStaticImageSrc] = useState<string | null>(null);
  const gifRef = useRef<HTMLImageElement>(null);
  const hiddenGifRef = useRef<HTMLImageElement>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const captureTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAnimatedRef = useRef(false);
  const gifSrc = "https://i.postimg.cc/jdQR89Wp/0108.gif";
  // Duração estimada do GIF em milissegundos - ajuste conforme necessário
  // Baseado na descrição, parece ter cerca de 2-3 segundos
  const GIF_DURATION = 3000;

  useEffect(() => {
    // Reseta o estado quando o componente monta (página é aberta)
    setShowStatic(false);
    setStaticImageSrc(null);
    hasAnimatedRef.current = false;

    // Limpa timers anteriores se existirem
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    if (captureTimerRef.current) {
      clearTimeout(captureTimerRef.current);
      captureTimerRef.current = null;
    }

    const img = gifRef.current;
    const hiddenImg = hiddenGifRef.current;
    if (!img) return;

    // Força o GIF a reiniciar adicionando timestamp para evitar cache
    const timestamp = Date.now();
    const newSrc = `${gifSrc}?t=${timestamp}`;
    img.src = newSrc;
    
    // Também carrega o GIF no elemento oculto para captura
    if (hiddenImg) {
      hiddenImg.src = newSrc;
    }

    // Função para capturar o frame final do GIF
    const captureFrame = () => {
      if (hasAnimatedRef.current) return; // Evita múltiplas execuções
      
      try {
        const imgToCapture = hiddenImg || img;
        if (!imgToCapture || !imgToCapture.complete || imgToCapture.naturalWidth === 0) {
          // Se não conseguir capturar, usa uma imagem estática padrão
          setTimeout(() => {
            setStaticImageSrc(gifSrc); // Usa o próprio GIF como estático (melhor que nada)
            setShowStatic(true);
            hasAnimatedRef.current = true;
          }, 50);
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          // Fallback se não conseguir criar o canvas
          setStaticImageSrc(gifSrc);
          setShowStatic(true);
          hasAnimatedRef.current = true;
          return;
        }

        const width = imgToCapture.naturalWidth || imgToCapture.width || 256;
        const height = imgToCapture.naturalHeight || imgToCapture.height || 213;
        
        canvas.width = width;
        canvas.height = height;
        
        // Aguarda um pouco para garantir que está no frame final do loop
        const captureWithDelay = () => {
          try {
            // Limpa o canvas
            ctx.clearRect(0, 0, width, height);
            // Desenha o frame atual do GIF no canvas
            ctx.drawImage(imgToCapture, 0, 0, width, height);
            
            // Converte para imagem estática
            const staticSrc = canvas.toDataURL('image/png');
            
            if (staticSrc && staticSrc !== 'data:,' && staticSrc.length > 100) {
              setStaticImageSrc(staticSrc);
              setShowStatic(true);
              hasAnimatedRef.current = true;
              // Remove o src do GIF para garantir que para de animar
              if (img && img.src) {
                img.src = '';
              }
            } else {
              // Se a captura falhar, usa o próprio GIF como fallback (mas sem animação)
              setStaticImageSrc(gifSrc);
              setShowStatic(true);
              hasAnimatedRef.current = true;
              // Remove o src do GIF original para parar
              if (img && img.src) {
                img.src = '';
              }
            }
          } catch (error) {
            console.error('Erro ao capturar frame:', error);
            // Fallback: usa o próprio GIF
            setStaticImageSrc(gifSrc);
            setShowStatic(true);
            hasAnimatedRef.current = true;
            if (img && img.src) {
              img.src = '';
            }
          }
        };
        
        // Aguarda um momento antes de capturar para garantir que está no frame final
        setTimeout(captureWithDelay, 200);
        
      } catch (error) {
        console.error('Erro ao capturar frame do GIF:', error);
        // Fallback final
        setStaticImageSrc(gifSrc);
        setShowStatic(true);
        hasAnimatedRef.current = true;
        if (img && img.src) {
          img.src = '';
        }
      }
    };

    // Função para iniciar o processo de pausar
    const startPauseProcess = () => {
      if (hasAnimatedRef.current) return;

      // Primeiro, agenda a captura do frame (um pouco antes do final)
      captureTimerRef.current = setTimeout(() => {
        captureFrame();
      }, GIF_DURATION - 100);

      // Depois, agenda a pausa definitiva
      pauseTimerRef.current = setTimeout(() => {
        // Garante que a captura foi feita
        if (!hasAnimatedRef.current) {
          captureFrame();
        } else {
          // Se já capturou, apenas força a exibição da imagem estática
          setShowStatic(true);
          // Remove o src do GIF para garantir que para completamente
          if (img && img.src) {
            img.src = '';
          }
        }
      }, GIF_DURATION + 300);
    };

    // Quando o GIF carregar, inicia o processo
    const handleGifReady = () => {
      // Pequeno delay para garantir que a animação começou
      setTimeout(() => {
        startPauseProcess();
      }, 150);
    };

    // Verifica se o GIF já está carregado
    if (img.complete && img.naturalWidth > 0) {
      handleGifReady();
    } else {
      img.addEventListener('load', handleGifReady, { once: true });
    }

    if (hiddenImg && !hiddenImg.complete) {
      hiddenImg.addEventListener('load', handleGifReady, { once: true });
    }

    // Cleanup
    return () => {
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
      if (captureTimerRef.current) {
        clearTimeout(captureTimerRef.current);
      }
      img.removeEventListener('load', handleGifReady);
      if (hiddenImg) {
        hiddenImg.removeEventListener('load', handleGifReady);
      }
    };
  }, []); // Array vazio = executa apenas quando o componente monta

  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex items-center justify-center px-6">
        <div className="w-full">
          {/* Logo - GIF Animado (pausa após primeira reprodução) */}
          <div className="flex justify-center mb-16 relative">
            {/* GIF oculto para captura do frame final */}
            <img
              ref={hiddenGifRef}
              src={gifSrc}
              alt=""
              className="absolute opacity-0 pointer-events-none"
              style={{ width: 0, height: 0 }}
            />
            
            {!showStatic ? (
              // Mostra o GIF animado até pausar
              <img
                ref={gifRef}
                src={gifSrc}
                alt="Amooora - Um mundo inteiro de acolhimento e liberdade"
                className="w-64"
                key="animated"
                style={{ display: showStatic ? 'none' : 'block' }}
              />
            ) : staticImageSrc ? (
              // Mostra a imagem estática após pausar (se a captura funcionou)
              <img
                src={staticImageSrc}
                alt="Amooora - Um mundo inteiro de acolhimento e liberdade"
                className="w-64"
                key="static"
              />
            ) : (
              // Se não tiver imagem estática, mostra uma div vazia (GIF já foi removido do DOM)
              <div className="w-64 h-64" />
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => onNavigate('home')}
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
        </div>
      </div>
    </div>
  );
}
