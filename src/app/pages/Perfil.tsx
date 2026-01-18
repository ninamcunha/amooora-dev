import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

export const Perfil = () => {
  const { user, loading, error } = useUser();

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Carregando perfil...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>Erro ao carregar perfil: {error?.message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '16px' }}
          />
        )}
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#1f2937' }}>
          {user.name}
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>{user.email}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Link
          to="/perfil/editar"
          style={{
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textDecoration: 'none',
            color: '#1f2937',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Editar Perfil</span>
          <span>→</span>
        </Link>

        <Link
          to="/configuracoes"
          style={{
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            textDecoration: 'none',
            color: '#1f2937',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: '600' }}>Configurações</span>
          <span>→</span>
        </Link>
      </div>

      {user.bio && (
        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '8px', color: '#1f2937' }}>Sobre</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>{user.bio}</p>
        </div>
      )}
    </div>
  );
};