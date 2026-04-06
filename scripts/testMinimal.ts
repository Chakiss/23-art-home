import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc 
} from 'firebase/firestore';

// Firebase config from .env.local
const firebaseConfig = {
  apiKey: "AIzaSyC1yDWgeQ7fIkTIsb8ijiNYIi0u-qxI-60",
  authDomain: "arthome-4fa5e.firebaseapp.com",
  projectId: "arthome-4fa5e",
  storageBucket: "arthome-4fa5e.firebasestorage.app",
  messagingSenderId: "607801946954",
  appId: "1:607801946954:web:abce16d2edd43256ce87b3",
  measurementId: "G-P45D2J8HGL"
};

async function testMinimal() {
  console.log('🔥 Testing minimal Firebase connection...');
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized');
    console.log('🗄️ Database instance created');
    
    // Test minimal data write
    console.log('📤 Attempting to write minimal document...');
    
    const testData = { hello: "world" };
    const testRef = doc(collection(db, 'location_test'));
    
    await setDoc(testRef, testData);
    
    console.log('🎉 SUCCESS! Minimal write worked!');
    console.log('📄 Document ID:', testRef.id);
    
  } catch (error: any) {
    console.error('❌ Minimal test failed:', error.message);
    console.error('📋 Full error:', error);
  }
}

testMinimal()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));