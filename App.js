import React, { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import LifestyleDataInputScreen from './screens/LifestyleDataInputScreen';
import HealthTrackHomeScreen from './screens/HealthHomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import TrackScreen from './screens/TrackScreen';
import ProfileScreen from './screens/ProfileScreen';
import { LanguageProvider, LanguageContext } from './screens/LanguageContext';
import { getTranslations } from './screens/translations';
import "setimmediate";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  const { language } = useContext(LanguageContext);
  const t = getTranslations(language);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#008080',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HealthTrackHomeScreen}
        options={{
          tabBarLabel: t.healthHome || "Home",
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: t.progress || "Progress",
          tabBarIcon: ({ color }) => <Icon name="analytics" color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{
          tabBarLabel: t.track || "Track",
          tabBarIcon: ({ color }) => <Icon name="track-changes" color={color} size={24} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t.profile || "Profile",
          tabBarIcon: ({ color }) => <Icon name="person" color={color} size={24} />,
          headerShown: false,
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
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name="LifestyleDataInput"
          component={LifestyleDataInputScreen}
        />
        <Stack.Screen
          name="MainApp"
          component={MainApp}
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
    borderTopColor: '#d1d5db',
    paddingBottom: 5,
  },
});

export default App;