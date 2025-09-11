import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Users, Star, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  space_type: string;
  max_guests: number;
  images: string[];
  amenities: string[];
  user_id: string;
  is_active: boolean;
  created_at: string;
}

const BrowseSpaces = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Gaming Room", label: "Gaming Rooms" },
    { value: "Podcast Studio", label: "Podcast Studios" },
    { value: "Art Studio", label: "Art Studios" },
    { value: "Meeting Room", label: "Meeting Rooms" },
    { value: "Music Studio", label: "Music Studios" },
    { value: "Photo Studio", label: "Photo Studios" },
    { value: "Fitness Space", label: "Fitness Spaces" },
    { value: "Study Room", label: "Study Rooms" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-25", label: "$0 - $25" },
    { value: "26-50", label: "$26 - $50" },
    { value: "51-100", label: "$51 - $100" },
    { value: "100+", label: "$100+" },
  ];

  const sortOptions = [
    { value: "created_at", label: "Newest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "title", label: "Alphabetical" },
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchTerm, selectedCategory, priceRange, sortBy]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: "Error",
        description: "Failed to load spaces. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortListings = () => {
    let filtered = [...listings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(listing => listing.space_type === selectedCategory);
    }

    // Price filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      filtered = filtered.filter(listing => {
        const price = listing.price_per_night;
        if (priceRange === "100+") {
          return price >= 100;
        }
        return price >= parseInt(min) && price <= parseInt(max);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price_per_night - b.price_per_night;
        case "price_desc":
          return b.price_per_night - a.price_per_night;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredListings(filtered);
  };

  const getImageUrl = (listing: Listing) => {
    if (listing.images && listing.images.length > 0) {
      return listing.images[0];
    }
    // Fallback images based on space type
    const fallbackImages: { [key: string]: string } = {
      "Gaming Room": "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=800&q=80",
      "Podcast Studio": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
      "Art Studio": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80",
      "Meeting Room": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "Music Studio": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80",
      "Photo Studio": "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?auto=format&fit=crop&w=800&q=80",
      "Fitness Space": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
      "Study Room": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
    };
    return fallbackImages[listing.space_type] || fallbackImages["Meeting Room"];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Browse Creative Spaces
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover unique spaces perfect for your next project, meeting, or creative endeavor
              </p>
            </div>

            {/* Search and Filters */}
            <div className="max-w-4xl mx-auto bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search spaces..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {filteredListings.length} space{filteredListings.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </section>

        {/* Listings Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-muted rounded-xl h-48 mb-4"></div>
                    <div className="bg-muted rounded h-4 mb-2"></div>
                    <div className="bg-muted rounded h-4 w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-2xl font-semibold mb-2 text-foreground">No spaces found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange("all");
                  }}
                  variant="outline"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={getImageUrl(listing)}
                        alt={listing.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Badge className="absolute bottom-2 left-2 bg-primary text-primary-foreground">
                        {listing.space_type}
                      </Badge>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {listing.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>New</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{listing.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Users className="w-4 h-4 mr-1" />
                        <span>Up to {listing.max_guests} people</span>
                      </div>
                      
                      {listing.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {listing.description}
                        </p>
                      )}
                      
                      {listing.amenities && listing.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {listing.amenities.slice(0, 2).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {listing.amenities.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{listing.amenities.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <div>
                          <span className="text-lg font-bold text-foreground">
                            ${listing.price_per_night}
                          </span>
                          <span className="text-sm text-muted-foreground">/night</span>
                        </div>
                        <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseSpaces;