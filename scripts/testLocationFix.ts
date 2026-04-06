import { 
  doc, 
  setDoc,
  collection,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../src/lib/firebase';

/**
 * Simple test to verify Firestore location is working after fixing the issue
 */
async function testFirestoreAfterLocationFix() {
  console.log('🧪 Testing Firestore after location fix...');
  
  try {
    // Very simple test document
    const testDoc = {
      test_field: "Hello Firestore!",
      timestamp: serverTimestamp(),
      test_number: 123,
      test_boolean: true
    };
    
    console.log('📝 Writing test document...');
    const docRef = doc(collection(db, 'location_test'));
    await setDoc(docRef, testDoc);
    
    console.log('✅ SUCCESS! Firestore write worked!');
    console.log('📄 Document ID:', docRef.id);
    console.log('🎉 Location fix successful - you can now upload data!');
    
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run upload-clean');  
    console.log('2. Run: npm run dev');
    console.log('3. Check website at http://localhost:3001');
    
  } catch (error) {
    console.error('❌ Test failed - location might not be set yet');
    console.error('Error:', error);
    console.log('\n🔧 Please follow steps in FIREBASE_LOCATION_FIX.md');
    console.log('Then wait 2-3 minutes and try again.');
  }
}

// Run the test
testFirestoreAfterLocationFix()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));