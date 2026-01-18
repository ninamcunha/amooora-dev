import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        color: '#fff',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Amooora</h1>
        <p style={{ fontSize: '18px' }}>Carregando...</p>
      </div>
    </div>
  );
};