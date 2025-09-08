import { Button } from "@/components/ui/button";
import { Search, Menu, User, Heart, Calendar } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-creative rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RS</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-creative bg-clip-text text-transparent">
              RentSpaces
            </span>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              Browse Spaces
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              List Your Space
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Calendar className="w-4 h-4 mr-2" />
              My Bookings
            </Button>

            <Button variant="primary" size="sm">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>

            {/* Mobile menu */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;