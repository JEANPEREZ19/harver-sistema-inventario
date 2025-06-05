import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

// Mock users for demo purposes
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as const,
  },
  {
    id: '2',
    username: 'librarian',
    password: 'lib123',
    name: 'Bibliotecario',
    role: 'librarian' as const,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (credentials: LoginCredentials) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const user = mockUsers.find(
          (u) => u.username === credentials.username && u.password === credentials.password
        );
        
        if (user) {
          // Remove password before storing user data
          const { password, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'biblioteca-auth',
    }
  )
);