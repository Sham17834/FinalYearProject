import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Picker,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

const WelcomeScreen = () => {
  const [language, setLanguage] = useState('English');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigation = useNavigation();

  const handleGetStarted = () => {
    if (!agreedToTerms) {
      Alert.alert('Error', 'Please agree to the privacy terms');
      return;
    }
    navigation.navigate('AuthChoice');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <View style={[styles.header, { backgroundColor: '#3b82f6', alignItems: 'center' }]}>
        <Text style={styles.logo}>❤️📈</Text>
        <Text style={styles.appName}>HealthTrack</Text>
        <Text style={styles.appTagline}>Welcome to your health journey</Text>
      </View>
      <View style={[styles.content, { justifyContent: 'center', flex: 1 }]}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Language</Text>
          <Picker
            selectedValue={language}
            style={styles.picker}
            onValueChange={(itemValue) => setLanguage(itemValue)}
          >
            <Picker.Item label="English" value="English" />
            <Picker.Item label="Malay" value="Malay" />
          </Picker>
        </View>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, agreedToTerms ? styles.checkboxChecked : null]}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            {agreedToTerms && <Text style={styles.checkboxText}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>I agree to the Privacy Terms</Text>
        </View>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: '#10b981' }]}
          onPress={handleGetStarted}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;