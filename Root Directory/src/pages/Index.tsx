import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clapperboard, Film, Popcorn, Play, Star, Sparkles } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      {/* Enhanced Cursor Light Effect */}
      <motion.div 
        className="absolute pointer-events-none z-0 transition-all duration-200 ease-out"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(211,47,47,0.1) 0%, rgba(211,47,47,0) 70%)',
          borderRadius: '50%',
          opacity: 0.4,
          filter: 'blur(120px)'
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Background grain and lighting effects */}
      <div className="fixed inset-0 film-grain opacity-10" aria-hidden="true" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200vh] h-[50vh] rounded-full bg-primary/5 blur-[120px]" />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4">
        {/* Cinematic Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1508778552286-12d4c6007799')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-background/90" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div 
            className="flex justify-center mb-6"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Film className="w-20 h-20 text-accent animate-pulse" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-serif text-foreground leading-tight"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome to <span className="text-accent">CinemaCache</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Your personal movie companion. Generate creative prompts and manage your film collection.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              onClick={() => navigate('/login')}
              className="group relative overflow-hidden 
                bg-accent/10 border border-accent/30 
                text-accent hover:bg-accent/20 
                transition-all duration-300 
                px-8 py-3 rounded-full 
                flex items-center justify-center 
                hover:shadow-lg hover:shadow-accent/20 
                focus:outline-none focus:ring-2 focus:ring-accent/50"
              size="lg"
            >
              {/* Sparkle Effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Button Content */}
              <div className="flex items-center space-x-3 relative z-10">
                <Play className="h-5 w-5 transition-transform group-hover:rotate-45" />
                <span className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  Get Started
                </span>
                <Sparkles className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: Film, 
              title: "Movie Collection", 
              description: "Organize and track your favorite films with our intuitive interface.",
              color: "text-blue-400"
            },
            { 
              icon: Popcorn, 
              title: "AI Prompts", 
              description: "Generate creative prompts for your next movie-watching experience.",
              color: "text-yellow-400"
            },
            { 
              icon: Star, 
              title: "Ratings & Reviews", 
              description: "Keep track of your thoughts and ratings for each film.",
              color: "text-purple-400"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.6 }}
            >
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-accent/20 group hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                <feature.icon className={`w-12 h-12 ${feature.color} mb-4 group-hover:scale-110 transition-transform`} />
                <h3 className="text-xl font-serif text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;