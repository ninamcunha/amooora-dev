import { Place } from '../types';
import { mockPlaces } from '../data/mocks';

export const getPlaces = async (): Promise<Place[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockPlaces]);
    }, 300);
  });
};

export const getPlaceById = async (id: string): Promise<Place | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const place = mockPlaces.find((p) => p.id === id);
      resolve(place || null);
    }, 200);
  });
};