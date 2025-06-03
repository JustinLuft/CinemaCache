import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Clapperboard, UserPlus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Firebase imports
import { auth, db } from '@/firebase/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [isTicketAdmitted, setIsTicketAdmitted] = useState(false);
  const [name, setName] = useState('');  // New name state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Cursor position for light effect
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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

    if (!name.trim()) {
      setMessage({ type: 'error', text: "Please enter your name." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords don't match." });
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save extra user info (name) in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: user.email,
        createdAt: new Date(),
      });

      setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
      setIsTicketAdmitted(true);

      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || "Failed to register user." });
    }

    setLoading(false);
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
          transition: { duration: 1, ease: 'easeInOut' }
        }}
      >
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clapperboard className="w-8 h-8 text-primary-foreground" />
            <h2 className="text-2xl font-bold tracking-widest uppercase">CinemaPrompt</h2>
          </div>
          <div className="text-right">
            <p className="text-sm">REGISTER</p>
            <Ticket className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative">
          <div className="space-y-4 relative z-10">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-primary tracking-widest">SIGN UP TICKET</h3>
              <p className="text-sm text-primary/70">Create your personal access pass</p>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-primary uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Full Name"
                className="border-primary/50 focus:ring-primary bg-input font-mono text-foreground tracking-wider"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-primary uppercase tracking-wider">
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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-primary uppercase tracking-wider">
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-primary uppercase tracking-wider">
                Confirm Passcode
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your secret passcode"
                className="border-primary/50 focus:ring-primary bg-input font-mono text-foreground tracking-wider"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {message && (
            <p
              className={`text-center text-sm font-medium ${
                message.type === 'success' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {message.text}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground flex items-center justify-center gap-2 tracking-wider uppercase"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Registering...' : 'Create Ticket'}
          </Button>
        </form>

        <div className="p-4 text-center text-sm bg-card">
          <div className="mt-4">
            Already have a ticket?{' '}
            <Button
              variant="link"
              type="button"
              className="text-primary ml-1 underline"
              onClick={() => navigate('/login')}
            >
              Log In Here
            </Button>
          </div>
        </div>

        <div className="absolute bottom-2 right-4 text-muted-foreground text-xs font-mono">
          TICKET #: {Math.floor(Math.random() * 1000000)}
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
