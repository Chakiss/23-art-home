'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, CustomCourseBundle } from '@/types';
import { generateId, getSessionId, trackEvent } from '@/lib/utils';

const CART_STORAGE_KEY = 'art_home_cart';

export function useCart() {
  const [cart, setCart] = useState<Cart>(() => {
    if (typeof window === 'undefined') {
      return {
        cart_id: generateId(),
        session_id: getSessionId(),
        items: [],
        total_amount: 0,
        updated_at: new Date().toISOString(),
      };
    }
    
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
    
    return {
      cart_id: generateId(),
      session_id: getSessionId(),
      items: [],
      total_amount: 0,
      updated_at: new Date().toISOString(),
    };
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Add custom course bundle to cart
  const addCustomBundle = useCallback((bundle: CustomCourseBundle) => {
    const cartItem: CartItem = {
      cart_item_id: generateId(),
      item_type: 'custom_bundle',
      ref_id: bundle.bundle_id,
      name: 'คอร์สหลัก - จัดเองได้ (5 ครั้ง)',
      quantity: 1,
      unit_price: bundle.bundle_total,
      line_total: bundle.bundle_total,
      bundle_detail: bundle,
    };

    setCart(prev => {
      const newCart = {
        ...prev,
        items: [...prev.items, cartItem],
        total_amount: prev.total_amount + cartItem.line_total,
        updated_at: new Date().toISOString(),
      };
      return newCart;
    });

    trackEvent('add_to_cart', {
      item_type: 'custom_bundle',
      item_name: cartItem.name,
      price: cartItem.unit_price,
      cart_value: cart.total_amount + cartItem.line_total,
    });
  }, [cart.total_amount]);

  // Add predefined course or accessory to cart
  const addItem = useCallback((item: {
    product_id: string;
    name: string;
    price: number;
    type: 'predefined_course' | 'accessory';
    quantity?: number;
  }) => {
    const quantity = item.quantity || 1;
    const cartItem: CartItem = {
      cart_item_id: generateId(),
      item_type: item.type,
      ref_id: item.product_id,
      name: item.name,
      quantity,
      unit_price: item.price,
      line_total: item.price * quantity,
    };

    setCart(prev => {
      const newCart = {
        ...prev,
        items: [...prev.items, cartItem],
        total_amount: prev.total_amount + cartItem.line_total,
        updated_at: new Date().toISOString(),
      };
      return newCart;
    });

    trackEvent('add_to_cart', {
      item_type: item.type,
      item_name: item.name,
      price: item.price,
      quantity,
      cart_value: cart.total_amount + cartItem.line_total,
    });
  }, [cart.total_amount]);

  // Remove item from cart
  const removeItem = useCallback((cartItemId: string) => {
    setCart(prev => {
      const itemToRemove = prev.items.find(item => item.cart_item_id === cartItemId);
      if (!itemToRemove) return prev;

      const newItems = prev.items.filter(item => item.cart_item_id !== cartItemId);
      const newTotalAmount = newItems.reduce((sum, item) => sum + item.line_total, 0);

      trackEvent('remove_from_cart', {
        item_type: itemToRemove.item_type,
        item_name: itemToRemove.name,
        price: itemToRemove.unit_price,
        cart_value: newTotalAmount,
      });

      return {
        ...prev,
        items: newItems,
        total_amount: newTotalAmount,
        updated_at: new Date().toISOString(),
      };
    });
  }, []);

  // Update item quantity
  const updateItemQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setCart(prev => {
      const newItems = prev.items.map(item => {
        if (item.cart_item_id === cartItemId) {
          return {
            ...item,
            quantity: newQuantity,
            line_total: item.unit_price * newQuantity,
          };
        }
        return item;
      });

      const newTotalAmount = newItems.reduce((sum, item) => sum + item.line_total, 0);

      return {
        ...prev,
        items: newItems,
        total_amount: newTotalAmount,
        updated_at: new Date().toISOString(),
      };
    });
  }, [removeItem]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart({
      cart_id: generateId(),
      session_id: getSessionId(),
      items: [],
      total_amount: 0,
      updated_at: new Date().toISOString(),
    });
  }, []);

  // Get cart item count
  const getItemCount = useCallback(() => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }, [cart.items]);

  return {
    cart,
    addCustomBundle,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getItemCount,
  };
}