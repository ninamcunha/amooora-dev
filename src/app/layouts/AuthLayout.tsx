import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface AuthLayoutProps {
  children?: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {children || <Outlet />}
    </div>
  );
};