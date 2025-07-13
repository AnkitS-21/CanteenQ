import { create } from 'zustand';

import { mockFoodItems } from '@/constants/mockData';
import { FoodItem } from '@/types';

interface MenuState {
  foodItems: FoodItem[];
  isLoading: boolean;
  getFoodItems: (canteenId: string) => FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  updateFoodItem: (id: string, updates: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  foodItems: mockFoodItems,
  isLoading: false,

  getFoodItems: (canteenId: string) => {
    return get().foodItems.filter((item) => item.canteenId === canteenId);
  },

  addFoodItem: (item) => {
    const newItem: FoodItem = {
      id: Math.random().toString(36).substring(2, 9),
      ...item,
    };
    
    set((state) => ({
      foodItems: [...state.foodItems, newItem],
    }));
  },

  updateFoodItem: (id, updates) => {
    set((state) => ({
      foodItems: state.foodItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  deleteFoodItem: (id) => {
    set((state) => ({
      foodItems: state.foodItems.filter((item) => item.id !== id),
    }));
  },

  toggleAvailability: (id) => {
    set((state) => ({
      foodItems: state.foodItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      ),
    }));
  },
}));