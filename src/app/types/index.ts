export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  rating: number;
  category: string;
  latitude?: number;
  longitude?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  price?: number;
  category: string;
  categorySlug: string;
  rating: number;
  provider?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  image: string;
  date: string;
  location: string;
  category: string;
  price?: number;
}

export interface Review {
  id: string;
  placeId?: string;
  serviceId?: string;
  eventId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
}