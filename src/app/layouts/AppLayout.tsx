import { ReactNode } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children?: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/home') {
      return location.pathname === '/home' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <main style={{ flex: 1, paddingBottom: '80px' }}>
        {children || <Outlet />}
      </main>
      
      {/* Bottom Navigation */}
      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderTop: '1px solid #e5e7eb',
          padding: '12px 0',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
        }}
      >
        <Link
          to="/home"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive('/home') ? '#3b82f6' : '#6b7280',
            fontSize: '12px',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🏠</span>
          <span>Home</span>
        </Link>
        
        <Link
          to="/locais"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive('/locais') ? '#3b82f6' : '#6b7280',
            fontSize: '12px',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '20px' }}>📍</span>
          <span>Locais</span>
        </Link>
        
        <Link
          to="/servicos"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive('/servicos') ? '#3b82f6' : '#6b7280',
            fontSize: '12px',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🛠️</span>
          <span>Serviços</span>
        </Link>
        
        <Link
          to="/eventos"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive('/eventos') ? '#3b82f6' : '#6b7280',
            fontSize: '12px',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🎉</span>
          <span>Eventos</span>
        </Link>
        
        <Link
          to="/perfil"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive('/perfil') ? '#3b82f6' : '#6b7280',
            fontSize: '12px',
            gap: '4px',
          }}
        >
          <span style={{ fontSize: '20px' }}>👤</span>
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
};