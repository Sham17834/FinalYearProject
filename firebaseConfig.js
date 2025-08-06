import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDvR_NpBPzjZ_E0a_f9NUvIPltFR9LLfKo",
  authDomain: "healthtrack-472c7.firebaseapp.com",
  projectId: "healthtrack-472c7",
  storageBucket: "healthtrack-472c7.firebasestorage.app",
  messagingSenderId: "201040809867",
  appId: "1:201040809867:web:596236ca16cb4d1d10698e",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
