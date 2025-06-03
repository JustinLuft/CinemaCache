import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Film, 
  Popcorn, 
  Clapperboard,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MovieList from "@/components/MovieList";
import PromptGenerator from "@/components/PromptGenerator";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Background grain effect */}
      <div className="fixed inset-0 film-grain" aria-hidden="true" />
      
      {/* Main content */}
      <main className="container mx-auto relative z-10">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif text-foreground mb-2">
            Welcome to Your Cinema
          </h1>
          <p className="text-muted-foreground">
            Manage your movie collection and generate creative prompts
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Button className="glow-hover" variant="default">
            <Plus className="mr-2 h-4 w-4" />
            Add New Movie
          </Button>
          <Button variant="secondary">
            <Clapperboard className="mr-2 h-4 w-4" />
            Generate Prompt
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="movies" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="movies" className="data-[state=active]:bg-primary">
              <Film className="mr-2 h-4 w-4" />
              Your Movies
            </TabsTrigger>
            <TabsTrigger value="prompts" className="data-[state=active]:bg-primary">
              <Popcorn className="mr-2 h-4 w-4" />
              Prompt Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="movies" className="space-y-4">
            <div className="grid gap-6">
              <MovieList />
            </div>
          </TabsContent>

          <TabsContent value="prompts">
            <div className="bg-card rounded-lg border border-border p-6">
              <PromptGenerator />
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Total Movies", value: "42", icon: Film },
            { label: "Prompts Generated", value: "15", icon: Clapperboard },
            { label: "Favorites", value: "8", icon: Popcorn }
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
