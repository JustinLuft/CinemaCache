import React, { useEffect, useState } from "react";
import { Clapperboard, Copy, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/firebase"; // your Firebase app instance

interface Movie {
  id: string;
  title: string;
  rating: number;
  image?: string;
  type?: 'watched' | 'watchlist';
  watchedDate?: string;
}

const PromptGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  const db = getFirestore(app);
  const auth = getAuth(app);

  // Toast helper
  const toast = ({
    title,
    description,
    duration = 3000,
  }: {
    title: string;
    description?: string;
    duration?: number;
  }) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: description });
    } else {
      console.log(`[Toast] ${title}: ${description}`);
      alert(`${title}\n\n${description ?? ""}`);
    }
  };

  useEffect(() => {
    setLoadingMovies(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user);
      if (!user) {
        toast({ title: "Not logged in", description: "Please log in to load your movies." });
        setMovies([]);
        setLoadingMovies(false);
        return;
      }

      try {
        const moviesRef = collection(db, "users", user.uid, "movies");
        const q = query(moviesRef);
        const querySnapshot = await getDocs(q);

        console.log(`Fetched ${querySnapshot.size} movies for user ${user.uid}`);

        const fetchedMovies: Movie[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedMovies.push({
            id: doc.id,
            title: data.title ?? "Untitled",
            rating: data.rating ?? 0,
            image: data.image ?? "",
            type: data.type ?? "watched",
            watchedDate: data.watchedDate ?? "",
          });
        });

        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast({ title: "Error loading movies", description: String(error) });
      } finally {
        setLoadingMovies(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleGenerate = () => {
    if (movies.length === 0) {
      toast({
        title: "No Movies Found",
        description: "You don't have any watched movies saved yet.",
      });
      return;
    }

    if (!genre.trim()) {
      toast({
        title: "Genre Required",
        description: "Please enter a genre for recommendations.",
      });
      return;
    }

    setIsGenerating(true);

    const moviesList = movies
      .map((m) => `- "${m.title}" (rated ${m.rating}/10)`)
      .join("\n");

    const generatedPrompt = `I want you to recommend some movies for me to watch. Here is the list of movies I have already seen along with my ratings:\n${moviesList}\n\nPlease recommend movies in the "${genre.trim()}" genre that I haven't seen yet, preferably highly rated and similar in style or theme to the movies listed.`;

    setTimeout(() => {
      setPrompt(generatedPrompt);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopy = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
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

        {loadingMovies ? (
          <p className="text-center text-muted-foreground">Loading your movies...</p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm text-muted-foreground mb-1" htmlFor="genre-input">
                Desired Genre for Recommendations
              </label>
              <input
                id="genre-input"
                type="text"
                placeholder="e.g. sci-fi, thriller, comedy"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Your generated prompt will appear here..."
              className="min-h-[200px] bg-input border-border/50 font-mono text-sm resize-none focus:ring-accent"
            />

            <div className="flex gap-4 mt-4">
              <Button
                onClick={handleGenerate}
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                disabled={isGenerating}
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Prompt"}
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
          </>
        )}
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
