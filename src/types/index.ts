// Image and Gallery Types
export interface ImageData {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export interface GalleryData {
  mainImage: ImageData;
  galleryImages: ImageData[];
}

// Product Types (Updated with Gallery)
export interface Product {
  product_id: string;
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
  gallery?: GalleryData;
}

// Custom Course Types
export interface CustomCourseItem {
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface CustomCourseBundle {
  bundle_id: string;
  session_count: 5; // Always exactly 5
  selected_items: CustomCourseItem[];
  bundle_total: number;
  created_at: string;
}

// Cart Types
export interface CartItem {
  cart_item_id: string;
  item_type: 'custom_bundle' | 'predefined_course' | 'accessory';
  ref_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  bundle_detail?: CustomCourseBundle;
}

export interface Cart {
  cart_id: string;
  session_id: string;
  items: CartItem[];
  total_amount: number;
  updated_at: string;
}

// Order Types
export interface Order {
  order_id: string;
  reference_no: string;
  parent_name: string;
  parent_phone: string;
  parent_line_id?: string;
  student_name: string;
  student_age: number;
  student_gender: 'หญิง' | 'ชาย';
  note?: string;
  items: CartItem[];
  total_amount: number;
  status: 'submitted' | 'contacted' | 'confirmed' | 'cancelled';
  slip_url?: string;
  created_at: string;
}

// Form Types
export interface CheckoutFormData {
  parent_name: string;
  parent_phone: string;
  parent_line_id?: string;
  student_name: string;
  student_age: number;
  student_gender: 'หญิง' | 'ชาย';
  note?: string;
}

// Course Categories
export type CourseCategory = 'custom_main' | 'predefined' | 'accessories';

// Analytics Event Types
export interface AnalyticsEvent {
  event_name: 'landing_view' | 'category_view' | 'product_view' | 'add_to_cart' | 
    'remove_from_cart' | 'custom_course_progress' | 'custom_course_completed' | 
    'checkout_start' | 'checkout_submit_success' | 'checkout_submit_fail';
  category?: string;
  product_name?: string;
  cart_value?: number;
  device_type?: string;
  source_qr_campaign?: string;
}

// Course Lesson Items (as per PRD)
export const COURSE_LESSON_ITEMS: Product[] = [
  {
    product_id: 'lesson_creative_drawing',
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
    gallery: {
      mainImage: {
        id: 'main_creative_drawing',
        url: '/images/courses/creative-drawing-main.jpg',
        alt: 'การวาดเส้นสร้างสรรค์',
        order: 0
      },
      galleryImages: [
        {
          id: 'gallery_creative_1',
          url: '/images/courses/creative-drawing-1.jpg',
          alt: 'ตัวอย่างงานวาดเส้น',
          caption: 'ผลงานนักเรียน - การวาดเส้นพื้นฐาน',
          order: 1
        },
        {
          id: 'gallery_creative_2', 
          url: '/images/courses/creative-drawing-2.jpg',
          alt: 'เทคนิคการวาดเส้น',
          caption: 'เทคนิคการใช้เส้นสร้างลวดลาย',
          order: 2
        }
      ]
    }
  },
  {
    product_id: 'lesson_cartoon_graphics',
    product_name: 'วาดการ์ตูน / นิเทศศิลป์',
    product_type: 'custom_course_item',
    category_name: 'คอร์สหลัก – จัดเองได้',
    description: 'เรียนรู้การวาดการ์ตูนและนิเทศศิลป์',
    price: 460,
    duration_hours: 2,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 2,
    gallery: {
      mainImage: {
        id: 'main_cartoon',
        url: '/images/courses/cartoon-main.jpg',
        alt: 'การวาดการ์ตูน',
        order: 0
      },
      galleryImages: [
        {
          id: 'gallery_cartoon_1',
          url: '/images/courses/cartoon-1.jpg',
          alt: 'ตัวการ์ตูนน่ารัก',
          caption: 'เรียนรู้การสร้างตัวการ์ตูน',
          order: 1
        }
      ]
    }
  },
  {
    product_id: 'lesson_story_board',
    product_name: 'Story Board',
    product_type: 'custom_course_item',
    category_name: 'คอร์สหลัก – จัดเองได้',
    description: 'เรียนรู้การสร้าง Story Board',
    price: 460,
    duration_hours: 2,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 3
  },
  {
    product_id: 'lesson_diy_craft',
    product_name: 'ประดิษฐ์ DIY',
    product_type: 'custom_course_item',
    category_name: 'คอร์สหลัก – จัดเองได้',
    description: 'เรียนรู้การประดิษฐ์แบบ DIY',
    price: 500,
    duration_hours: 2,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 4
  },
  {
    product_id: 'lesson_color_techniques',
    product_name: 'สนุกกับการใช้สีและเทคนิคต่างๆ',
    product_type: 'custom_course_item',
    category_name: 'คอร์สหลัก – จัดเองได้',
    description: 'เรียนรู้การใช้สีและเทคนิคการวาด',
    price: 460,
    duration_hours: 2,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 5
  },
  {
    product_id: 'lesson_sculpture',
    product_name: 'ปั้น',
    product_type: 'custom_course_item',
    category_name: 'คอร์สหลัก – จัดเองได้',
    description: 'เรียนรู้การปั้นดิน',
    price: 490,
    duration_hours: 2,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 6
  }
];

// Predefined Courses (as per PRD)
export const PREDEFINED_COURSES: Product[] = [
  {
    product_id: 'course_watercolor',
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
    gallery: {
      mainImage: {
        id: 'main_watercolor',
        url: '/images/courses/watercolor-main.jpg',
        alt: 'คอร์สสีน้ำ',
        order: 0
      },
      galleryImages: [
        {
          id: 'gallery_watercolor_1',
          url: '/images/courses/watercolor-1.jpg',
          alt: 'ภาพวาดสีน้ำ',
          caption: 'ผลงานจากคอร์สสีน้ำ',
          order: 1
        }
      ]
    }
  },
  {
    product_id: 'course_acrylic',
    product_name: 'คอร์สสีอะคริลิค',
    product_type: 'predefined_course',
    category_name: 'คอร์สสำเร็จรูป',
    description: 'คอร์สเรียนสีอะคริลิคครบถ้วน 5 ครั้ง',
    price: 2300,
    duration_hours: 10,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 2
  },
  {
    product_id: 'course_sculpture_3d',
    product_name: 'คอร์สปั้น 3 มิติ',
    product_type: 'predefined_course',
    category_name: 'คอร์สสำเร็จรูป',
    description: 'คอร์สเรียนปั้นดิน 3 มิติ 5 ครั้ง',
    price: 2500,
    duration_hours: 10,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 3
  },
  {
    product_id: 'course_diy_craft',
    product_name: 'คอร์สประดิษฐ์ DIY',
    product_type: 'predefined_course',
    category_name: 'คอร์สสำเร็จรูป',
    description: 'คอร์สเรียนประดิษฐ์ DIY ครบถ้วน 5 ครั้ง',
    price: 3000,
    duration_hours: 10,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 4
  },
  {
    product_id: 'course_digital_art',
    product_name: 'Digital Art',
    product_type: 'predefined_course',
    category_name: 'คอร์สสำเร็จรูป',
    description: 'คอร์สเรียน Digital Art 5 ครั้ง',
    price: 2300,
    duration_hours: 10,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 5
  },
  {
    product_id: 'course_combo_set',
    product_name: 'Combo Set (วาดเส้น, สี, คาแรคเตอร์, ออกแบบ, จัดองค์ประกอบ)',
    product_type: 'predefined_course',
    category_name: 'คอร์สสำเร็จรูป',
    description: 'คอร์สรวม 5 หัวข้อหลัก 5 ครั้ง',
    price: 2300,
    duration_hours: 10,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 6
  },
  {
    product_id: 'course_story_board',
    product_name: 'Story Board',
    product_type: 'predefined_course',
    category_name: 'คอร์สสำเร็จรูป',
    description: 'คอร์สเรียน Story Board ครบถ้วน 5 ครั้ง',
    price: 2300,
    duration_hours: 10,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 7
  },
  {
    product_id: 'course_fabric_art',
    product_name: 'ศิลปะผ้าสร้างสรรค์',
    product_type: 'predefined_course',
    category_name: 'คอร์สสำเร็จรูป',
    description: 'คอร์สเรียนศิลปะผ้า 5 ครั้ง',
    price: 2500,
    duration_hours: 10,
    age_min: 4,
    age_max: 12,
    is_active: true,
    display_order: 8
  }
];

// Art Supply Add-on (as per PRD)
export const ART_SUPPLY_PRODUCTS: Product[] = [
  {
    product_id: 'supply_art_bag',
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
    gallery: {
      mainImage: {
        id: 'main_art_bag',
        url: '/images/accessories/art-bag-main.jpg',
        alt: 'กระเป๋าศิลปะ',
        order: 0
      },
      galleryImages: [
        {
          id: 'gallery_art_bag_1',
          url: '/images/accessories/art-bag-contents.jpg',
          alt: 'เนื้อหาในกระเป๋า',
          caption: 'อุปกรณ์ครบชุดในกระเป๋าศิลปะ',
          order: 1
        }
      ]
    }
  }
];

// Course Categories Configuration
export const COURSE_CATEGORIES = [
  {
    id: 'custom_main',
    name: 'คอร์สหลัก – จัดเองได้',
    description: 'เลือกรายวิชาเองได้ 5 ครั้ง ครั้งละ 2 ชั่วโมง',
    icon: '🎨',
    route: '/custom-course'
  },
  {
    id: 'predefined',
    name: 'คอร์สสำเร็จรูป',
    description: 'คอร์สที่ออกแบบมาเป็นชุดสำเร็จรูป',
    icon: '📚',
    route: '/predefined-courses'
  },
  {
    id: 'accessories',
    name: 'อุปกรณ์เพิ่มเติม',
    description: 'กระเป๋าศิลปะและอุปกรณ์',
    icon: '🎒',
    route: '/accessories'
  }
];