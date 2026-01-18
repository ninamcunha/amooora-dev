import { Service } from '../types';
import { mockServices } from '../data/mocks';

export const getServices = async (): Promise<Service[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockServices]);
    }, 300);
  });
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const service = mockServices.find((s) => s.id === id);
      resolve(service || null);
    }, 200);
  });
};

export const getServicesByCategory = async (categorySlug: string): Promise<Service[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const services = mockServices.filter((s) => s.categorySlug === categorySlug);
      resolve([...services]);
    }, 200);
  });
};
