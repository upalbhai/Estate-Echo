// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // Example for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

  authDomain: 'upal-estate.firebaseapp.com',
  projectId: 'upal-estate',
  storageBucket: 'upal-estate.appspot.com',
  messagingSenderId: '991651099265',
  appId: '1:991651099265:web:3dc3cb6e015f3389811380'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Example for initializing Firestore
export const firestore = getFirestore(app);
