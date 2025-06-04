import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, LogIn, Clapperboard } from "lucide-react";
import { useNavigate } from 'react-router-dom';

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";  // Adjust the path to your firebase config file

const LoginPage = () => {
  const navigate = useNavigate();
  const [isTicketAdmitted, setIsTicketAdmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const ticketNumber = useRef(Math.floor(Math.random() * 1000000));

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({
        type: 'success',
        text: 'Welcome to CinemaPrompt! Your ticket has been validated.'
      });
      setIsTicketAdmitted(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      let errorMsg = 'Invalid Ticket. Please check your credentials.';
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'No user found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed attempts. Please try again later.';
      }
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden"
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

      {/* Film Grain Background Effect */}
      <div className="fixed inset-0 film-grain pointer-events-none z-0" />

      {/* Ambient Lighting Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200vh] h-[50vh] rounded-full bg-primary/5 blur-[100px]" />

      {/* Vintage Ticket Container */}
      <motion.div
        className="w-[600px] bg-card shadow-2xl border-4 border-primary relative z-10"
        style={{
          clipPath: 'polygon(3% 0, 97% 0, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0 97%, 0 3%)',
          perspective: '1000px'
        }}
        animate={{
          rotateY: isTicketAdmitted ? 90 : 0,
          scale: isTicketAdmitted ? 1.2 : 1,
          opacity: isTicketAdmitted ? 0 : 1,
          transition: {
            duration: 1,
            ease: 'easeInOut'
          }
        }}
      >
        {/* Film Grain Texture Overlay */}
        <div className="absolute inset-0 film-grain pointer-events-none rounded-lg z-20" />
        <div className="absolute inset-0 film-grain pointer-events-none rounded-lg z-20" />
        {/* Ticket Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clapperboard className="w-8 h-8 text-primary-foreground" />
            <h2 className="text-2xl font-bold tracking-widest uppercase">CinemaPrompt</h2>
          </div>
          <div className="text-right">
            <p className="text-sm">ADMIT ONE</p>
            <Ticket className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        {/* Ticket Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
          <div className="space-y-4 relative z-10">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-primary tracking-widest">LOGIN TICKET</h3>
              <p className="text-sm text-primary/70">Personal Access Pass</p>
            </div>

            {/* Email Section */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-primary uppercase tracking-wider"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@cinemaworld.com"
                className="border-primary/50 focus:ring-primary bg-input font-mono text-foreground tracking-wider"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Section */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-primary uppercase tracking-wider"
              >
                Secret Passcode
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your secret passcode"
                className="border-primary/50 focus:ring-primary bg-input font-mono text-foreground tracking-wider"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Message display */}
          {message && (
            <p
              className={`text-center text-sm font-medium ${
                message.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {message.text}
            </p>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground flex items-center justify-center gap-2 tracking-wider uppercase"
          >
            <LogIn className="w-4 h-4" />
            Validate Ticket
          </Button>
        </form>

        {/* Ticket Footer */}
        <div className="p-4 text-center text-sm bg-card">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Date Issued</p>
              <p className="font-mono text-foreground">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Seat</p>
              <p className="font-mono text-foreground">C-PROMPT</p>
            </div>
          </div>

          <div className="mt-4">
            No ticket?{' '}
            <Button
              variant="link"
              type="button"
              className="text-primary ml-1 underline"
              onClick={() => navigate('/register')}
            >
              Get Yours Here
            </Button>
          </div>
        </div>

        {/* Ticket Serial Number */}
        <div className="absolute bottom-2 right-4 text-muted-foreground text-xs font-mono">
          TICKET #: {ticketNumber.current}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
