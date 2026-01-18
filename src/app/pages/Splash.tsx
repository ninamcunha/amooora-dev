import { useEffect } from 'react';

interface SplashProps {
  onComplete: () => void;
}

export function Splash({ onComplete }: SplashProps) {
  useEffect(() => {
    // Transição automática após 3 segundos
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden z-50">
      {/* GIF da Splash */}
      <img 
        src="https://i.postimg.cc/jdQR89Wp/0108.gif"
        alt="Amooora" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}