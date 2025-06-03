import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clapperboard, Film, Popcorn, Play, Star } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Cursor light effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener('mousemove', handleMouseMove);
      return () => {
        currentContainer.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Cursor Light Effect */}
      <div 
        className="absolute pointer-events-none z-0 transition-all duration-200 ease-out"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(211,47,47,0.2) 0%, rgba(211,47,47,0) 70%)',
          borderRadius: '50%',
          opacity: 0.5,
          filter: 'blur(100px)'
        }}
      />

      {/* Background grain effect */}
      <div className="fixed inset-0 film-grain" aria-hidden="true" />
      
      {/* Ambient lighting effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200vh] h-[50vh] rounded-full bg-primary/5 blur-[100px]" />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1508778552286-12d4c6007799')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-background/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-6">
            <Film className="w-20 h-20 text-accent animate-pulse" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif text-foreground leading-tight">
            Welcome to <span className="text-accent">CinemaPrompt</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal AI-powered movie companion. Generate creative prompts and manage your film collection.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              onClick={() => navigate('/login')}
              className="bg-primary hover:bg-primary-hover text-primary-foreground glow-hover"
              size="lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            
            <Button 
              onClick={() => navigate('/about')}
              variant="secondary"
              size="lg"
              className="bg-secondary hover:bg-secondary/80"
            >
              <Clapperboard className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20">
            <Film className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-serif text-foreground mb-2">
              Movie Collection
            </h3>
            <p className="text-muted-foreground">
              Organize and track your favorite films with our intuitive interface.
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20">
            <Popcorn className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-serif text-foreground mb-2">
              AI Prompts
            </h3>
            <p className="text-muted-foreground">
              Generate creative prompts for your next movie-watching experience.
            </p>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20">
            <Star className="w-12 h-12 text-accent mb-4" />
            <h3 className="text-xl font-serif text-foreground mb-2">
              Ratings & Reviews
            </h3>
            <p className="text-muted-foreground">
              Keep track of your thoughts and ratings for each film.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
