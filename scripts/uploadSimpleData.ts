import { 
  collection, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../src/lib/firebase';

/**
 * Simple manual data upload script with detailed error handling
 */
async function uploadSimpleData() {
  console.log('🚀 Starting simple data upload...');
  
  try {
    // Simple test data
    const testCustomCourse = {
      product_name: 'วาดเส้นสร้างสรรค์',
      product_type: 'custom_course_item',
      category_name: 'คอร์สหลัก – จัดเองได้',
      description: 'เรียนรู้การวาดเส้นแบบสร้างสรรค์',
      price: 460,
      duration_hours: 2,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    console.log('📤 Uploading custom course item...');
    const customCourseRef = doc(collection(db, 'custom_course_items'));
    await setDoc(customCourseRef, testCustomCourse);
    console.log('✅ Custom course uploaded with ID:', customCourseRef.id);
    
    // Simple predefined course
    const testPredefinedCourse = {
      product_name: 'คอร์สสีน้ำ',
      product_type: 'predefined_course',
      category_name: 'คอร์สสำเร็จรูป',
      description: 'คอร์สเรียนสีน้ำครบถ้วน 5 ครั้ง',
      price: 2300,
      duration_hours: 10,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    console.log('📤 Uploading predefined course...');
    const predefinedCourseRef = doc(collection(db, 'predefined_courses'));
    await setDoc(predefinedCourseRef, testPredefinedCourse);
    console.log('✅ Predefined course uploaded with ID:', predefinedCourseRef.id);
    
    // Simple accessory
    const testAccessory = {
      product_name: 'กระเป๋าศิลปะและอุปกรณ์พร้อมใช้',
      product_type: 'accessory',
      category_name: 'อุปกรณ์เพิ่มเติม',
      description: 'กระเป๋าศิลปะพร้อมอุปกรณ์ครบชุด',
      price: 800,
      duration_hours: 0,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 1,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    };
    
    console.log('📤 Uploading accessory...');
    const accessoryRef = doc(collection(db, 'accessories'));
    await setDoc(accessoryRef, testAccessory);
    console.log('✅ Accessory uploaded with ID:', accessoryRef.id);
    
    console.log('🎉 All test data uploaded successfully!');
    
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

// Run the upload
uploadSimpleData()
  .then(() => {
    console.log('✅ Upload completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Upload failed:', error);
    process.exit(1);
  });