import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Por enquanto, apenas navega para home
    navigate('/home');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        backgroundColor: '#f9fafb',
      }}
    >
      <button
        onClick={() => navigate('/welcome')}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          marginBottom: '24px',
        }}
      >
        ← Voltar
      </button>

      <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', color: '#1f2937' }}>
          Criar Conta
        </h1>
        <p style={{ fontSize: '16px', marginBottom: '32px', color: '#6b7280' }}>
          Preencha seus dados para começar
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text"
            placeholder="Nome completo"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            style={{
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            style={{
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '600',
              marginTop: '8px',
            }}
          >
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
};