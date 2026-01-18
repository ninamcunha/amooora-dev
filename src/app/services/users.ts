import { User } from '../types';
import { mockUsers } from '../data/mocks';

export const getCurrentUser = async (): Promise<User | null> => {
  // Por enquanto retorna o primeiro usuário como "logado"
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers[0] || null);
    }, 200);
  });
};

export const getUserById = async (id: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find((u) => u.id === id);
      resolve(user || null);
    }, 200);
  });
};