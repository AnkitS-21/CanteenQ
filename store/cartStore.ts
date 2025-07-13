import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CartItem, FoodItem } from '@/types';

interface CartState {
  items: CartItem[];
  canteenId: string | null;
  addItem: (item: FoodItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setCanteen: (canteenId: string) => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      canteenId: null,

      addItem: (item: FoodItem) => {
        const { items, canteenId } = get();
        
        // If adding from a different canteen, clear the cart first
        if (canteenId && canteenId !== item.canteenId) {
          set({ items: [], canteenId: item.canteenId });
          set({ items: [{ ...item, quantity: 1 }] });
          return;
        }
        
        const existingItem = items.find((cartItem) => cartItem.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
            canteenId: item.canteenId,
          });
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
            canteenId: item.canteenId,
          });
        }
      },

      removeItem: (itemId: string) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== itemId);
        
        set({
          items: newItems,
          canteenId: newItems.length > 0 ? get().canteenId : null,
        });
      },

      updateQuantity: (itemId: string, quantity: number) => {
        const { items } = get();
        
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        
        set({
          items: items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [], canteenId: null });
      },

      setCanteen: (canteenId: string) => {
        set({ canteenId });
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);