import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
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
import { auth } from './firebaseConfig';
import { getDb } from './screens/db';
import { enableScreens } from 'react-native-screens';
import "setimmediate";

enableScreens(); 

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="LifestyleDataInput" component={LifestyleDataInputScreen} />
  </Stack.Navigator>
);

const MainTabs = () => {
  const { language } = useContext(LanguageContext);
  const t = getTranslations(language);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: '#008080',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HealthTrackHomeScreen}
        options={{
          tabBarLabel: t.tabHome || "Home",
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarLabel: t.tabProgress || "Progress",
          tabBarIcon: ({ color }) => <Icon name="analytics" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Track"
        component={TrackScreen}
        options={{
          tabBarLabel: t.tabTrack || "Track",
          tabBarIcon: ({ color }) => <Icon name="track-changes" color={color} size={24} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t.tabProfile || "Profile",
          tabBarIcon: ({ color }) => <Icon name="person" color={color} size={24} />,
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [hasLifestyleData, setHasLifestyleData] = useState(null);

  const checkLifestyleData = async (userEmail) => {
    try {
      const db = await getDb();
      const result = await db.getFirstAsync(`SELECT * FROM UserProfile LIMIT 1`);
      return !!result;
    } catch (error) {
      console.error("Error checking lifestyle data:", error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        const hasData = await checkLifestyleData(user.email);
        setHasLifestyleData(hasData);
      } else {
        setHasLifestyleData(false);
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

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
          <>
            <Stack.Screen name="MainApp" component={MainTabs} />
            <Stack.Screen name="LifestyleDataInput" component={LifestyleDataInputScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="LifestyleDataInput" component={LifestyleDataInputScreen} />
            <Stack.Screen name="MainApp" component={MainTabs} />
          </>
        )
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;
