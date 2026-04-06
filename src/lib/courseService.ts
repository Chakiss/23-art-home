import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { Product, ImageData, GalleryData, COURSE_LESSON_ITEMS, PREDEFINED_COURSES, ART_SUPPLY_PRODUCTS } from '@/types';

// Collection Names
const COLLECTIONS = {
  COURSES: 'courses',
  ACCESSORIES: 'accessories',
  CUSTOM_COURSE_ITEMS: 'custom_course_items',
  PREDEFINED_COURSES: 'predefined_courses'
} as const;

// Course Service Class
export class CourseService {
  
  // Get all custom course items
  static async getCustomCourseItems(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.CUSTOM_COURSE_ITEMS), 
        where('is_active', '==', true),
        orderBy('display_order')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), product_id: doc.id } as Product));
    } catch (error) {
      console.warn('Firestore not accessible, falling back to static data:', error);
      // Fallback to static data
      return COURSE_LESSON_ITEMS.filter(item => item.is_active)
        .sort((a, b) => a.display_order - b.display_order);
    }
  }

  // Get all predefined courses
  static async getPredefinedCourses(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.PREDEFINED_COURSES), 
        where('is_active', '==', true),
        orderBy('display_order')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), product_id: doc.id } as Product));
    } catch (error) {
      console.warn('Firestore not accessible, falling back to static data:', error);
      // Fallback to static data
      return PREDEFINED_COURSES.filter(item => item.is_active)
        .sort((a, b) => a.display_order - b.display_order);
    }
  }

  // Get all accessories
  static async getAccessories(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.ACCESSORIES), 
        where('is_active', '==', true),
        orderBy('display_order')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ ...doc.data(), product_id: doc.id } as Product));
    } catch (error) {
      console.warn('Firestore not accessible, falling back to static data:', error);
      // Fallback to static data
      return ART_SUPPLY_PRODUCTS.filter(item => item.is_active)
        .sort((a, b) => a.display_order - b.display_order);
    }
  }

  // Get product by ID
  static async getProductById(productId: string, collection: string): Promise<Product | null> {
    try {
      const docRef = doc(db, collection, productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { ...docSnap.data(), product_id: docSnap.id } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Upload image to Firebase Storage
  static async uploadImage(
    file: File, 
    path: string, 
    filename?: string
  ): Promise<string> {
    try {
      const actualFilename = filename || `${Date.now()}-${file.name}`;
      const storageRef = ref(storage, `${path}/${actualFilename}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Delete image from Firebase Storage
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Update product gallery
  static async updateProductGallery(
    productId: string,
    collectionName: string,
    galleryData: GalleryData
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, productId);
      await updateDoc(docRef, {
        gallery: galleryData,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product gallery:', error);
      throw error;
    }
  }

  // Create new product
  static async createProduct(
    collectionName: string, 
    productData: Omit<Product, 'product_id'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...productData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(
    productId: string,
    collectionName: string,
    productData: Partial<Product>
  ): Promise<void> {
    try {
      const docRef = doc(db, collectionName, productId);
      await updateDoc(docRef, {
        ...productData,
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(productId: string, collectionName: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, productId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Batch import initial data
  static async batchImportInitialData(
    customCourseItems: Product[],
    predefinedCourses: Product[],
    accessories: Product[]
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Import Custom Course Items
      customCourseItems.forEach((item, index) => {
        const docRef = doc(collection(db, COLLECTIONS.CUSTOM_COURSE_ITEMS));
        batch.set(docRef, {
          ...item,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
      });

      // Import Predefined Courses
      predefinedCourses.forEach((course, index) => {
        const docRef = doc(collection(db, COLLECTIONS.PREDEFINED_COURSES));
        batch.set(docRef, {
          ...course,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
      });

      // Import Accessories
      accessories.forEach((accessory, index) => {
        const docRef = doc(collection(db, COLLECTIONS.ACCESSORIES));
        batch.set(docRef, {
          ...accessory,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
      });

      await batch.commit();
      console.log('Batch import completed successfully');
    } catch (error) {
      console.error('Error during batch import:', error);
      throw error;
    }
  }
}

// Utility functions
export const getCollectionByProductType = (productType: string): string => {
  switch (productType) {
    case 'custom_course_item':
      return COLLECTIONS.CUSTOM_COURSE_ITEMS;
    case 'predefined_course':
      return COLLECTIONS.PREDEFINED_COURSES;
    case 'accessory':
      return COLLECTIONS.ACCESSORIES;
    default:
      throw new Error(`Unknown product type: ${productType}`);
  }
};

// Storage paths
export const STORAGE_PATHS = {
  CUSTOM_COURSE_ITEMS: 'images/custom-course-items',
  PREDEFINED_COURSES: 'images/predefined-courses',
  ACCESSORIES: 'images/accessories'
} as const;

export default CourseService;