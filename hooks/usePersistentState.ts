// hooks/usePersistentState.ts
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { safeJsonParse } from '../utils/storageUtils';

function usePersistentState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(key);
      return safeJsonParse(saved, initialValue);
    }
    return initialValue; // Fallback for SSR or environments without localStorage
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;