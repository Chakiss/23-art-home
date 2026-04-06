import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';

// Types
export interface AdminCourseItem {
  id: string;
  product_name: string;
  product_type: 'custom_course_item' | 'predefined_course' | 'accessory';
  category_name: string;
  description: string;
  price: number;
  duration_hours: number;
  age_min: number;
  age_max: number;
  is_active: boolean;
  display_order: number;
  image_urls?: string[];
  created_at?: any;
  updated_at?: any;
}

/**
 * Admin service for managing course data in Firestore
 */
export class AdminService {
  private static async withRetry<T>(operation: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await operation();
      } catch (error: any) {
        console.error(`Operation failed (attempt ${i + 1}/${maxRetries + 1}):`, error);
        
        if (i === maxRetries) {
          // Last attempt failed
          if (error.code === 'unavailable' || error.message?.includes('CORS')) {
            throw new Error('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้ กรุณารีเฟรชหน้าแล้วลองใหม่');
          }
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
    throw new Error('Unexpected error in retry logic');
  }

  // Get all items from a collection
  static async getCollectionItems(collectionName: string): Promise<AdminCourseItem[]> {
    return this.withRetry(async () => {
      try {
        const q = query(collection(db, collectionName), orderBy('display_order', 'asc'));
        const snapshot = await getDocs(q);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AdminCourseItem[];
      } catch (error: any) {
        console.error(`Error fetching ${collectionName}:`, error);
        
        // Handle specific error cases
        if (error.code === 'permission-denied') {
          throw new Error('ไม่มีสิทธิ์เข้าถึงข้อมูล กรุณาตรวจสอบการตั้งค่า');
        }
        
        throw new Error(`ไม่สามารถโหลดข้อมูล ${collectionName} ได้: ${error.message}`);
      }
    });
  }

  // Create new item
  static async createItem(
    collectionName: string, 
    data: Omit<AdminCourseItem, 'id' | 'created_at' | 'updated_at'>
  ): Promise<string> {
    return this.withRetry(async () => {
      try {
        const docRef = doc(collection(db, collectionName));
        const itemData = {
          ...data,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        };
        
        await setDoc(docRef, itemData);
        return docRef.id;
      } catch (error: any) {
        console.error(`Error creating item in ${collectionName}:`, error);
        
        if (error.code === 'permission-denied') {
          throw new Error('ไม่มีสิทธิ์ในการสร้างข้อมูลใหม่');
        }
        
        throw new Error(`ไม่สามารถสร้างรายการใหม่ได้: ${error.message}`);
      }
    });
  }

  // Update existing item
  static async updateItem(
    collectionName: string,
    itemId: string,
    data: Partial<Omit<AdminCourseItem, 'id' | 'created_at'>>
  ): Promise<void> {
    return this.withRetry(async () => {
      try {
        const docRef = doc(db, collectionName, itemId);
        await updateDoc(docRef, {
          ...data,
          updated_at: serverTimestamp()
        });
      } catch (error: any) {
        console.error(`Error updating item ${itemId} in ${collectionName}:`, error);
        
        if (error.code === 'permission-denied') {
          throw new Error('ไม่มีสิทธิ์ในการแก้ไขข้อมูล');
        }
        
        throw new Error(`ไม่สามารถอัปเดตข้อมูลได้: ${error.message}`);
      }
    });
  }

  // Delete item
  static async deleteItem(collectionName: string, itemId: string): Promise<void> {
    return this.withRetry(async () => {
      try {
        const docRef = doc(db, collectionName, itemId);
        
        // Get item data first to delete associated images
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as AdminCourseItem;
          
          // Delete associated images
          if (data.image_urls && data.image_urls.length > 0) {
            await Promise.all(
              data.image_urls.map(url => this.deleteImageFromUrl(url))
            );
          }
        }
        
        await deleteDoc(docRef);
      } catch (error: any) {
        console.error(`Error deleting item ${itemId} from ${collectionName}:`, error);
        
        if (error.code === 'permission-denied') {
          throw new Error('ไม่มีสิทธิ์ในการลบข้อมูล');
        }
        
        throw new Error(`ไม่สามารถลบรายการได้: ${error.message}`);
      }
    });
  }

  // Upload image directly to Firebase Storage from browser
  static async uploadImage(
    file: File,
    collectionName: string,
    itemId: string,
    index: number = 0
  ): Promise<string> {
    if (!file.type.startsWith('image/')) {
      throw new Error('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, GIF, WebP)');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('ขนาดไฟล์ต้องไม่เกิน 5MB');
    }

    const fileExtension = file.name.split('.').pop();
    const fileName = `${itemId}_${Date.now()}_${index}.${fileExtension}`;
    const storageRef = ref(storage, `${collectionName}/${fileName}`);

    const uploadResult = await uploadBytes(storageRef, file, {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000',
    });

    return await getDownloadURL(uploadResult.ref);
  }

  // Delete image
  static async deleteImageFromUrl(imageUrl: string): Promise<void> {
    try {
      // Extract path from URL
      const urlParts = imageUrl.split('/');
      const pathIndex = urlParts.findIndex(part => part.includes('appspot.com'));
      if (pathIndex === -1) return;
      
      const path = urlParts.slice(pathIndex + 2).join('/').split('?')[0];
      const decodedPath = decodeURIComponent(path);
      
      const imageRef = ref(storage, decodedPath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image:', error);
      // Don't throw here - image might already be deleted
    }
  }

  // Collection-specific helpers
  static getCustomCourseItems = () => this.getCollectionItems('custom_course_items');
  static getPredefinedCourses = () => this.getCollectionItems('predefined_courses');
  static getAccessories = () => this.getCollectionItems('accessories');

  static createCustomCourseItem = (data: Omit<AdminCourseItem, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem('custom_course_items', { ...data, product_type: 'custom_course_item' });
    
  static createPredefinedCourse = (data: Omit<AdminCourseItem, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem('predefined_courses', { ...data, product_type: 'predefined_course' });
    
  static createAccessory = (data: Omit<AdminCourseItem, 'id' | 'created_at' | 'updated_at'>) => 
    this.createItem('accessories', { ...data, product_type: 'accessory' });

  static updateCustomCourseItem = (itemId: string, data: Partial<Omit<AdminCourseItem, 'id' | 'created_at'>>) => 
    this.updateItem('custom_course_items', itemId, data);
    
  static updatePredefinedCourse = (itemId: string, data: Partial<Omit<AdminCourseItem, 'id' | 'created_at'>>) => 
    this.updateItem('predefined_courses', itemId, data);
    
  static updateAccessory = (itemId: string, data: Partial<Omit<AdminCourseItem, 'id' | 'created_at'>>) => 
    this.updateItem('accessories', itemId, data);

  static deleteCustomCourseItem = (itemId: string) => this.deleteItem('custom_course_items', itemId);
  static deletePredefinedCourse = (itemId: string) => this.deleteItem('predefined_courses', itemId);
  static deleteAccessory = (itemId: string) => this.deleteItem('accessories', itemId);
}