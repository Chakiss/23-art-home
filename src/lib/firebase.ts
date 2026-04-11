import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, initializeFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Load environment variables for Node.js scripts
if (typeof window === 'undefined' && typeof require !== 'undefined') {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (error) {
    console.warn('dotenv not available');
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC1yDWgeQ7fIkTIsb8ijiNYIi0u-qxI-60",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "arthome-4fa5e.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "arthome-4fa5e", 
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "arthome-4fa5e.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "607801946954",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:607801946954:web:abce16d2edd43256ce87b3",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-P45D2J8HGL",
};

// Initialize Firebase only once
let app: FirebaseApp;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

try {
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
} catch (error) {
  console.error('Firestore initialization failed:', error);
  throw error;
}

export const storage = getStorage(app);

// Initialize Analytics (only in browser and if supported)
export const analytics = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export { db };
export default app;