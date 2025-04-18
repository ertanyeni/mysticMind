import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Define auth context types
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isGuestMode: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userData: {
      first_name: string;
      last_name: string;
      username: string;
      birth_date: string;
      gender: string;
    }
  ) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => Promise<void>;
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If not logged in, check if guest mode is enabled
      if (!session) {
        checkGuestMode();
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        checkGuestMode();
      } else {
        setIsGuestMode(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if guest mode is enabled
  const checkGuestMode = async () => {
    try {
      const guestModeEnabled = await AsyncStorage.getItem('isGuestMode');
      setIsGuestMode(guestModeEnabled === 'true');
    } catch (error) {
      console.error('Error checking guest mode:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting to sign in...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Sign in response:', { data, error });

      if (error) throw error;
    } catch (error: any) {
      console.error('Detailed error:', error);
      Alert.alert('Error signing in', error.message || 'Network connection error');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string,
    password: string,
    userData: {
      first_name: string;
      last_name: string;
      username: string;
      birth_date: string;
      gender: string;
    }
  ) => {
    try {
      setIsLoading(true);
      
      // Register user with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      
      // Create user profile if registration successful
      if (data.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: data.user.id,
          email,
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          birth_date: userData.birth_date,
          gender: userData.gender,
        });

        if (profileError) throw profileError;
        
        Alert.alert(
          'Registration Successful',
          'Please check your email to verify your account.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error signing up', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('isGuestMode');
      setIsGuestMode(false);
      await supabase.auth.signOut();
    } catch (error: any) {
      Alert.alert('Error signing out', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Continue as guest
  const continueAsGuest = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.setItem('isGuestMode', 'true');
      setIsGuestMode(true);
    } catch (error: any) {
      Alert.alert('Error continuing as guest', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isGuestMode,
        isLoading,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 