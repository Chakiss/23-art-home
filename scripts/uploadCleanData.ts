import { 
  collection, 
  doc, 
  setDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../src/lib/firebase';

/**
 * Upload clean data to Firestore with potential problematic characters removed
 */
async function uploadCleanData() {
  console.log('🚀 Starting clean data upload...');
  
  // Clean custom course items - removed em-dash and other potential issues
  const customCourseItems = [
    {
      product_name: "วาดเส้นสร้างสรรค์",
      product_type: "custom_course_item",
      category_name: "คอร์สหลัก จัดเองได้", // Removed em-dash
      description: "เรียนรู้การวาดเส้นแบบสร้างสรรค์",
      price: 460,
      duration_hours: 2,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 1
    },
    {
      product_name: "วาดการ์ตูน / นิเทศศิลป์",
      product_type: "custom_course_item",
      category_name: "คอร์สหลัก จัดเองได้",
      description: "เรียนรู้การวาดการ์ตูนและนิเทศศิลป์",
      price: 460,
      duration_hours: 2,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 2
    },
    {
      product_name: "Story Board",
      product_type: "custom_course_item",
      category_name: "คอร์สหลัก จัดเองได้",
      description: "เรียนรู้การสร้าง Story Board",
      price: 460,
      duration_hours: 2,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 3
    },
    {
      product_name: "ประดิษฐ์ DIY",
      product_type: "custom_course_item",
      category_name: "คอร์สหลัก จัดเองได้",
      description: "เรียนรู้การประดิษฐ์แบบ DIY",
      price: 500,
      duration_hours: 2,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 4
    },
    {
      product_name: "สนุกกับการใช้สีและเทคนิคต่างๆ",
      product_type: "custom_course_item",
      category_name: "คอร์สหลัก จัดเองได้",
      description: "เรียนรู้การใช้สีและเทคนิคการวาด",
      price: 460,
      duration_hours: 2,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 5
    },
    {
      product_name: "ปั้น",
      product_type: "custom_course_item",
      category_name: "คอร์สหลัก จัดเองได้",
      description: "เรียนรู้การปั้นดิน",
      price: 490,
      duration_hours: 2,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 6
    }
  ];

  // Clean predefined courses
  const predefinedCourses = [
    {
      product_name: "คอร์สสีน้ำ",
      product_type: "predefined_course",
      category_name: "คอร์สสำเร็จรูป",
      description: "คอร์สเรียนสีน้ำครบถ้วน 5 ครั้ง",
      price: 2300,
      duration_hours: 10,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 1
    },
    {
      product_name: "คอร์สสีอะคริลิค",
      product_type: "predefined_course",
      category_name: "คอร์สสำเร็จรูป",
      description: "คอร์สเรียนสีอะคริลิคครบถ้วน 5 ครั้ง",
      price: 2300,
      duration_hours: 10,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 2
    },
    {
      product_name: "คอร์สปั้น 3 มิติ",
      product_type: "predefined_course",
      category_name: "คอร์สสำเร็จรูป",
      description: "คอร์สเรียนปั้นดิน 3 มิติ 5 ครั้ง",
      price: 2500,
      duration_hours: 10,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 3
    },
    {
      product_name: "คอร์สประดิษฐ์ DIY",
      product_type: "predefined_course",
      category_name: "คอร์สสำเร็จรูป",
      description: "คอร์สเรียนประดิษฐ์ DIY ครบถ้วน 5 ครั้ง",
      price: 3000,
      duration_hours: 10,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 4
    }
  ];

  // Clean accessories
  const accessories = [
    {
      product_name: "กระเป๋าศิลปะและอุปกรณ์พร้อมใช้",
      product_type: "accessory",
      category_name: "อุปกรณ์เพิ่มเติม",
      description: "กระเป๋าศิลปะพร้อมอุปกรณ์ครบชุด",
      price: 800,
      duration_hours: 0,
      age_min: 4,
      age_max: 12,
      is_active: true,
      display_order: 1
    }
  ];

  try {
    // Upload custom course items
    console.log('📤 Uploading custom course items...');
    for (const item of customCourseItems) {
      const docRef = doc(collection(db, 'custom_course_items'));
      await setDoc(docRef, {
        ...item,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      console.log(`✅ Uploaded: ${item.product_name}`);
    }

    // Upload predefined courses
    console.log('📤 Uploading predefined courses...');
    for (const course of predefinedCourses) {
      const docRef = doc(collection(db, 'predefined_courses'));
      await setDoc(docRef, {
        ...course,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      console.log(`✅ Uploaded: ${course.product_name}`);
    }

    // Upload accessories
    console.log('📤 Uploading accessories...');
    for (const accessory of accessories) {
      const docRef = doc(collection(db, 'accessories'));
      await setDoc(docRef, {
        ...accessory,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      console.log(`✅ Uploaded: ${accessory.product_name}`);
    }

    console.log('🎉 All clean data uploaded successfully!');
    console.log(`📊 Total uploaded:
    - ${customCourseItems.length} Custom Course Items
    - ${predefinedCourses.length} Predefined Courses  
    - ${accessories.length} Accessories`);

  } catch (error) {
    console.error('❌ Error uploading clean data:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error code:', (error as any).code);
    }
    throw error;
  }
}

// Run the upload
uploadCleanData()
  .then(() => {
    console.log('✅ Clean data upload completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Clean data upload failed:', error);
    process.exit(1);
  });