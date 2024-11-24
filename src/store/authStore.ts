import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptData, decryptData } from '@/utils/encryption';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

// Custom storage that encrypts user data
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = localStorage.getItem(name);
    if (!value) return null;
    try {
      const decrypted = await decryptData(value);
      return decrypted;
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const encrypted = await encryptData(value);
      localStorage.setItem(name, encrypted);
    } catch (error) {
      console.error('Failed to encrypt data:', error);
    }
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        set({ user: null });
        // Clear any sensitive data from localStorage
        localStorage.clear();
        // Redirect to login
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);