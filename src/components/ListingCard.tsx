import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MapPin, Clock, Users, Wifi, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { HighlightedText } from "@/components/ui/highlighted-text";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  images?: string[];
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
  images = [],
  category,
  amenities = [],
  hostName,
  searchQuery = "",
}: ListingCardProps) => {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.includes(id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Guard against nullish values from database
  const safeImages = Array.isArray(images) ? images : [];
  const safeAmenities = Array.isArray(amenities) ? amenities : [];
  const allImages = safeImages.length > 0 ? safeImages : [imageUrl || "/placeholder.svg"];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered && allImages.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 2000);
    } else if (!isHovered) {
      setCurrentImageIndex(0);
    }

    return () => clearInterval(interval);
  }, [isHovered, allImages.length]);

  return (
    <Link
      to={`/spaces/${id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="group cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 transform hover:-translate-y-2 border-none overflow-hidden h-full bg-card/50 backdrop-blur-md shadow-lg ring-1 ring-border/50 dark:ring-white/10 dark:bg-zinc-900/50">
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

          {/* Sliding Images Container */}
          <div
            className="flex transition-transform duration-700 ease-in-out h-full w-full"
            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
          >
            {allImages.map((img, idx) => (
              <div key={idx} className="min-w-full h-full relative">
                <img
                  src={img}
                  alt={`${title} - ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>

          {/* Image Navigation Indicators (Dots) */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    currentImageIndex === idx ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
                  )}
                />
              ))}
            </div>
          )}

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <div className="absolute inset-0 z-20 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none transition-transform active:scale-95"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 border-none transition-transform active:scale-95"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Top Actions */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-start z-20">
            <Badge className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur text-primary font-bold border-none shadow-premium hover:bg-white transition-colors px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider">
              {category}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className={`h-10 w-10 rounded-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur hover:bg-white shadow-premium transition-all duration-300 ${isWishlisted ? 'text-red-500 scale-110' : 'text-slate-600 dark:text-slate-300 hover:text-red-500'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(id);
              }}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : 'group-hover:scale-110 transition-transform'}`} />
            </Button>
          </div>

          {/* Featured Badge */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
            <div className="flex items-center space-x-1.5 bg-black/60 dark:bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/20">
              <Star className="w-2.5 h-2.5 fill-current" />
              <span>Premium Space</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1.5 bg-primary/10 dark:bg-primary/20 px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-xs font-black text-primary">{rating}</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">({reviewCount})</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground font-semibold">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="line-clamp-1 max-w-[120px]">
                <HighlightedText text={location} query={searchQuery} />
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="mb-6">
            <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">
              <HighlightedText text={title} query={searchQuery} />
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
              <HighlightedText text={description} query={searchQuery} />
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-auto pt-6 border-t border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-creative flex items-center justify-center border border-white/20 shadow-lg shadow-primary/20">
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-foreground">{hostName}</span>
                  <span className="text-[9px] text-primary font-black uppercase tracking-[0.15em] leading-none mt-1">Verified Host</span>
                </div>
              </div>
              <div className="flex items-center -space-x-2">
                {safeAmenities.slice(0, 3).map((amenity, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-secondary dark:bg-zinc-800 border-2 border-card flex items-center justify-center hover:z-10 transition-all hover:scale-110 cursor-help group/icon"
                    title={amenity}
                  >
                    {amenity === 'Wi-Fi' && <Wifi className="w-3.5 h-3.5 text-primary" />}
                    {amenity === 'Up to 8 people' && <Users className="w-3.5 h-3.5 text-primary" />}
                    {amenity === '24/7 Access' && <Clock className="w-3.5 h-3.5 text-primary" />}
                    {amenity !== 'Wi-Fi' && amenity !== 'Up to 8 people' && amenity !== '24/7 Access' && (
                      <div className="w-2 h-2 rounded-full bg-primary/40 group-hover/icon:bg-primary transition-colors" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="text-2xl font-black text-foreground tracking-tight">${price}</span>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.15em] leading-none mb-0.5">Premium</span>
                    <span className="text-[10px] font-bold text-muted-foreground leading-none">/ Night</span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                className="rounded-full px-6 h-10 font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 group/btn bg-primary hover:scale-[1.05]"
              >
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;