import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAJeklmwOGNdKJgjPdWGCaOYV5-GlZt6D0",
  authDomain: "fyp-9fbae.firebaseapp.com",
  projectId: "fyp-9fbae",
  storageBucket: "fyp-9fbae.firebasestorage.app",
  messagingSenderId: "197590438015",
  appId: "1:197590438015:web:8f656921e2ddb4eb9a2f4a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
