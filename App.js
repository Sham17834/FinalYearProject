import React from 'react';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => (
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
        tabBarLabel: 'Home',
        tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />,
      }}
    />
    <Tab.Screen
      name="Progress"
      component={ProgressScreen}
      options={{
        tabBarLabel: 'Progress',
        tabBarIcon: ({ color }) => <Icon name="analytics" color={color} size={24} />,
      }}
    />
    <Tab.Screen
      name="Track"
      component={TrackScreen}
      options={{
        tabBarLabel: 'Track',
        tabBarIcon: ({ color }) => <Icon name="track-changes" color={color} size={24} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color }) => <Icon name="person" color={color} size={24} />,
      }}
    />
  </Tab.Navigator>
);

const App = () => {
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
          options={{ title: 'Choose an Option', headerStyle: { backgroundColor: '#3b82f6' }, headerTintColor: '#ffffff' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Register', headerStyle: { backgroundColor: '#3b82f6' }, headerTintColor: '#ffffff' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login', headerStyle: { backgroundColor: '#3b82f6' }, headerTintColor: '#ffffff' }}
        />
        <Stack.Screen
          name="LifestyleDataInput"
          component={LifestyleDataInputScreen}
          options={{ title: 'Lifestyle Data', headerStyle: { backgroundColor: '#3b82f6' }, headerTintColor: '#ffffff' }}
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

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 5,
  },
});

export default App;