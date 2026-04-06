import { CourseService } from '../src/lib/courseService';
import { COURSE_LESSON_ITEMS, PREDEFINED_COURSES, ART_SUPPLY_PRODUCTS } from '../src/types';

/**
 * Script to upload initial data to Firestore
 * Run this once to populate the database with initial course and accessory data
 */
async function uploadInitialData() {
  try {
    console.log('🚀 Starting initial data upload to Firestore...');
    
    // Clean data by removing gallery field and any undefined values
    const cleanData = (items: any[]) => {
      return items.map(item => {
        const { gallery, ...cleanItem } = item;
        // Remove undefined values
        return Object.fromEntries(
          Object.entries(cleanItem).filter(([_, value]) => value !== undefined)
        );
      });
    };
    
    const cleanCustomCourseItems = cleanData(COURSE_LESSON_ITEMS);
    const cleanPredefinedCourses = cleanData(PREDEFINED_COURSES);
    const cleanAccessories = cleanData(ART_SUPPLY_PRODUCTS);
    
    // Upload all data using batch import
    await CourseService.batchImportInitialData(
      cleanCustomCourseItems,
      cleanPredefinedCourses,
      cleanAccessories
    );
    
    console.log('✅ Successfully uploaded initial data to Firestore!');
    console.log(`📊 Uploaded:
    - ${cleanCustomCourseItems.length} Custom Course Items
    - ${cleanPredefinedCourses.length} Predefined Courses  
    - ${cleanAccessories.length} Accessories`);
    
  } catch (error) {
    console.error('❌ Error uploading initial data:', error);
    throw error;
  }
}

// Export for use in other scripts or components
export { uploadInitialData };

// Run if called directly
if (require.main === module) {
  uploadInitialData()
    .then(() => {
      console.log('🎉 Initial data upload completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initial data upload failed:', error);
      process.exit(1);
    });
}