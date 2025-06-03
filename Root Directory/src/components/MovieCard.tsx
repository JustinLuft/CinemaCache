import { Star, Film, Clapperboard } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  title: string;
  rating: number;
  imageUrl?: string;
  className?: string;
  onClick?: () => void;
}

const MovieCard = ({ title, rating, imageUrl, className, onClick }: MovieCardProps) => {
  // Use first unsplash image as fallback
  const defaultImage = 'https://images.unsplash.com/photo-1508778552286-12d4c6007799';

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden rounded-lg transition-all duration-300 card-flip",
        "hover:shadow-lg hover:shadow-primary/20",
        "cursor-pointer w-full aspect-[2/3]",
        className
      )}
      onClick={onClick}
    >
      {/* Card Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl || defaultImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-end p-4 text-foreground">
        <div className="flex items-start gap-2">
          <Clapperboard className="w-5 h-5 text-accent" />
          <h3 className="font-serif text-lg font-semibold line-clamp-2">{title}</h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-sm font-medium text-foreground/90">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Film Icon Decoration */}
        <Film className="absolute top-4 right-4 w-6 h-6 text-accent/50 rotate-12" />
      </div>
    </Card>
  );
};

export default MovieCard;
