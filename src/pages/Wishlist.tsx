import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Star, Wifi, Car, Coffee, HeartOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Mock data for wishlist
const mockWishlist = [
  {
    id: "1",
    title: "Luxury Penthouse Suite",
    location: "Manhattan, New York",
    price: 350,
    rating: 4.9,
    reviewCount: 127,
    image: "/placeholder.svg",
    category: "Apartment",
    amenities: ["Wifi", "Parking", "Kitchen"],
    hostName: "Alexander Smith",
    available: true
  },
  {
    id: "2", 
    title: "Charming Victorian House",
    location: "San Francisco, CA",
    price: 280,
    rating: 4.8,
    reviewCount: 89,
    image: "/placeholder.svg", 
    category: "House",
    amenities: ["Wifi", "Garden", "Fireplace"],
    hostName: "Emily Rose",
    available: true
  },
  {
    id: "3",
    title: "Seaside Villa with Pool",
    location: "Malibu, CA", 
    price: 500,
    rating: 4.95,
    reviewCount: 203,
    image: "/placeholder.svg",
    category: "Villa",
    amenities: ["Pool", "Wifi", "Ocean View"],
    hostName: "David Martinez",
    available: false
  }
];

const Wishlist = () => {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
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
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "parking":
      case "car":
        return <Car className="w-4 h-4" />;
      case "kitchen":
      case "coffee":
        return <Coffee className="w-4 h-4" />;
      default:
        return <span className="w-4 h-4 text-xs">•</span>;
    }
  };

  const removeFromWishlist = (id: string) => {
    // This would be implemented with real API calls
    console.log("Remove from wishlist:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
          <p className="text-muted-foreground">Spaces you've saved for later</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWishlist.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Category Badge */}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 left-3 bg-background/90 text-foreground"
                  >
                    {listing.category}
                  </Badge>
                  
                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-background/90 hover:bg-background text-red-500 hover:text-red-600"
                    onClick={() => removeFromWishlist(listing.id)}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>

                  {/* Availability Status */}
                  {!listing.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Currently Unavailable</Badge>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  {/* Rating and Location */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                      <span className="text-sm text-muted-foreground">({listing.reviewCount})</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      {listing.location}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {listing.title}
                  </h3>
                  
                  {/* Host */}
                  <p className="text-sm text-muted-foreground mb-3">
                    Hosted by {listing.hostName}
                  </p>
                  
                  {/* Amenities */}
                  <div className="flex items-center space-x-4 mb-4">
                    {listing.amenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-1 text-sm text-muted-foreground">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-foreground">${listing.price}</span>
                      <span className="text-sm text-muted-foreground">/night</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWishlist(listing.id)}
                      >
                        <HeartOff className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="primary"
                        disabled={!listing.available}
                      >
                        {listing.available ? "Book Now" : "Unavailable"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockWishlist.length === 0 && (
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