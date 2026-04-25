import { useState, useEffect } from "react";
import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Listing {
  id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  space_type: string;
  max_guests: number;
  images: string[];
  amenities?: string[];
  user_id: string;
  is_active: boolean;
  created_at: string;
  reviews?: { rating: number }[];
}

const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          reviews(rating)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        throw error;
      }

      setListings((data as any) || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatListings = listings.map(listing => {
    const reviews = listing.reviews || [];
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0
      ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount
      : 0;

    return {
      id: listing.id,
      title: listing.title,
      description: listing.description || "",
      location: listing.location,
      price: listing.price_per_night,
      rating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviewCount,
      imageUrl: listing.images && listing.images.length > 0 ? listing.images[0] : "/placeholder.svg",
      category: listing.space_type,
      amenities: listing.amenities || [],
      hostName: "Host", // We don't have host names yet
    };
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Spaces
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover the latest user-submitted rental spaces
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden md:flex"
            onClick={() => navigate('/browse-spaces')}
          >
            View All Spaces
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : formatListings.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-4">No spaces available yet</h3>
            <p className="text-muted-foreground mb-6">
              Be the first to list your space on our platform!
            </p>
            <Button onClick={() => navigate('/list-space')}>
              List Your Space
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formatListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/browse-spaces')}
          >
            View All Spaces
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;