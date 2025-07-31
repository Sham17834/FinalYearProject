import React, { useContext } from 'react';  
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import AuthChoiceScreen from './screens/AuthChoiceScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import LifestyleDataInputScreen from './screens/LifestyleDataInputScreen';
import HealthTrackHomeScreen from './screens/HealthHomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import TrackScreen from './screens/TrackScreen';
import ProfileScreen from './screens/ProfileScreen';
import { LanguageProvider, LanguageContext } from './screens/LanguageContext';
import { getTranslations } from './screens/translations';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  const { language } = useContext(LanguageContext);
  const t = getTranslations(language);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HealthTrackHomeScreen}
        options={{
          tabBarLabel: t.healthHome,
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: t.progress,
          tabBarIcon: ({ color }) => <Icon name="analytics" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{
          tabBarLabel: t.track,
          tabBarIcon: ({ color }) => <Icon name="track-changes" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t.profile,
          tabBarIcon: ({ color }) => <Icon name="person" color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { language } = useContext(LanguageContext);
  const t = getTranslations(language);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AuthChoice"
          component={AuthChoiceScreen}
          options={{ 
            title: t.chooseOption, 
            headerStyle: { backgroundColor: '#3b82f6' }, 
            headerTintColor: '#ffffff' 
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ 
            title: t.registerTitle, 
            headerStyle: { backgroundColor: '#3b82f6' }, 
            headerTintColor: '#ffffff' 
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ 
            title: t.loginTitle, 
            headerStyle: { backgroundColor: '#3b82f6' }, 
            headerTintColor: '#ffffff' 
          }}
        />
        <Stack.Screen
          name="LifestyleDataInput"
          component={LifestyleDataInputScreen}
          options={{ 
            title: t.lifestyleData, 
            headerStyle: { backgroundColor: '#3b82f6' }, 
            headerTintColor: '#ffffff' 
          }}
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppNavigator />
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 5,
  },
});

export default App;