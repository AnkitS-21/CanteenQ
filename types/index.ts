export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  canteenId?: string; // Only for admin
}

export interface Canteen {
  id: string;
  name: string;
  image: string;
  rating: number;
  estimatedTime: string;
  location: string;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  canteenId: string;
  available: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  canteenId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderTime: string;
  estimatedReadyTime: string;
}