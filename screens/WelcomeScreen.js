import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Picker,
  Alert,
  Image,
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
      <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
      
      <View style={styles.welcomeHeader}>
        <View style={styles.logoContainer}>
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('../assets/Healthy lifestyle-cuate.png')} // Update path as needed
              style={styles.headerIllustration}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.welcomeAppName}>HealthTrack</Text>
          <Text style={styles.welcomeTagline}>Your Personal Health Companion</Text>
        </View>
      </View>

      <View style={styles.welcomeContent}>
        <View style={styles.welcomeMessageContainer}>
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          <Text style={styles.welcomeDescription}>
            Take control of your health journey with personalized tracking and insights
          </Text>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeSectionTitle}>Choose Your Language</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={language}
              style={styles.welcomePicker}
              onValueChange={(itemValue) => setLanguage(itemValue)}
            >
              <Picker.Item label="English" value="English" />
              <Picker.Item label="Bahasa Malaysia" value="Malay" />
            </Picker>
          </View>
        </View>

        <View style={styles.privacyContainer}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.modernCheckbox, agreedToTerms && styles.modernCheckboxChecked]}>
              {agreedToTerms && <Text style={styles.checkmarkIcon}>✓</Text>}
            </View>
            <Text style={styles.privacyText}>
              I agree to the{' '}
              <Text style={styles.linkText}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.getStartedButton, !agreedToTerms && styles.disabledButton]}
          onPress={handleGetStarted}
          disabled={!agreedToTerms}
        >
          <Text style={[styles.getStartedButtonText, !agreedToTerms && styles.disabledButtonText]}>
            Get Started
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>
          Join thousands of users on their health journey
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;