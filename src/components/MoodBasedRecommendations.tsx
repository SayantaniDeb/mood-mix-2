'use client'

import { useState, useRef, useEffect } from 'react';
import { generateText, generateTextStream, getTextProviders } from '@/lib/api/util';
import { motion } from 'framer-motion';
import { Sparkles, Film, Music, Tv, Send, Loader2, RefreshCw, Save } from 'lucide-react';
import RecommendationCard from './RecommendationCard';
import MoodInput from './MoodInput';
import ModelSelector from './ModelSelector';
import VisitorCounter from './VisitorCounter';
import VisitorAnalytics from './VisitorAnalytics';
import { cn } from '@/lib/utils';

type RecommendationType = 'movies' | 'series' | 'songs' | 'all';
type Recommendation = {
  title: string;
  description: string;
  type: 'movie' | 'series' | 'song';
  imageUrl?: string;
};

export default function MoodBasedRecommendations() {
  const [mood, setMood] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentType, setCurrentType] = useState<RecommendationType>('all');
  const [streamedText, setStreamedText] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('azure-gpt-4o');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [savedPlaylists, setSavedPlaylists] = useState<{name: string, recommendations: Recommendation[]}[]>([]);
  const [playlistName, setPlaylistName] = useState<string>('');
  
  const responseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get available models
    const models = getTextProviders();
    setAvailableModels(models);
    
    // Load saved playlists from localStorage
    const loadSavedPlaylists = () => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('savedPlaylists');
          if (saved) {
            setSavedPlaylists(JSON.parse(saved));
          }
        } catch (error) {
          console.error('Failed to load saved playlists:', error);
        }
      }
    };
    
    loadSavedPlaylists();
  }, []);

  const generateRecommendations = async () => {
    if (!mood.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setStreamedText('');
    setRecommendations([]);
    
    try {
      const typeText = currentType === 'all' 
        ? 'movies, TV series, and songs' 
        : currentType;
      
      const prompt = `Based on the mood "${mood}", suggest ${typeText} recommendations. 
      Format your response as a JSON array with objects containing: 
      { "title": "Name", "description": "Brief description", "type": "movie/series/song" }. 
      Provide 3 recommendations for each requested type. Be specific with titles of real movies, series, and songs that exist.`;
      
      await generateTextStream(
        prompt,
        (chunk) => {
          setStreamedText(prev => prev + chunk);
        },
        selectedModel
      );
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!streamedText || isGenerating) return;
    
    try {
      // Find JSON in the response
      const jsonMatch = streamedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsedRecommendations = JSON.parse(jsonStr);
        
        // Transform and filter recommendations
        const formattedRecommendations = parsedRecommendations.map((rec: any) => ({
          title: rec.title || 'Unknown Title',
          description: rec.description || 'No description available',
          type: rec.type || 'movie'
        }));
        
        // Filter by current type if not 'all'
        const filteredRecommendations = currentType === 'all' 
          ? formattedRecommendations 
          : formattedRecommendations.filter((rec: Recommendation) => {
              // Convert plural form to singular for comparison
              const singularType = currentType === 'movies' ? 'movie' : 
                                   currentType === 'series' ? 'series' : 
                                   currentType === 'songs' ? 'song' : '';
              return rec.type === singularType;
            });
        
        setRecommendations(filteredRecommendations);
      }
    } catch (error) {
      console.error('Error parsing recommendations:', error);
    }
  }, [streamedText, isGenerating, currentType]);

  // No longer need the getImageForType function as we're not displaying images

  const saveCurrentPlaylist = () => {
    if (recommendations.length === 0 || !playlistName.trim()) return;
    
    const newPlaylist = {
      name: playlistName,
      recommendations: [...recommendations]
    };
    
    const updatedPlaylists = [...savedPlaylists, newPlaylist];
    setSavedPlaylists(updatedPlaylists);
    
    // Save to localStorage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('savedPlaylists', JSON.stringify(updatedPlaylists));
      }
    } catch (error) {
      console.error('Failed to save playlist:', error);
    }
    
    setPlaylistName('');
  };

  const loadPlaylist = (index: number) => {
    if (index >= 0 && index < savedPlaylists.length) {
      setRecommendations(savedPlaylists[index].recommendations);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center items-center gap-3 mb-2">
          <VisitorCounter />
          <VisitorAnalytics />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-primary">
          <span className="inline-flex items-center">
            Mood<Sparkles className="ml-2 h-8 w-8 text-chart-1" />Creatr
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover personalized entertainment recommendations based on your mood
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4">How are you feeling?</h2>
            
            <div className="space-y-4">
              <MoodInput 
                value={mood} 
                onChange={setMood} 
                onSubmit={generateRecommendations}
                disabled={isGenerating}
              />
              
              <div className="flex flex-wrap gap-2 mt-4">
                <TypeButton 
                  type="all" 
                  current={currentType} 
                  onClick={() => setCurrentType('all')}
                  icon={<Sparkles className="mr-2 h-4 w-4" />}
                />
                <TypeButton 
                  type="movies" 
                  current={currentType} 
                  onClick={() => setCurrentType('movies')}
                  icon={<Film className="mr-2 h-4 w-4" />}
                />
                <TypeButton 
                  type="series" 
                  current={currentType} 
                  onClick={() => setCurrentType('series')}
                  icon={<Tv className="mr-2 h-4 w-4" />}
                />
                <TypeButton 
                  type="songs" 
                  current={currentType} 
                  onClick={() => setCurrentType('songs')}
                  icon={<Music className="mr-2 h-4 w-4" />}
                />
              </div>
              
              <ModelSelector
                models={availableModels}
                selectedModel={selectedModel}
                onSelectModel={setSelectedModel}
              />
              
              <button
                onClick={generateRecommendations}
                disabled={!mood.trim() || isGenerating}
                className={cn(
                  "w-full flex items-center justify-center py-2 px-4 rounded-md",
                  "bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90",
                  "transition-colors duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </button>
            </div>
            
            {recommendations.length > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    placeholder="Playlist name"
                    className="flex-1 px-3 py-2 rounded-md border border-input bg-background"
                  />
                  <button
                    onClick={saveCurrentPlaylist}
                    disabled={!playlistName.trim()}
                    className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
            
            {savedPlaylists.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Saved Playlists</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {savedPlaylists.map((playlist, index) => (
                    <button
                      key={index}
                      onClick={() => loadPlaylist(index)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:bg-opacity-50 transition-colors"
                    >
                      {playlist.name} ({playlist.recommendations.length})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-8">
          <div ref={responseRef} className="space-y-6">
            {isGenerating && (
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border animate-pulse">
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            
            {!isGenerating && recommendations.length === 0 && streamedText && (
              <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
                <p className="text-muted-foreground">
                  Unable to parse recommendations. Please try again with a different mood or model.
                </p>
                <pre className="mt-4 text-xs text-muted-foreground overflow-auto max-h-40 p-2 bg-muted rounded">
                  {streamedText}
                </pre>
              </div>
            )}
            
            {recommendations.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {recommendations.map((recommendation, index) => (
                  <RecommendationCard 
                    key={index}
                    recommendation={recommendation}
                    delay={index * 0.1}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TypeButtonProps {
  type: RecommendationType;
  current: RecommendationType;
  onClick: () => void;
  icon: React.ReactNode;
}

function TypeButton({ type, current, onClick, icon }: TypeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center py-1 px-3 rounded-md text-sm font-medium",
        "transition-colors duration-200",
        current === type 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary hover:bg-opacity-80"
      )}
    >
      {icon}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
  );
}
