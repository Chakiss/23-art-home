import { initializeApp } from 'firebase/app';
import { 
  getFirestore,
  collection, 
  doc, 
  setDoc
} from 'firebase/firestore';

// Use direct config instead of importing from lib/firebase.ts
const firebaseConfig = {
  apiKey: "AIzaSyC1yDWgeQ7fIkTIsb8ijiNYIi0u-qxI-60",
  authDomain: "arthome-4fa5e.firebaseapp.com", 
  projectId: "arthome-4fa5e",
  storageBucket: "arthome-4fa5e.firebasestorage.app",
  messagingSenderId: "607801946954",
  appId: "1:607801946954:web:abce16d2edd43256ce87b3",
  measurementId: "G-P45D2J8HGL"
};

/**
 * Super simple test without serverTimestamp() or complex data
 */
async function testSimpleData() {
  console.log('🧪 Testing simple data with direct Firebase init...');
  
  // Initialize Firebase directly
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  // Basic English data first
  const simpleData = {
    name: "test",
    value: 123,
    status: true
  };
  
  try {
    console.log('📤 Uploading basic data...');
    const docRef = doc(collection(db, 'custom_course_items'));
    await setDoc(docRef, simpleData);
    console.log('✅ SUCCESS with basic data:', docRef.id);
    
    // Try with Thai text but no serverTimestamp
    console.log('📤 Testing Thai text...');
    const thaiData = {
      name: "วาดเส้น",
      price: 460,
      active: true
    };
    
    const docRef2 = doc(collection(db, 'custom_course_items'));
    await setDoc(docRef2, thaiData);
    console.log('✅ SUCCESS with Thai text:', docRef2.id);
    
    // Try with underscores in field names
    console.log('📤 Testing underscore fields...');
    const underscoreData = {
      product_name: "test",
      product_type: "test", 
      is_active: true
    };
    
    const docRef3 = doc(collection(db, 'custom_course_items'));
    await setDoc(docRef3, underscoreData);
    console.log('✅ SUCCESS with underscores:', docRef3.id);
    
    console.log('🎉 All simple tests passed!');
    
  } catch (error) {
    console.error('❌ Error in simple test:', error);
  }
}

testSimpleData()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));