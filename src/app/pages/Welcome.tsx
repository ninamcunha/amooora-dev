import logoAmooora from "../../assets/5a07ef013ecd4a0869fe2fae41fafe9f484c2b89.png";

interface WelcomeProps {
  onNavigate: (page: string) => void;
}

export function Welcome({ onNavigate }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-muted">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl flex items-center justify-center px-6">
        <div className="w-full">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <img
              src={logoAmooora}
              alt="Amooora - Um mundo inteiro de acolhimento e liberdade"
              className="w-64"
            />
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