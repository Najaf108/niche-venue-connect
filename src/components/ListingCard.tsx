import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MapPin, Clock, Users, Wifi } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { HighlightedText } from "@/components/ui/highlighted-text";
import { useWishlist } from "@/hooks/useWishlist";

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  category: string;
  amenities: string[];
  hostName: string;
  searchQuery?: string;
}

const ListingCard = ({
  id,
  title,
  description,
  location,
  price,
  rating,
  reviewCount,
  imageUrl,
  category,
  amenities,
  hostName,
  searchQuery = "",
}: ListingCardProps) => {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.includes(id);

  return (
    <Link to={`/spaces/${id}`}>
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border-none overflow-hidden h-full bg-card/50 backdrop-blur-sm shadow-lg ring-1 ring-border/50">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />

          {/* Top Actions */}
          <div className="absolute top-3 inset-x-3 flex justify-between items-start z-20">
            <Badge className="bg-white/90 backdrop-blur text-primary font-semibold border-none shadow-sm hover:bg-white transition-colors px-2.5 py-1">
              {category}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-full bg-white/90 backdrop-blur hover:bg-white shadow-sm transition-all duration-300 ${isWishlisted ? 'text-red-500' : 'text-slate-600 hover:text-red-500'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(id);
              }}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`} />
            </Button>
          </div>

          {/* Bottom Badge (Optional/Hover) */}
          <div className="absolute bottom-3 left-3 z-20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="flex items-center space-x-1 bg-primary/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
              <span>Featured Space</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col h-[calc(100%-16/10*100%)]">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1.5 bg-accent/10 px-2 py-0.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="text-xs font-bold text-accent-foreground">{rating}</span>
              <span className="text-[10px] text-muted-foreground font-medium">({reviewCount} reviews)</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground font-medium">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="line-clamp-1 max-w-[120px]">
                <HighlightedText text={location} query={searchQuery} />
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="flex-grow">
            <h3 className="text-lg font-bold text-foreground mb-1.5 line-clamp-1 group-hover:text-primary transition-colors duration-300">
              <HighlightedText text={title} query={searchQuery} />
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              <HighlightedText text={description} query={searchQuery} />
            </p>
          </div>

          {/* Footer Info */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            {/* Host & Amenities */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary/20 to-creative/20 flex items-center justify-center border border-primary/10">
                  <Users className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[11px] text-muted-foreground font-medium italic">
                  By <span className="text-foreground not-italic">{hostName}</span>
                </span>
              </div>
              <div className="flex items-center -space-x-1">
                {amenities.slice(0, 3).map((amenity, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center hover:z-10 transition-transform hover:scale-110 cursor-help"
                    title={amenity}
                  >
                    {amenity === 'Wi-Fi' && <Wifi className="w-3 h-3 text-primary" />}
                    {amenity === 'Up to 8 people' && <Users className="w-3 h-3 text-primary" />}
                    {amenity === '24/7 Access' && <Clock className="w-3 h-3 text-primary" />}
                    {amenity !== 'Wi-Fi' && amenity !== 'Up to 8 people' && amenity !== '24/7 Access' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-foreground tracking-tight">${price}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">/ Night</span>
                </div>
              </div>
              <Button
                size="sm"
                className="rounded-full px-5 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group/btn"
              >
                <span>Details</span>
                <div className="w-0 group-hover/btn:w-2 transition-all duration-300" />
                <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white border-b-[4px] border-b-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;