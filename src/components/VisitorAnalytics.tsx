'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Clock, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useVisitorStore } from '@/lib/store/visitorStore';

interface AnalyticsData {
  pageViews: number;
  averageTime: string;
  bounceRate: string;
}

export default function VisitorAnalytics() {
  const { count } = useVisitorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    averageTime: '0:00',
    bounceRate: '0%',
  });
  
  // Simulate analytics data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get or initialize page views from localStorage
      const storedPageViews = localStorage.getItem('moodcreatr-pageviews');
      const initialPageViews = storedPageViews ? parseInt(storedPageViews, 10) : 0;
      
      // Increment page views
      const newPageViews = initialPageViews + 1;
      localStorage.setItem('moodcreatr-pageviews', newPageViews.toString());
      
      // Generate simulated analytics data
      setAnalyticsData({
        pageViews: newPageViews,
        averageTime: `${Math.floor(Math.random() * 3) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        bounceRate: `${Math.floor(Math.random() * 30) + 20}%`,
      });
      
      // Record visit start time
      const visitStartTime = new Date().getTime();
      
      return () => {
        // Calculate visit duration when component unmounts
        const visitDuration = (new Date().getTime() - visitStartTime) / 1000;
        console.log(`Visit duration: ${Math.floor(visitDuration)} seconds`);
      };
    }
  }, []);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full",
          "bg-primary bg-opacity-10 text-primary hover:bg-opacity-20 transition-colors"
        )}
      >
        <BarChart3 size={16} />
        <span className="text-sm font-medium">Analytics</span>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-2 w-64 bg-card rounded-lg shadow-lg border border-border p-4 z-10"
        >
          <h3 className="font-medium text-lg mb-3">Visitor Analytics</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users size={14} />
                <span className="text-sm">Current Visitors</span>
              </div>
              <span className="font-medium">{count}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity size={14} />
                <span className="text-sm">Total Page Views</span>
              </div>
              <span className="font-medium">{analyticsData.pageViews}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={14} />
                <span className="text-sm">Avg. Time on Site</span>
              </div>
              <span className="font-medium">{analyticsData.averageTime}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity size={14} />
                <span className="text-sm">Bounce Rate</span>
              </div>
              <span className="font-medium">{analyticsData.bounceRate}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
            Data is simulated for demonstration purposes
          </div>
        </motion.div>
      )}
    </div>
  );
}
