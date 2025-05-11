'use client'

import { motion } from 'framer-motion';
import { Film, Music, Tv, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

type Recommendation = {
  title: string;
  description: string;
  type: 'movie' | 'series' | 'song';
  imageUrl?: string;
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  delay?: number;
}

export default function RecommendationCard({ recommendation, delay = 0 }: RecommendationCardProps) {
  const { title, description, type } = recommendation;
  
  const getTypeIcon = () => {
    switch (type) {
      case 'movie':
        return <Film className="h-5 w-5" />;
      case 'series':
        return <Tv className="h-5 w-5" />;
      case 'song':
        return <Music className="h-5 w-5" />;
      default:
        return null;
    }
  };
  
  const getTypeColor = () => {
    switch (type) {
      case 'movie':
        return 'bg-chart-1 text-white';
      case 'series':
        return 'bg-chart-2 text-white';
      case 'song':
        return 'bg-chart-3 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  
  const getRedirectLink = () => {
    // Encode the title for URL safety
    const encodedTitle = encodeURIComponent(title);
    
    switch (type) {
      case 'movie':
        return `https://www.justwatch.com/us/search?q=${encodedTitle}`;
      case 'series':
        return `https://www.justwatch.com/us/search?q=${encodedTitle}`;
      case 'song':
        return `https://open.spotify.com/search/${encodedTitle}`;
      default:
        return '#';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-card rounded-xl overflow-hidden shadow-lg border border-border h-full flex flex-col"
    >
      <div className="absolute top-2 right-2">
        <span className={cn(
          "flex items-center gap-1 py-1 px-2 rounded-md text-xs font-medium",
          getTypeColor()
        )}>
          {getTypeIcon()}
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        
        <div className="mt-auto">
          <a 
            href={getRedirectLink()} 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-4 rounded-md w-full",
              "bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90",
              "transition-colors duration-200"
            )}
          >
            <ExternalLink className="h-4 w-4" />
            {type === 'movie' || type === 'series' ? 'Watch Now' : 'Listen Now'}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
