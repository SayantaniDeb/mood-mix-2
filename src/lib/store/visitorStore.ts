'use client'

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VisitorState {
  count: number;
  visitorId: string | null;
  incrementCount: () => void;
  decrementCount: () => void;
  setVisitorId: (id: string) => void;
}

// Generate a random visitor ID
const generateVisitorId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const useVisitorStore = create<VisitorState>()(
  persist(
    (set) => ({
      count: 1, // Start with 1 (the current visitor)
      visitorId: null,
      incrementCount: () => set((state) => ({ count: state.count + 1 })),
      decrementCount: () => set((state) => ({ count: Math.max(1, state.count - 1) })),
      setVisitorId: (id: string) => set({ visitorId: id }),
    }),
    {
      name: 'visitor-storage',
      // Only persist the visitorId
      partialize: (state) => ({ visitorId: state.visitorId }),
    }
  )
);
