import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Wifi, Car, Coffee, HeartOff, Clock, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/context/SearchContext";
import { useWishlist } from "@/hooks/useWishlist";

const Wishlist = () => {
  const { user, loading: authLoading } = useAuthState();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchWishlistItems();
    }
  }, [user, authLoading, navigate]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          listing_id,
          listings (*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      if (data) {
        const listings = data
          .map((item: any) => item.listings)
          .filter((listing: any) => listing !== null);
        setWishlistItems(listings);
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(id);
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (a.includes("parking") || a.includes("car")) return <Car className="w-4 h-4" />;
    if (a.includes("kitchen") || a.includes("coffee")) return <Coffee className="w-4 h-4" />;
    if (a.includes("access") || a.includes("clock")) return <Clock className="w-4 h-4" />;
    if (a.includes("people") || a.includes("guests")) return <Users className="w-4 h-4" />;
    return <span className="w-4 h-4 text-xs">•</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">Spaces you've saved for later</p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((listing) => (
              <Card 
                key={listing.id} 
                className="overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onClick={() => navigate(`/spaces/${listing.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    <img 
                      src={listing.images?.[0] || "/placeholder.svg"} 
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Category Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 left-3 bg-background/90 text-foreground"
                    >
                      {listing.space_type}
                    </Badge>
                    
                    {/* Wishlist Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-3 right-3 bg-background/90 hover:bg-background text-red-500 hover:text-red-600"
                      onClick={(e) => handleRemove(e, listing.id)}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>

                    {/* Availability Status */}
                    {!listing.is_active && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Currently Unavailable</Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    {/* Rating and Location */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-sm text-muted-foreground">(12)</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground max-w-[150px]">
                        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{listing.location}</span>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {listing.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                    
                    {/* Amenities */}
                    <div className="flex items-center space-x-4 mb-4">
                      {listing.amenities?.slice(0, 3).map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-1 text-sm text-muted-foreground">
                          {getAmenityIcon(amenity)}
                          <span className="truncate max-w-[60px]">{amenity}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Price and Actions */}
                    <div className="flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-lg font-bold text-foreground">${listing.price_per_night}</span>
                        <span className="text-sm text-muted-foreground">/night</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleRemove(e, listing.id)}
                        >
                          <HeartOff className="w-4 h-4" />
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="secondary"
                          disabled={!listing.is_active}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/spaces/${listing.id}`);
                          }}
                        >
                          {listing.is_active ? "View" : "Unavailable"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring and save your favorite spaces for later
            </p>
            <Button onClick={() => navigate('/browse-spaces')}>
              Browse Spaces
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;