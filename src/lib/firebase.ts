
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcW3PCQ4mMLdxaXXkZ5HGaGMx4FfLx71c",
  authDomain: "financetracker-b71ce.firebaseapp.com",
  projectId: "financetracker-b71ce",
  storageBucket: "financetracker-b71ce.appspot.com",
  messagingSenderId: "170555985079",
  appId: "1:170555985079:web:abc123def456" // Note: You might want to replace this with your actual appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
