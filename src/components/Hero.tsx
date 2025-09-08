import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import heroImage from "@/assets/hero-marketplace.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Creative rental spaces" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Rent Creative Spaces
            <span className="block bg-gradient-to-r from-primary to-creative bg-clip-text text-transparent">
              For Every Purpose
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Discover unique rental spaces for gaming, podcasting, art creation, meetings, and more. 
            Book by the hour or day in your area.
          </p>

          {/* Search Bar */}
          <div className="bg-card/95 backdrop-blur rounded-2xl p-6 shadow-[var(--shadow-card)] border border-border/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Where
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="City, neighborhood, or address"
                    className="pl-10 h-12 border-border bg-background"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  When
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Select dates"
                    className="pl-10 h-12 border-border bg-background"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Space Type
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    placeholder="Gaming, Studio..."
                    className="pl-10 h-12 border-border bg-background"
                  />
                </div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full md:w-auto mt-6 h-12 px-8"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Spaces
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;