import React, { useState } from 'react';
import { Clapperboard, Star, Popcorn, Filter } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Movie {
  id: string;
  title: string;
  rating: number;
  image: string;
  type: 'watched' | 'watchlist';
  watchedDate: string;
}

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1508778552286-12d4c6007799',
  'https://images.unsplash.com/photo-1514306191717-452ec28c7814',
  'https://images.unsplash.com/photo-1519035350952-38d18a3848cf',
  'https://images.unsplash.com/photo-1614622686704-f24cdef196a0',
  'https://images.unsplash.com/photo-1581095146373-cd331553812f'
];

const dummyMovies: Movie[] = [
  {
    id: '1',
    title: 'The Dark Knight',
    rating: 5,
    image: PLACEHOLDER_IMAGES[0],
    type: 'watched',
    watchedDate: '2023-01-15'
  },
  {
    id: '2',
    title: 'Inception',
    rating: 4,
    image: PLACEHOLDER_IMAGES[1],
    type: 'watchlist',
    watchedDate: '2023-06-20'
  },
  {
    id: '3',
    title: 'Pulp Fiction',
    rating: 5,
    image: PLACEHOLDER_IMAGES[2],
    type: 'watched',
    watchedDate: '2022-12-05'
  },
  {
    id: '4',
    title: 'The Godfather',
    rating: 5,
    image: PLACEHOLDER_IMAGES[3],
    type: 'watched',
    watchedDate: '2023-03-10'
  },
  {
    id: '5',
    title: 'Interstellar',
    rating: 4,
    image: PLACEHOLDER_IMAGES[4],
    type: 'watchlist',
    watchedDate: '2023-08-01'
  },
];

const MovieList = () => {
  const [filter, setFilter] = useState<string>('all');

  // Function to filter movies based on selected filter
  const filteredMovies = dummyMovies.filter(movie => {
    if (filter === 'all') return true;
    if (filter === 'watched') return movie.type === 'watched';
    if (filter === 'watchlist') return movie.type === 'watchlist';
    
    // Filter by year
    const movieYear = new Date(movie.watchedDate).getFullYear().toString();
    return movieYear === filter;
  });

  // Get unique years for filtering
  const availableYears = Array.from(
    new Set(dummyMovies.map(movie => new Date(movie.watchedDate).getFullYear().toString()))
  ).sort().reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif text-foreground">Your Movies</h2>
        
        {/* Filter Dropdown */}
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Movies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Movies</SelectItem>
              <SelectItem value="watched">Watched</SelectItem>
              <SelectItem value="watchlist">Watchlist</SelectItem>
              {availableYears.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No movies found in this filter
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <Card 
              key={movie.id}
              className="relative group overflow-hidden bg-card hover:shadow-xl transition-all duration-300 card-flip"
            >
              <div className="aspect-[2/3] relative">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="object-cover w-full h-full"
                />
                {/* Overlay to ensure title is always visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-serif text-foreground line-clamp-2">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span className="text-sm text-foreground">{movie.rating}</span>
                      </div>
                      {movie.type === 'watched' ? (
                        <Clapperboard className="w-5 h-5 text-accent" />
                      ) : (
                        <Popcorn className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieList;