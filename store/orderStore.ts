import { create } from 'zustand';

import { mockOrders } from '@/constants/mockData';
import { Order, OrderStatus } from '@/types';

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  placeOrder: (order: Omit<Order, 'id' | 'orderTime' | 'estimatedReadyTime' | 'status'>) => Promise<Order>;
  getOrders: (userId: string) => Order[];
  getCanteenOrders: (canteenId: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: mockOrders,
  isLoading: false,

  placeOrder: async (orderData) => {
    set({ isLoading: true });
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date();
      const estimatedTime = new Date(now.getTime() + 15 * 60000); // 15 minutes later
      
      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 9),
        orderTime: now.toISOString(),
        estimatedReadyTime: estimatedTime.toISOString(),
        status: 'pending',
        ...orderData,
      };
      
      set((state) => ({
        orders: [...state.orders, newOrder],
        isLoading: false,
      }));
      
      return newOrder;
    } catch (error) {
      console.error('Place order error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  getOrders: (userId: string) => {
    return get().orders.filter((order) => order.userId === userId);
  },

  getCanteenOrders: (canteenId: string) => {
    return get().orders.filter((order) => order.canteenId === canteenId);
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    }));
  },
}));