import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, AuthState } from '@/hooks/useAuth';
import { AuthError } from '@supabase/supabase-js';

interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<{ error?: AuthError }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};
