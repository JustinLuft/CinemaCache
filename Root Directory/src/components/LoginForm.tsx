import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, KeyRound, UserRound } from "lucide-react";

const LoginForm = () => {
  return (
    <Card className="w-full max-w-md p-6 bg-card border-2 border-accent/20 relative overflow-hidden">
      {/* Gold trim effect */}
      <div className="absolute inset-0 border-[3px] border-accent/10 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Ticket className="w-8 h-8 text-accent" />
        <h2 className="text-2xl font-serif text-foreground">Cinema Access</h2>
      </div>

      {/* Form */}
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm font-medium text-foreground/90">
            Username
          </Label>
          <div className="relative">
            <UserRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              id="username"
              type="text"
              className="pl-10 bg-input border-muted hover:border-accent/50 focus:border-accent"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground/90">
            Password
          </Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              id="password"
              type="password"
              className="pl-10 bg-input border-muted hover:border-accent/50 focus:border-accent"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground glow-hover"
        >
          Enter Theater
        </Button>
      </form>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0" />
    </Card>
  );
};

export default LoginForm;
