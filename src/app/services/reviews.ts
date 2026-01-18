import { Review } from '../types';
import { mockReviews } from '../data/mocks';

export const getReviews = async (): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockReviews]);
    }, 200);
  });
};

export const getReviewsByPlaceId = async (placeId: string): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reviews = mockReviews.filter((r) => r.placeId === placeId);
      resolve([...reviews]);
    }, 200);
  });
};

export const getReviewsByServiceId = async (serviceId: string): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reviews = mockReviews.filter((r) => r.serviceId === serviceId);
      resolve([...reviews]);
    }, 200);
  });
};

export const getReviewsByEventId = async (eventId: string): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reviews = mockReviews.filter((r) => r.eventId === eventId);
      resolve([...reviews]);
    }, 200);
  });
};
