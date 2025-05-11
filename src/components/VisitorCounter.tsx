'use client'

import { useEffect, useState } from 'react';
import { useVisitorStore } from '@/lib/store/visitorStore';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Generate a random visitor ID
const generateVisitorId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Simulate random visitor fluctuations
const getRandomVisitorChange = () => {
  // 70% chance of +1, 30% chance of -1
  return Math.random() > 0.3 ? 1 : -1;
};

export default function VisitorCounter() {
  const { count, visitorId, incrementCount, decrementCount, setVisitorId } = useVisitorStore();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if this is a new visitor
      if (!visitorId) {
        const newVisitorId = generateVisitorId();
        setVisitorId(newVisitorId);
      }
      
      // Simulate other visitors coming and going
      const simulationInterval = setInterval(() => {
        const change = getRandomVisitorChange();
        if (change > 0) {
          incrementCount();
        } else {
          decrementCount();
        }
      }, 10000); // Every 10 seconds
      
      setIsInitialized(true);
      
      return () => {
        clearInterval(simulationInterval);
      };
    }
  }, [visitorId, setVisitorId, incrementCount, decrementCount]);
  
  // Don't render until we've initialized to prevent hydration issues
  if (!isInitialized && typeof window === 'undefined') {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-primary bg-opacity-10 text-primary"
      )}
    >
      <Users size={16} />
      <span className="text-sm font-medium">{count} visitor{count !== 1 ? 's' : ''} online</span>
    </motion.div>
  );
}
