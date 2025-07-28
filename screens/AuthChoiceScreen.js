import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';

const AuthChoiceScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <View style={[styles.header, { backgroundColor: '#3b82f6', alignItems: 'center' }]}>
        <Text style={styles.appName}>HealthTrack</Text>
        <Text style={styles.appTagline}>Choose an option to continue</Text>
      </View>
      <View style={[styles.content, { justifyContent: 'center', flex: 1 }]}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: '#10b981', marginBottom: 16 }]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.primaryButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: '#3b82f6' }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AuthChoiceScreen;