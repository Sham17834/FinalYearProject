import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from './LanguageContext';
import { styles } from './styles';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t.error, t.errorPleaseAgree);
      return;
    }
    console.log('Login:', { email, password });
    Alert.alert(t.success, t.dataSubmitted.replace('{score}', 'N/A').replace('{risk}', 'N/A'));
    navigation.navigate('MainApp');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <ScrollView contentContainerStyle={localStyles.content}>
        <View style={localStyles.header}>
          <Text style={localStyles.title}>Welcome Back</Text>
          <Text style={localStyles.subtitle}>Sign in to continue</Text>
        </View>
        <View style={localStyles.form}>
          <View style={localStyles.inputContainer}>
            <Text style={localStyles.inputLabel}>Email or Phone Number</Text>
            <View style={[
              localStyles.input,
              isEmailFocused && { borderColor: '#3c3cbe', borderWidth: 1.5 },
            ]}>
              <TextInput
                style={localStyles.inputText}
                placeholder="Your email or phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>
          <View style={localStyles.inputContainer}>
            <Text style={localStyles.inputLabel}>Password</Text>
            <View style={[
              localStyles.input,
              isPasswordFocused && { borderColor: '#3c3cbe', borderWidth: 1.5 },
            ]}>
              <TextInput
                style={localStyles.inputText}
                placeholder="Your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={localStyles.passwordToggle}>{showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={localStyles.helpLink}
            onPress={() => Alert.alert('Help', 'Having trouble signing in?')}
          >
            <Text style={localStyles.linkText}>Need help signing in?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={localStyles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={localStyles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          <Text style={localStyles.orText}>Or sign in with</Text>
          <View style={localStyles.socialButtonsContainer}>
            <TouchableOpacity style={[localStyles.socialButton, localStyles.googleButton]}>
              <Text style={localStyles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[localStyles.socialButton, localStyles.facebookButton]}>
              <Text style={localStyles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
          <View style={localStyles.footer}>
            <Text style={localStyles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={localStyles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 40
  },
  header: {
    marginBottom: 36,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  form: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
  },
  passwordToggle: {
    color: '#3c3cbe',
    fontWeight: '500',
  },
  helpLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  linkText: {
    color: '#3c3cbe',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#3c3cbe',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: '#6b7280',
    marginVertical: 20,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  socialButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#6b7280',
  },
  footerLink: {
    color: '#3c3cbe',
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default LoginScreen;
