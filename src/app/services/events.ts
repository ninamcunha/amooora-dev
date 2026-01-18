import { Event } from '../types';
import { mockEvents } from '../data/mocks';

export const getEvents = async (): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockEvents]);
    }, 300);
  });
};

export const getEventById = async (id: string): Promise<Event | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = mockEvents.find((e) => e.id === id);
      resolve(event || null);
    }, 200);
  });
};