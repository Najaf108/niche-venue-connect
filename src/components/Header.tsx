import { Button } from "@/components/ui/button";
import { Search, Menu, User, Heart, Calendar, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { user } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthClick = async () => {
    if (user) {
      try {
        await supabase.auth.signOut();
        toast({
          title: "Signed Out",
          description: "You have been successfully signed out.",
        });
      } catch (error) {
        toast({
          title: "Sign Out Error",
          description: "An error occurred while signing out.",
          variant: "destructive",
        });
      }
    } else {
      navigate('/auth');
    }
  };

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
            <button 
              onClick={() => navigate('/browse-spaces')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Browse Spaces
            </button>
            <button 
              onClick={() => navigate('/how-it-works')}
              className="text-foreground hover:text-primary transition-colors"
            >
              How it Works
            </button>
            <button 
              onClick={() => navigate('/list-space')}
              className="text-foreground hover:text-primary transition-colors"
            >
              List Your Space
            </button>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex"
              onClick={() => navigate('/my-bookings')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              My Bookings
            </Button>

            <Button variant="primary" size="sm" onClick={handleAuthClick}>
              {user ? (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
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