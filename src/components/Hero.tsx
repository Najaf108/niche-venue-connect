import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-marketplace.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [spaceType, setSpaceType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (spaceType) params.set("type", spaceType);
    navigate(`/browse-spaces?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image & Effects */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Creative rental spaces"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        {/* Decorative Blobs */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-creative/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center lg:text-left lg:mx-0">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6 reveal">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>New Spaces Added Daily</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight reveal-delayed-1">
            Discover Your Next
            <span className="block gradient-text">
              Creative Sanctuary
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground/80 mb-10 max-w-2xl reveal-delayed-2 leading-relaxed">
            From professional podcast studios to immersive gaming hubs.
            Find, book, and unlock the perfect space for your passion in minutes.
          </p>

          {/* Search Bar - Midnight Glassmorphism */}
          <div className="glass-card p-2 md:p-3 rounded-[2rem] reveal-delayed-3 max-w-3xl w-full mx-auto lg:mx-0 ring-1 ring-white/10 focus-within:ring-primary/40 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.2)] focus-within:bg-card/80 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              <div className="md:col-span-2 group">
                <div className="relative h-full flex items-center">
                  <MapPin className="absolute left-4 text-primary w-5 h-5 group-focus-within:scale-110 transition-transform" />
                  <Input
                    placeholder="Where to?"
                    className="pl-12 h-14 border-none bg-transparent focus-visible:ring-0 text-foreground font-medium placeholder:text-muted-foreground/60"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="hidden md:block w-px h-8 bg-border/50 self-center" />

              <div className="md:col-span-2 group">
                <div className="relative h-full flex items-center">
                  <Search className="absolute left-4 text-primary w-5 h-5 group-focus-within:scale-110 transition-transform" />
                  <Input
                    placeholder="What space?"
                    className="pl-12 h-14 border-none bg-transparent focus-visible:ring-0 text-foreground font-medium placeholder:text-muted-foreground/60"
                    value={spaceType}
                    onChange={(e) => setSpaceType(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>

              <div className="hidden md:block w-px h-8 bg-border/50 self-center" />

              <div className="md:col-span-2 p-1">
                <Button
                  className="w-full h-12 md:h-12 rounded-full font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 group/btn overflow-hidden relative"
                  onClick={handleSearch}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-creative opacity-100 group-hover:opacity-90 transition-opacity" />
                  <div className="relative flex items-center justify-center">
                    <Search className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                    <span>Search Spaces</span>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 reveal-delayed-3 opacity-60">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Trusted by:</span>
            <div className="flex items-center space-x-4 grayscale">
              <span className="text-sm font-black italic">PODCAST.hub</span>
              <span className="text-sm font-black tracking-tighter">GAME_SPACE</span>
              <span className="text-sm font-black">CREATIVE_CO</span>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Hero;
