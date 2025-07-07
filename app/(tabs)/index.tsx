import { Image, StyleSheet, Platform, TouchableOpacity, Alert, TextInput, View } from 'react-native';
import { useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/providers/AuthProvider';
import { useUser } from '@/hooks/useUser';

export default function HomeScreen() {
  const { user, isGuestMode, guestName, signOut, setGuestName } = useAuth();
  const { data: userProfile } = useUser(user?.id || '');
  const [tempName, setTempName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  // Get welcome message based on user state
  const getWelcomeMessage = () => {
    if (user && userProfile) {
      const name = userProfile.first_name || userProfile.username || 'User';
      return `Hoşgeldin, ${name}!`;
    } else if (isGuestMode) {
      if (guestName) {
        return `Hoşgeldin, ${guestName}!`;
      }
      return 'Hoşgeldin!';
    } else {
      return 'Hoşgeldin!';
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  // Handle setting guest name
  const handleSetGuestName = async () => {
    if (tempName.trim()) {
      await setGuestName(tempName.trim());
      setTempName('');
      setShowNameInput(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{getWelcomeMessage()}</ThemedText>
        <HelloWave />
      </ThemedView>
      
      {/* Guest Name Input - Only show for guests */}
      {isGuestMode && (
        <ThemedView style={styles.guestNameContainer}>
          {!guestName && !showNameInput && (
            <TouchableOpacity 
              style={styles.setNameButton} 
              onPress={() => setShowNameInput(true)}
            >
              <ThemedText style={styles.setNameButtonText}>İsim Ekle</ThemedText>
            </TouchableOpacity>
          )}
          
          {showNameInput && (
            <View style={styles.nameInputContainer}>
              <TextInput
                style={styles.nameInput}
                placeholder="İsminizi girin..."
                value={tempName}
                onChangeText={setTempName}
                autoFocus
              />
              <View style={styles.nameButtonRow}>
                <TouchableOpacity 
                  style={[styles.nameButton, styles.saveButton]} 
                  onPress={handleSetGuestName}
                >
                  <ThemedText style={styles.saveButtonText}>Kaydet</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.nameButton, styles.cancelButton]} 
                  onPress={() => {
                    setShowNameInput(false);
                    setTempName('');
                  }}
                >
                  <ThemedText style={styles.cancelButtonText}>İptal</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {guestName && (
            <TouchableOpacity 
              style={styles.changeNameButton} 
              onPress={() => setShowNameInput(true)}
            >
              <ThemedText style={styles.changeNameButtonText}>İsmi Değiştir</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
      )}
      
      {/* Temporary Logout Button */}
      <ThemedView style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <ThemedText style={styles.logoutButtonText}>Çıkış Yap</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12'
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestNameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  setNameButton: {
    backgroundColor: '#6c63ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  setNameButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  nameInputContainer: {
    width: '100%',
    maxWidth: 300,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  nameButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  nameButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 14,
  },
  changeNameButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  changeNameButtonText: {
    color: '#666',
    fontWeight: '500',
    fontSize: 12,
  },
  logoutContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
