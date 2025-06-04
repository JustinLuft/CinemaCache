import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Popcorn, Clapperboard, Plus, Filter, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromptGenerator from "@/components/PromptGenerator";
import AddMovieForm from "@/components/AddMovieForm";
import { Card } from "@/components/ui/card";

import { auth, db } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Movie {
  id: string;
  title: string;
  rating: number;
  image: string;
  type: "watched" | "watchlist";
  watchedDate: string;
  favorite?: boolean;
}

const TMDB_API_KEY = "5d18532163e656fba327728ab2131bd1"; // your TMDb API key here
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

async function fetchMoviePoster(title: string): Promise<string | null> {
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
      title
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.results && data.results.length > 0) {
      const movie = data.results[0];
      if (movie.poster_path) {
        return TMDB_IMAGE_BASE + movie.poster_path;
      }
    }
    return null;
  } catch (error) {
    console.error("TMDb fetch error:", error);
    return null;
  }
}

const Dashboard = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [loadingName, setLoadingName] = useState(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Fetch user name once when auth is ready
  useEffect(() => {
    const fetchUserName = async (uid: string) => {
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserName(data.name || null);
        }
      } catch (error) {
        console.error("Error fetching user name:", error);
        setUserName(null);
      }
      setLoadingName(false);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
      } else {
        setUserName(null);
        setLoadingName(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen for movies collection updates once auth is ready
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const moviesRef = collection(db, "users", user.uid, "movies");
        const q = query(moviesRef, orderBy("createdAt", "desc"));

        const unsubscribeMovies = onSnapshot(q, async (querySnapshot) => {
          // Map each doc to Movie, fetching poster if missing
          const moviesWithImages: Movie[] = await Promise.all(
            querySnapshot.docs.map(async (doc) => {
              const data = doc.data();
              let image = data.image;
              if (!image) {
                const posterUrl = await fetchMoviePoster(
                  data.title || data.name || ""
                );
                image =
                  posterUrl ||
                  "https://images.unsplash.com/photo-1508778552286-12d4c6007799"; // fallback image
              }
              return {
                id: doc.id,
                title: data.title || data.name || "Untitled",
                rating: data.rating || 0,
                image,
                type: data.type || "watched",
                watchedDate:
                  data.watchedDate || data.date || new Date().toISOString().split("T")[0],
                favorite: data.favorite || false,
              };
            })
          );

          setMovies(moviesWithImages);
        });

        return () => unsubscribeMovies();
      } else {
        setMovies([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Add new movie to Firestore with server timestamp
  const handleAddMovie = async (movie: {
    title: string;
    rating: number;
    image?: string;
    type: "watched" | "watchlist";
    watchedDate: string;
  }) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No authenticated user!");
      return;
    }

    try {
      const moviesRef = collection(db, "users", user.uid, "movies");
      await addDoc(moviesRef, {
        title: movie.title,
        rating: movie.rating,
        image: movie.image || null,
        type: movie.type || "watched",
        watchedDate: movie.watchedDate,
        createdAt: serverTimestamp(),
        favorite: false,
      });
      console.log("✅ Movie written to Firestore");
    } catch (error) {
      console.error("❌ Error adding movie to Firestore:", error);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No authenticated user!");
      return;
    }
    try {
      const movieDocRef = doc(db, "users", user.uid, "movies", movieId);
      await deleteDoc(movieDocRef);
      console.log("✅ Movie deleted from Firestore");
    } catch (error) {
      console.error("❌ Error deleting movie from Firestore:", error);
    }
  };

  // Toggle favorite in Firestore
  const toggleFavorite = async (movie: Movie) => {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No authenticated user!");
      return;
    }
    try {
      const movieDocRef = doc(db, "users", user.uid, "movies", movie.id);
      await updateDoc(movieDocRef, {
        favorite: !movie.favorite,
      });
    } catch (error) {
      console.error("❌ Error updating favorite status:", error);
    }
  };

  // Filtering logic
  const filteredMovies = movies
    .filter((movie) => {
      if (filter === "all") return true;
      if (filter === "watched") return movie.type === "watched";
      if (filter === "watchlist") return movie.type === "watchlist";
      if (filter === "favorites") return movie.favorite;
      const movieYear = new Date(movie.watchedDate).getFullYear().toString();
      return movieYear === filter;
    })
    // Sort by watchedDate based on sortOrder
    .sort((a, b) => {
      const dateA = new Date(a.watchedDate).getTime();
      const dateB = new Date(b.watchedDate).getTime();
      if (sortOrder === "recent") return dateB - dateA;
      if (sortOrder === "oldest") return dateA - dateB;
      // fallback: favorites first
      if (a.favorite === b.favorite) return 0;
      if (a.favorite) return -1;
      return 1;
    });

  // Get unique years for filtering dropdown
  const availableYears = Array.from(
    new Set(movies.map((m) => new Date(m.watchedDate).getFullYear().toString()))
  )
    .sort()
    .reverse();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Get bounding rect of the container
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCursorPosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-start justify-center bg-background relative overflow-hidden"
    >
      {/* Cursor Light Effect */}
      <div
        className="absolute pointer-events-none z-0 transition-all duration-200 ease-out"
        style={{
          left: cursorPosition.x,
          top: cursorPosition.y,
          transform: "translate(-50%, -50%)",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(211,47,47,0.2) 0%, rgba(211,47,47,0) 70%)",
          borderRadius: "50%",
          opacity: 0.5,
          filter: "blur(100px)",
        }}
      />

      {/* Film Grain Background Effect */}
      <div className="fixed inset-0 film-grain pointer-events-none z-0" />

      {/* Ambient Lighting Effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[200vh] h-[50vh] rounded-full bg-primary/5 blur-[100px]" />

      {/* Main Content */}
      <main className="container mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">
            {loadingName
              ? "Loading..."
              : `Welcome to Your Cinema${userName ? `, ${userName}` : ""}`}
          </h1>
          <p className="text-muted-foreground">
            Manage your movie collection and generate reccomendation prompts
          </p>
        </div>

        

        {showAddForm && (
          <AddMovieForm
            onAdd={(movie) => {
              handleAddMovie(movie);
              setShowAddForm(false);
            }}
            onClose={() => setShowAddForm(false)}
          />
        )}

        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="flex space-x-2 bg-[#1c1c1c] p-1 rounded-md border border-neutral-800">
            <TabsTrigger
              value="movies"
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#2a2a2a] data-[state=active]:bg-[#d32f2f] data-[state=inactive]:text-neutral-400 transition-colors"
            >
              <Film className="mr-2 h-4 w-4" />
              Your Movies
            </TabsTrigger>

            <TabsTrigger
              value="prompts"
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-[#2a2a2a] data-[state=active]:bg-[#d32f2f] data-[state=inactive]:text-neutral-400 transition-colors"
            >
              <Popcorn className="mr-2 h-4 w-4" />
              Prompt Generator
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-4 mb-8">
          <Button className="glow-hover" variant="default" onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Movie
          </Button>
          
        </div>


          <TabsContent value="movies" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-serif text-foreground">Your Movies</h2>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Movies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Movies</SelectItem>
                    <SelectItem value="watched">Watched</SelectItem>
                    <SelectItem value="watchlist">Watchlist</SelectItem>
                    <SelectItem value="favorites">Favorites</SelectItem>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Sort Order Select */}
                <Select
                  value={sortOrder}
                  onValueChange={(value) =>
                    setSortOrder(value as "recent" | "oldest")
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            

            {filteredMovies.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No movies found in this filter
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.map((movie) => (
                  <Card
                    key={movie.id}
                    className="relative group overflow-hidden bg-card hover:shadow-xl transition-all duration-300 card-flip"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(movie);
                      }}
                      aria-label={movie.favorite ? "Unfavorite movie" : "Favorite movie"}
                      className={`absolute top-2 left-2 z-20 p-1 rounded-full transition-colors ${
                        movie.favorite
                          ? "bg-yellow-400 text-yellow-900"
                          : "bg-black bg-opacity-50 text-yellow-400 opacity-0 group-hover:opacity-100"
                      }`}
                      title={movie.favorite ? "Unfavorite" : "Favorite"}
                    >
                      <Star className="w-6 h-6" />
                    </button>

                    <div className="aspect-[2/3] relative">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-serif text-foreground line-clamp-2">
                              {movie.title}
                            </h3>

                            {/* Watched Date Display */}
                            {movie.type === "watched" && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Watched on {new Date(movie.watchedDate).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                          <h3 className="text-lg font-serif text-foreground line-clamp-2">
                          </h3>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-accent fill-accent" />
                              <span className="text-sm text-foreground">{movie.rating}</span>
                            </div>
                            {movie.type === "watched" ? (
                              <Clapperboard className="w-5 h-5 text-accent" />
                            ) : (
                              <Popcorn className="w-5 h-5 text-accent" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteMovie(movie.id)}
                    >
                      Delete
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prompts">
            <div className="bg-card rounded-lg border border-border p-6 h-[600px]">
              <PromptGenerator />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: "Total Movies", value: movies.length.toString(), icon: Film },
            // Removed "Prompts Generated"
            { label: "Favorites", value: movies.filter((m) => m.favorite).length.toString(), icon: Popcorn },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 flex items-center justify-between"
            >
              <div>
                <p className="text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-serif text-accent">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-primary" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
