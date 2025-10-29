// App.js
import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { enableScreens } from 'react-native-screens';
import "setimmediate";

// Import Screens
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import LifestyleDataInputScreen from './screens/LifestyleDataInputScreen';
import HealthTrackHomeScreen from './screens/HealthHomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import TrackScreen from './screens/TrackScreen';
import ProfileScreen from './screens/ProfileScreen';

// Context & Utils
import { LanguageProvider, LanguageContext } from './screens/LanguageContext';
import { getTranslations } from './screens/translations';
import { auth } from './firebaseConfig';
import { getDb } from './screens/db';

enableScreens();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Flow
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="LifestyleDataInput" component={LifestyleDataInputScreen} />
  </Stack.Navigator>
);

// Main App Tabs (Optimized)
const MainTabs = React.memo(() => {
  const { language } = useContext(LanguageContext);
  const t = useMemo(() => getTranslations(language), [language]);

  const tabIcon = useCallback((name) => {
    return ({ color }) => (
      <Icon name={name} color={color} size={24} />
    );
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#008080',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HealthTrackHomeScreen}
        options={{
          tabBarLabel: t.tabHome || 'Home',
          tabBarIcon: tabIcon('home'),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: t.tabProgress || 'Progress',
          tabBarIcon: tabIcon('analytics'),
        }}
      />
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{
          tabBarLabel: t.tabTrack || 'Track',
          tabBarIcon: tabIcon('track-changes'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t.tabProfile || 'Profile',
          tabBarIcon: tabIcon('person'),
        }}
      />
    </Tab.Navigator>
  );
});

// App Navigator with Auth + Lifestyle Check
const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null); // ← Removed `: any`
  const [hasLifestyleData, setHasLifestyleData] = useState(null);

  const checkLifestyleData = useCallback(async (email) => {
    try {
      const db = await getDb();
      const result = await db.getFirstAsync('SELECT 1 FROM UserProfile LIMIT 1');
      return !!result;
    } catch (error) {
      console.error('Error checking lifestyle data:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const hasData = await checkLifestyleData(currentUser.email);
        setHasLifestyleData(hasData);
      } else {
        setHasLifestyleData(false);
      }

      setInitializing(false);
    });

    return () => unsubscribe();
  }, [checkLifestyleData]);

  // Loading State
  if (initializing || (user && hasLifestyleData === null)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        hasLifestyleData ? (
          // Logged in + has data → Main App
          <>
            <Stack.Screen name="MainApp" component={MainTabs} />
            <Stack.Screen name="LifestyleDataInput" component={LifestyleDataInputScreen} />
          </>
        ) : (
          // Logged in but NO data → Force input
          <>
            <Stack.Screen name="LifestyleDataInput" component={LifestyleDataInputScreen} />
            <Stack.Screen name="MainApp" component={MainTabs} />
          </>
        )
      ) : (
        // Not logged in → Auth flow
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

// Root App
const App = () => {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    paddingBottom: 5,
    elevation: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;