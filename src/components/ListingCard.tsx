import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, MapPin, Clock, Users, Wifi } from "lucide-react";
import { Card } from "@/components/ui/card";

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
}

const ListingCard = ({
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
}: ListingCardProps) => {
  return (
    <Card className="group cursor-pointer hover:shadow-[var(--shadow-hover)] transition-all duration-300 transform hover:-translate-y-1 border-border overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-3 right-3 bg-background/80 backdrop-blur hover:bg-background/90"
        >
          <Heart className="w-4 h-4" />
        </Button>
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
          {category}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating & Location */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span>{location}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>

        {/* Host */}
        <p className="text-xs text-muted-foreground mb-3">
          Hosted by <span className="font-medium">{hostName}</span>
        </p>

        {/* Amenities */}
        <div className="flex items-center space-x-3 mb-4 text-xs text-muted-foreground">
          {amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center space-x-1">
              {amenity === 'Wi-Fi' && <Wifi className="w-3 h-3" />}
              {amenity === 'Up to 8 people' && <Users className="w-3 h-3" />}
              {amenity === '24/7 Access' && <Clock className="w-3 h-3" />}
              <span>{amenity}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-foreground">${price}</span>
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>
          <Button variant="primary" size="sm">
            Book Now
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ListingCard;