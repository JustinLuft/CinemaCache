import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface AddMovieFormProps {
  onAdd: (movie: {
    title: string;
    watchedDate: string;
    rating: number;
    type: "watched" | "watchlist";
    image?: string;
  }) => void;
  onClose: () => void;
}

const AddMovieForm: React.FC<AddMovieFormProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState("");
  const [watchedDate, setWatchedDate] = useState("");
  const [rating, setRating] = useState(5);
  const [type, setType] = useState<"watched" | "watchlist">("watched");
  const [image, setImage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !watchedDate || !rating || loading) return;

    setLoading(true);

    await onAdd({
      title,
      watchedDate,
      rating,
      type,
      image: image.trim() || undefined,
    });

    setSubmitted(true);
    setLoading(false);

    setTimeout(() => setSubmitted(false), 2000);

    setTitle("");
    setWatchedDate("");
    setRating(5);
    setType("watched");
    setImage("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border p-6 rounded-xl max-w-md w-full space-y-5 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white">Add New Movie</h2>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Movie Title
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Date Watched
          </label>
          <input
            type="date"
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            value={watchedDate}
            onChange={(e) => setWatchedDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Rating:{" "}
            <span className="text-white font-medium">{rating}</span>/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={1}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "watched" | "watchlist")}
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="watched">Watched</option>
            <option value="watchlist">Watchlist</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            placeholder="https://example.com/poster.jpg"
            className="w-full px-4 py-2 rounded-lg bg-neutral-800 text-white border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Movie"}
          </Button>
        </div>

        {submitted && (
          <div className="text-sm text-green-400 mt-2 text-center animate-pulse">
            ✅ Movie added to your collection!
          </div>
        )}
      </form>
    </div>
  );
};

export default AddMovieForm;
