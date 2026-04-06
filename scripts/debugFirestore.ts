import { 
  collection, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../src/lib/firebase';

/**
 * Debug script to find what's causing Firestore write errors
 */
async function debugFirestoreWrite() {
  console.log('🔍 Starting debug write test...');
  
  try {
    // Test 1: Simplest possible data
    console.log('📝 Test 1: Basic English data');
    const basicData = {
      name: "Test Course",
      price: 100,
      active: true
    };
    
    const testRef1 = doc(collection(db, 'test_collection'));
    await setDoc(testRef1, basicData);
    console.log('✅ Test 1 PASSED - Basic data works');
    
    // Test 2: Thai characters
    console.log('📝 Test 2: Thai characters');
    const thaiData = {
      name: "คอร์สทดสอบ",
      description: "คำอธิบายภาษาไทย",
      price: 500
    };
    
    const testRef2 = doc(collection(db, 'test_collection'));
    await setDoc(testRef2, thaiData);
    console.log('✅ Test 2 PASSED - Thai characters work');
    
    // Test 3: Special characters that might cause issues
    console.log('📝 Test 3: Special characters');
    const specialData = {
      name: "คอร์สหลัก - จัดเองได้", // Changed em-dash to regular dash
      category: "คอร์สสำเร็จรูป",
      price: 460
    };
    
    const testRef3 = doc(collection(db, 'test_collection'));
    await setDoc(testRef3, specialData);
    console.log('✅ Test 3 PASSED - Special characters work');
    
    // Test 4: With serverTimestamp
    console.log('📝 Test 4: Server timestamp');
    const timestampData = {
      name: "Timestamp Test",
      price: 300,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    const testRef4 = doc(collection(db, 'test_collection'));
    await setDoc(testRef4, timestampData);
    console.log('✅ Test 4 PASSED - Server timestamp works');
    
    // Test 5: Original problematic data structure
    console.log('📝 Test 5: Original data structure');
    const originalData = {
      product_name: "วาดเส้นสร้างสรรค์",
      product_type: "custom_course_item", 
      category_name: "คอร์สหลัก – จัดเองได้", // This might be the issue
      description: "เรียนรู้การวาดเส้นแบบสร้างสรรค์",
      price: 460,
      duration_hours: 2,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 1
    };
    
    const testRef5 = doc(collection(db, 'test_collection'));
    await setDoc(testRef5, originalData);
    console.log('✅ Test 5 PASSED - Original data works');
    
    console.log('🎉 All tests passed! Firestore write should work.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error code:', (error as any).code);
      console.error('Error details:', (error as any).details);
    }
    throw error;
  }
}

// Run the debug test
debugFirestoreWrite()
  .then(() => {
    console.log('✅ Debug completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Debug failed:', error);
    process.exit(1);
  });