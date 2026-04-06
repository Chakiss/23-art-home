'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to check if component has mounted
 * Prevents hydration mismatches for client-side only content
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}