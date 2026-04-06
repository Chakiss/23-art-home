import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { CourseService } from '@/lib/courseService';

// Hook for Custom Course Items
export function useCustomCourseItems() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CourseService.getCustomCourseItems();
        if (mounted) {
          setItems(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load custom course items');
          console.error('Error fetching custom course items:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      mounted = false;
    };
  }, []);

  return { items, loading, error, refetch: () => window.location.reload() };
}

// Hook for Predefined Courses
export function usePredefinedCourses() {
  const [courses, setCourses] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CourseService.getPredefinedCourses();
        if (mounted) {
          setCourses(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load predefined courses');
          console.error('Error fetching predefined courses:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      mounted = false;
    };
  }, []);

  return { courses, loading, error, refetch: () => window.location.reload() };
}

// Hook for Accessories
export function useAccessories() {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchAccessories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CourseService.getAccessories();
        if (mounted) {
          setAccessories(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load accessories');
          console.error('Error fetching accessories:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAccessories();

    return () => {
      mounted = false;
    };
  }, []);

  return { accessories, loading, error, refetch: () => window.location.reload() };
}

// Generic hook for any product collection 
export function useProducts(
  collectionName: 'custom_course_items' | 'predefined_courses' | 'accessories'
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data: Product[] = [];
        switch (collectionName) {
          case 'custom_course_items':
            data = await CourseService.getCustomCourseItems();
            break;
          case 'predefined_courses':
            data = await CourseService.getPredefinedCourses();
            break;
          case 'accessories':
            data = await CourseService.getAccessories();
            break;
        }
        
        if (mounted) {
          setProducts(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : `Failed to load ${collectionName}`);
          console.error(`Error fetching ${collectionName}:`, err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [collectionName]);

  return { products, loading, error, refetch: () => window.location.reload() };
}