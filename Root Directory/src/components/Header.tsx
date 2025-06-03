import { Link } from 'react-router-dom';
import { Film, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="w-full bg-primary shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <Link to="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-accent" />
            <h1 className="font-serif text-2xl font-bold text-foreground tracking-wider">
              CinemaPrompt
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/movies" 
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              Your Movies
            </Link>
            <Link 
              to="/generator" 
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              Prompt Generator
            </Link>

            {/* Logout Button */}
            <Button 
              variant="secondary"
              className="flex items-center space-x-2 bg-secondary hover:bg-secondary/90 text-foreground border border-accent/20 hover:border-accent glow-hover"
            >
              <span>Logout</span>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </div>

      {/* Decorative bottom border with gradient */}
      <div className="h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50" />
    </header>
  );
};

export default Header;
