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
  description?: string;
  image: string;
  imageUrl?: string;
  address?: string;
  rating: number;
  category: string;
  latitude?: number;
  longitude?: number;
  reviewCount?: number;
  distance?: string;
  isSafe?: boolean;
  tags?: string[]; // Tags como: 'vegano', 'aceita-pets', 'acessivel', 'drag-shows', etc.
}

export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  imageUrl?: string;
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
  image?: string;
  imageUrl?: string;
  date: string;
  time?: string;
  location: string;
  category: string;
  price?: number;
  participants?: number;
}

export interface Review {
  id: string;
  placeId?: string;
  serviceId?: string;
  eventId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  author?: string;
  avatar?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  date?: string;
}