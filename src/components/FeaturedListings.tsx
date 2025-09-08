import ListingCard from "./ListingCard";
import { Button } from "@/components/ui/button";

const featuredListings = [
  {
    id: "1",
    title: "Ultimate Gaming Paradise",
    description: "Professional gaming setup with RTX 4090, 144Hz monitors, and premium gaming chairs. Perfect for streaming or tournaments.",
    location: "Downtown",
    price: 25,
    rating: 4.9,
    reviewCount: 124,
    imageUrl: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=800&q=80",
    category: "Gaming Room",
    amenities: ["Wi-Fi", "Up to 8 people", "24/7 Access"],
    hostName: "Alex Chen",
  },
  {
    id: "2", 
    title: "Professional Podcast Studio",
    description: "Acoustically treated studio with professional mics, mixing board, and recording equipment. Ideal for podcasts and interviews.",
    location: "Arts District",
    price: 35,
    rating: 4.8,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    category: "Podcast Studio",
    amenities: ["Wi-Fi", "Up to 4 people", "Recording Equipment"],
    hostName: "Sarah Johnson",
  },
  {
    id: "3",
    title: "Bright Art Studio Space",
    description: "Spacious studio with natural light, easels, and art supplies included. Perfect for painting, drawing, or creative workshops.",
    location: "Creative Quarter", 
    price: 20,
    rating: 4.7,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80",
    category: "Art Studio",
    amenities: ["Wi-Fi", "Up to 12 people", "Art Supplies"],
    hostName: "Maria Rodriguez",
  },
  {
    id: "4",
    title: "Modern Meeting Room",
    description: "Professional meeting space with 75\" screen, whiteboard, and video conferencing setup. Great for team meetings and presentations.",
    location: "Business District",
    price: 40,
    rating: 4.9,
    reviewCount: 203,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    category: "Meeting Room",
    amenities: ["Wi-Fi", "Up to 10 people", "AV Equipment"],
    hostName: "David Kim",
  },
];

const FeaturedListings = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Featured Spaces
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover the most popular rental spaces in your area
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex">
            View All Spaces
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>

        <div className="text-center mt-12 md:hidden">
          <Button variant="primary" size="lg">
            View All Spaces
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;