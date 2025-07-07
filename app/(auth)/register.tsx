import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../providers/AuthProvider';

const genderOptions = [
  { label: 'Erkek', value: 'male' },
  { label: 'Kadın', value: 'female' },
  { label: 'Diğer', value: 'other' },
  { label: 'Belirtmek istemiyorum', value: 'prefer_not_to_say' },
];

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(2000, 0, 1));
  
  const { signUp, isLoading } = useAuth();
  const router = useRouter();

  // Password validation
  const isPasswordValid = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle date change in modal
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  // Handle date confirmation
  const handleDateConfirm = () => {
    setBirthDate(tempDate);
    setShowDatePicker(false);
  };

  // Handle date cancel
  const handleDateCancel = () => {
    setTempDate(birthDate);
    setShowDatePicker(false);
  };

  // Open date picker
  const openDatePicker = () => {
    setTempDate(birthDate);
    setShowDatePicker(true);
  };

  // Get gender label from value
  const getGenderLabel = (value: string): string => {
    const option = genderOptions.find(option => option.value === value);
    return option ? option.label : 'Cinsiyet Seçin';
  };

  // Handle gender selection
  const handleGenderSelect = (value: string) => {
    setGender(value);
    setShowGenderPicker(false);
  };

  // Handle registration
  const handleRegister = async () => {
    // Validate all fields
    if (!email || !password || !confirmPassword || !firstName || !lastName || !username || !gender) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return;
    }

    // Validate password strength
    if (!isPasswordValid(password)) {
      Alert.alert(
        'Zayıf Şifre',
        'Şifre en az 8 karakter olmalı ve en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
      );
      return;
    }

    // Validate age (must be at least 13 years old)
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    
    if (age < 13 || (age === 13 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
      Alert.alert('Hata', 'En az 13 yaşında olmalısınız');
      return;
    }

    // Use AuthProvider's signUp method
    await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      username,
      birth_date: birthDate.toISOString().split('T')[0],
      gender,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.appTitle}>mysticMind</Text>
            
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Hesap Oluştur</Text>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Ad</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Adınız"
                  />
                </View>
                
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Soyad</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Soyadınız"
                  />
                </View>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Kullanıcı Adı</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Kullanıcı adı seçin"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email adresinizi girin"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Doğum Tarihi</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={openDatePicker}
                >
                  <Text style={styles.dropdownText}>{formatDate(birthDate)}</Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Cinsiyet</Text>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowGenderPicker(true)}
                >
                  <Text style={[styles.dropdownText, { color: gender ? '#333' : '#999' }]}>
                    {getGenderLabel(gender)}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Şifre</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Şifre oluşturun"
                  secureTextEntry
                />
                <Text style={styles.helperText}>
                  En az 8 karakter, büyük harf, küçük harf ve rakam içermelidir
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Şifre Tekrar</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Şifrenizi tekrar girin"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Hesap Oluştur</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.textButton}
                onPress={() => router.back()}
              >
                <Text style={styles.textButtonLabel}>Zaten hesabınız var mı? Giriş Yapın</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleDateCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dateModalContent}>
            <Text style={styles.modalTitle}>Doğum Tarihi Seçin</Text>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              textColor="#333"
              style={styles.datePicker}
            />
            <View style={styles.dateButtonRow}>
              <TouchableOpacity
                style={[styles.dateButton, styles.cancelDateButton]}
                onPress={handleDateCancel}
              >
                <Text style={styles.cancelDateButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dateButton, styles.confirmDateButton]}
                onPress={handleDateConfirm}
              >
                <Text style={styles.confirmDateButtonText}>Tamam</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowGenderPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cinsiyet Seçin</Text>
            {genderOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  gender === option.value && styles.selectedOption
                ]}
                onPress={() => handleGenderSelect(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  gender === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 24,
    color: '#333',
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    alignSelf: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  dropdownButton: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 48,
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  dateModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  datePicker: {
    width: '100%',
    backgroundColor: '#fff',
  },
  dateButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  dateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelDateButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelDateButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmDateButton: {
    backgroundColor: '#6c63ff',
  },
  confirmDateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedOption: {
    backgroundColor: '#6c63ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#6c63ff',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  textButtonLabel: {
    color: '#6c63ff',
    fontSize: 14,
  },
}); 