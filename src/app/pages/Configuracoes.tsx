import { useNavigate } from 'react-router-dom';

export const Configuracoes = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/perfil')}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          marginBottom: '24px',
          color: '#3b82f6',
        }}
      >
        ← Voltar
      </button>

      <h1 style={{ fontSize: '32px', marginBottom: '24px', color: '#1f2937' }}>
        Configurações
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>
            Notificações
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Gerencie suas preferências de notificações
          </p>
        </div>

        <div
          style={{
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>
            Privacidade
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Configure suas configurações de privacidade
          </p>
        </div>

        <div
          style={{
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>
            Idioma
          </h3>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Selecione seu idioma preferido
          </p>
        </div>
      </div>
    </div>
  );
};