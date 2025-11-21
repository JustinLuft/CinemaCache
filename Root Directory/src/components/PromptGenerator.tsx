import React, { useEffect, useState } from "react";
import { Clapperboard, Copy, Wand2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/firebase/firebase";

interface Movie {
  id: string;
  title: string;
  rating: number;
  image?: string;
  type?: 'watched' | 'watchlist';
  watchedDate?: string;
  favorite?: boolean;
}

const PromptGenerator: React.FC = () => {
  const [recommendations, setRecommendations] = useState("");
  const [genre, setGenre] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const db = getFirestore(app);
  const auth = getAuth(app);

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
            favorite: data.favorite ?? false,
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

  const handleGenerate = async () => {
    if (movies.length === 0) {
      toast({
        title: "No Movies Found",
        description: "You don't have any watched movies saved yet.",
      });
      return;
    }

    if (!genre.trim()) {
      setErrorMessage("Please enter a genre for recommendations.");
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setRecommendations("");

    const moviesList = movies
      .map((m) =>
        `- "${m.title}" (rated ${m.rating}/10${m.favorite ? ", FAVORITED" : ""})`
      )
      .join("\n");

    const prompt = `I want you to recommend some movies for me to watch. Here is the list of movies I have already seen along with my ratings:\n${moviesList}\n\nPlease recommend 5-7 movies in the "${genre.trim()}" genre that I haven't seen yet, preferably highly rated and similar in style or theme to the movies I rated highly. For each recommendation, include:\n1. Movie title and year\n2. A brief description (1-2 sentences)\n3. Why I might like it based on my watch history\n\nFormat the response in a clean, readable way.`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are a knowledgeable movie recommendation assistant. Provide thoughtful, personalized movie recommendations based on the user's watch history and preferences. Be concise but informative."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content;

      if (aiResponse) {
        setRecommendations(aiResponse);
      } else {
        throw new Error("No response received from AI");
      }
    } catch (error) {
      console.error("Error calling Groq API:", error);
      setErrorMessage(`Failed to get recommendations: ${error instanceof Error ? error.message : "Unknown error"}`);
      toast({
        title: "Error",
        description: "Failed to get movie recommendations. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!recommendations) return;
    navigator.clipboard.writeText(recommendations);
    toast({
      title: "Copied!",
      description: "Recommendations copied to clipboard.",
      duration: 2000,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card className="p-6 bg-card border border-border/50 shadow-lg relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1508778552286-12d4c6007799"
          alt="Cinema Background"
          className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
          style={{ objectPosition: "center" }}
        />
        <div className="absolute inset-0 film-grain rounded-lg z-0 pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Clapperboard className="w-8 h-8 text-accent" />
            <h2 className="text-2xl font-serif text-foreground">AI Movie Recommendations</h2>
            <Sparkles className="w-5 h-5 text-yellow-500" />
          </div>

          {loadingMovies ? (
            <p className="text-center text-muted-foreground">Loading your movies...</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your {movies.length} watched movies, get personalized AI recommendations.
              </p>

              <div className="mb-4">
                <label className="block text-sm text-muted-foreground mb-1" htmlFor="genre-input">
                  What genre are you in the mood for?
                </label>
                <input
                  id="genre-input"
                  type="text"
                  placeholder="e.g. sci-fi, thriller, comedy, horror"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                  className={`w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border focus:outline-none focus:ring-2 ${
                    errorMessage ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
                  }`}
                />
                {errorMessage && (
                  <p className="mt-1 text-sm text-red-500 font-medium">{errorMessage}</p>
                )}
              </div>

              <Textarea
                value={recommendations}
                readOnly
                placeholder={isGenerating ? "Getting recommendations from AI..." : "Your personalized movie recommendations will appear here..."}
                className="h-[260px] bg-input border-border/50 text-base resize-y focus:ring-accent leading-relaxed overflow-y-auto"
              />

              <div className="flex gap-4 mt-4">
                <Button
                  onClick={handleGenerate}
                  className="flex-1 w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                  disabled={isGenerating}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {isGenerating ? "Getting Recommendations..." : "Get AI Recommendations"}
                </Button>

                <Button
                  onClick={handleCopy}
                  variant="secondary"
                  className="bg-secondary hover:bg-secondary/80"
                  disabled={!recommendations}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PromptGenerator;