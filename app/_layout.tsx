import { Stack } from 'expo-router';
import { QueryProvider } from '../providers/QueryProvider';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../providers/AuthProvider';

// Create a wrapper component that depends on AuthProvider
function RootLayoutNav() {
  const { session, isGuestMode, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    );
  }

  // Determine initial route based on authentication status
  const initialRoute = session || isGuestMode ? '(tabs)' : '(auth)';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRoute}
    />
  );
}

// Root layout that provides context providers
export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryProvider>
  );
}
