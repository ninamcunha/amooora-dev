import { useNavigate } from 'react-router-dom';

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#f9fafb',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px', color: '#1f2937' }}>
          Bem-vindo ao Amooora
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '32px', color: '#6b7280' }}>
          Descubra os melhores locais, serviços e eventos ao seu redor
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => navigate('/cadastro')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Criar Conta
          </button>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#fff',
              color: '#3b82f6',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};