import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole, canteenId?: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        
        try {
          // Mock login - in a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          let user: User;
          
          if (email === "admin@canteenq.com") {
            user = {
              id: '1',
              name: 'Canteen Admin',
              email: 'admin@canteenq.com',
              role: 'admin',
              canteenId: '1',
            };
          } else {
            user = {
              id: '2',
              name: 'Student User',
              email: email,
              role: 'student',
            };
          }
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (name, email, password, role, canteenId) => {
        set({ isLoading: true });
        
        try {
          // Mock registration - in a real app, this would be an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const user: User = {
            id: Math.random().toString(36).substring(2, 9),
            name,
            email,
            role,
            ...(role === 'admin' && { canteenId }),
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);