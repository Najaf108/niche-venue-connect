import { useState } from "react";
import { MapPin, Users, Star, Heart, List } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSearch, Listing } from "@/context/SearchContext";
import { FiltersSidebar } from "@/components/search/FiltersSidebar";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HighlightedText } from "@/components/ui/highlighted-text";
import { useWishlist } from "@/hooks/useWishlist";

const BrowseSpaces = () => {
  const { listings, loading, filters } = useSearch();
  const { wishlistIds, toggleWishlist } = useWishlist();

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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-16 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 sticky top-16 bg-background z-20 border-b flex justify-between items-center">
          <h1 className="font-semibold text-lg">{listings.length} spaces found</h1>
        </div>

        <div className="container mx-auto px-4 lg:px-6 py-6 flex-1 flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FiltersSidebar />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* List View */}
            <div className="block">
              {/* Mobile Filters Trigger could go here */}

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
              ) : listings.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-2xl font-semibold mb-2 text-foreground">No spaces found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search criteria or filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {listings.map((listing) => (
                    <Link to={`/spaces/${listing.id}`} key={listing.id}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                        <div className="relative overflow-hidden rounded-t-xl">
                          <img
                            src={getImageUrl(listing)}
                            alt={listing.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`absolute top-2 right-2 bg-white/90 backdrop-blur hover:bg-white transition-colors ${wishlistIds.includes(listing.id) ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleWishlist(listing.id);
                            }}
                          >
                            <Heart className={`w-4 h-4 ${wishlistIds.includes(listing.id) ? 'fill-current' : ''}`} />
                          </Button>
                          <Badge className="absolute bottom-2 left-2 bg-primary text-primary-foreground">
                            {listing.space_type}
                          </Badge>
                          {listing.instant_booking && (
                            <Badge variant="secondary" className="absolute bottom-2 right-2 bg-green-100 text-green-800">
                              Instant
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              <HighlightedText text={listing.title} query={filters.location} />
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground font-medium">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 mr-1" />
                              <span>
                                {(() => {
                                  const reviews = listing.reviews || [];
                                  if (reviews.length === 0) return "New";
                                  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                                  return (
                                    <span className="flex items-center gap-1">
                                      {avg.toFixed(1)} <span className="font-normal opacity-70">({reviews.length})</span>
                                    </span>
                                  );
                                })()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="line-clamp-1">
                              <HighlightedText text={listing.location} query={filters.location} />
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            <HighlightedText text={listing.description} query={filters.location} />
                          </p>

                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <Users className="w-4 h-4 mr-1" />
                            <span>Up to {listing.max_guests} people</span>
                          </div>

                          {listing.distance !== undefined && (
                            <div className="text-xs text-muted-foreground mb-2">
                              {listing.distance.toFixed(1)} km away
                            </div>
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
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BrowseSpaces;
