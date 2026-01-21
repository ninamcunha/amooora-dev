// Hook simplificado: sempre retorna admin = true (sem autenticação)
export const useAdmin = () => {
  // Sem autenticação: sempre permitir acesso admin
  return { isAdmin: true, loading: false };
};
