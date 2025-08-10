import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJeklmwOGNdKJgjPdWGCaOYV5-GlZt6D0",
  authDomain: "fyp-9fbae.firebaseapp.com",
  projectId: "fyp-9fbae",
  storageBucket: "fyp-9fbae.firebasestorage.app",
  messagingSenderId: "197590438015",
  appId: "1:197590438015:web:8f656921e2ddb4eb9a2f4a",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
