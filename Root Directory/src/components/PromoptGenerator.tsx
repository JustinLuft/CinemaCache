import React, { useState } from 'react';
import { Clapperboard, Copy, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const PromptGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulating generation delay
    setTimeout(() => {
      setPrompt('Generated movie prompt would appear here...');
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Take 1!",
      description: "Prompt copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6 bg-card border border-border/50 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <Clapperboard className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-serif text-foreground">Prompt Generator</h2>
        </div>

        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Your generated prompt will appear here..."
            className="min-h-[200px] bg-input border-border/50 font-mono text-sm resize-none focus:ring-accent"
          />

          <div className="flex gap-4">
            <Button
              onClick={handleGenerate}
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              disabled={isGenerating}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Prompt'}
            </Button>

            <Button
              onClick={handleCopy}
              variant="secondary"
              className="bg-secondary hover:bg-secondary/80"
              disabled={!prompt}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </Card>

      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1508778552286-12d4c6007799"
          alt="Cinema Background"
          className="w-full h-48 object-cover rounded-lg opacity-20"
        />
        <div className="absolute inset-0 film-grain rounded-lg"></div>
      </div>
    </div>
  );
};

export default PromptGenerator;
