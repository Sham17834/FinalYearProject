import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LanguageContext } from './LanguageContext';
import { styles } from './styles';

const AuthChoiceScreen = () => {
  const navigation = useNavigation();
  const { t } = useContext(LanguageContext);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3b82f6" />
      <View style={styles.content}>
        <Text style={styles.authTitle}>{t.chooseOption}</Text>
        <Text style={styles.authDescription}>{t.authDescription}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: '#3b82f6' }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>{t.login}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>{t.register}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AuthChoiceScreen;