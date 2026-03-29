import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, Cart, CheckoutFormData } from '@/types';
import { generateId, generateReferenceNumber, trackEvent } from '@/lib/utils';

const ORDERS_COLLECTION = 'orders';

export class OrderService {
  // Submit a new order
  static async submitOrder(cart: Cart, formData: CheckoutFormData): Promise<{ success: boolean; order?: Order; error?: string }> {
    try {
      const orderId = generateId();
      const referenceNo = generateReferenceNumber();
      
      const order: Order = {
        order_id: orderId,
        reference_no: referenceNo,
        parent_name: formData.parent_name.trim(),
        parent_phone: formData.parent_phone.trim(),
        parent_line_id: formData.parent_line_id?.trim(),
        student_name: formData.student_name.trim(),
        student_age: formData.student_age,
        note: formData.note?.trim(),
        items: cart.items,
        total_amount: cart.total_amount,
        status: 'submitted',
        created_at: new Date().toISOString(),
      };

      // Save to Firestore
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await setDoc(orderRef, {
        ...order,
        created_at: serverTimestamp(),
      });

      // Track successful submission
      trackEvent('checkout_submit_success', {
        order_id: orderId,
        reference_no: referenceNo,
        total_amount: cart.total_amount,
        items_count: cart.items.length,
      });

      return { success: true, order };
    } catch (error: any) {
      console.error('Error submitting order:', error);
      
      // Track failed submission
      trackEvent('checkout_submit_fail', {
        error_message: error.message,
        total_amount: cart.total_amount,
        items_count: cart.items.length,
      });

      return { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง' 
      };
    }
  }

  // Get order by reference number
  static async getOrderByReference(referenceNo: string): Promise<Order | null> {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        where('reference_no', '==', referenceNo),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return { ...doc.data() as Order, order_id: doc.id };
    } catch (error) {
      console.error('Error getting order by reference:', error);
      return null;
    }
  }

  // Get order by ID
  static async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { ...docSnap.data() as Order, order_id: docSnap.id };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return null;
    }
  }

  // Get recent orders (for admin use)
  static async getRecentOrders(limitCount: number = 20): Promise<Order[]> {
    try {
      const q = query(
        collection(db, ORDERS_COLLECTION),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data() as Order,
        order_id: doc.id
      }));
    } catch (error) {
      console.error('Error getting recent orders:', error);
      return [];
    }
  }

  // Update order status (for admin use)
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await setDoc(orderRef, { status }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // Validate order data before submission
  static validateOrderData(cart: Cart, formData: CheckoutFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate cart
    if (!cart.items || cart.items.length === 0) {
      errors.push('กรุณาเลือกคอร์สก่อนดำเนินการ');
    }

    if (cart.total_amount <= 0) {
      errors.push('ยอดรวมไม่ถูกต้อง');
    }

    // Validate form data
    if (!formData.parent_name || formData.parent_name.trim().length < 2) {
      errors.push('กรุณากรอกชื่อผู้ปกครองให้ครบถ้วน');
    }

    if (!formData.parent_phone || formData.parent_phone.trim().length < 10) {
      errors.push('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
    }

    if (!formData.student_name || formData.student_name.trim().length < 2) {
      errors.push('กรุณากรอกชื่อนักเรียนให้ครบถ้วน');
    }

    if (!formData.student_age || formData.student_age < 4 || formData.student_age > 12) {
      errors.push('อายุนักเรียนต้องอยู่ระหว่าง 4-12 ปี');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}