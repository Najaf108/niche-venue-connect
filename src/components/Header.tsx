import { Button } from "@/components/ui/button";
import { Search, Menu, User, Heart, Calendar, LogOut, Home, Info, LayoutDashboard, PlusCircle, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const { user, role } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleBackToHome = () => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.transition = 'opacity 300ms ease-out';
      mainContent.style.opacity = '0';
    }
    setTimeout(() => {
      if (user && role === 'host') {
        navigate('/host');
      } else {
        navigate('/');
      }
      // Reset opacity after navigation
      if (mainContent) {
        setTimeout(() => {
          mainContent.style.opacity = '1';
        }, 50);
      }
    }, 300);
  };

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
        });
      }
    } else {
      navigate('/auth');
    }
  };

  const NavItems = () => {
    const isActive = (path: string) => location.pathname === path;

    return (
      <>
        {role !== 'host' && (
          <button
            onClick={() => navigate('/browse-spaces')}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 font-medium",
              isActive('/browse-spaces')
                ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <Search className={cn("w-4 h-4", isActive('/browse-spaces') ? "text-primary" : "text-muted-foreground")} />
            <span>Browse Spaces</span>
          </button>
        )}
        <button
          onClick={() => navigate('/how-it-works')}
          className={cn(
            "flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 font-medium",
            isActive('/how-it-works')
              ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          )}
        >
          <Info className={cn("w-4 h-4", isActive('/how-it-works') ? "text-primary" : "text-muted-foreground")} />
          <span>How it Works</span>
        </button>

        {(role === 'host' || role === 'admin') && (
          <>
            <button
              onClick={() => navigate('/host')}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 font-medium",
                isActive('/host')
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <LayoutDashboard className={cn("w-4 h-4", isActive('/host') ? "text-primary" : "text-muted-foreground")} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => navigate('/list-space')}
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 font-medium",
                isActive('/list-space')
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              <PlusCircle className={cn("w-4 h-4", isActive('/list-space') ? "text-primary" : "text-muted-foreground")} />
              <span>List Your Space</span>
            </button>
          </>
        )}

        {role === 'admin' && (
          <button
            onClick={() => navigate('/admin')}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 font-medium",
              isActive('/admin')
                ? "bg-gradient-to-r from-primary to-creative text-white shadow-md scale-105"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <Settings className={cn("w-4 h-4", isActive('/admin') ? "text-white" : "text-muted-foreground")} />
            <span>Admin Dashboard</span>
          </button>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section: Back to Home + Logo */}
          <div className="flex items-center space-x-4">
            {/* Back to Home Button - Only show if not on home page/dashboard */}
            {((role !== 'host' && location.pathname !== '/') || (role === 'host' && location.pathname !== '/host')) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-all duration-300 group px-3 py-2 shadow-sm border border-transparent hover:border-primary/20"
                aria-label={role === 'host' ? "Return to dashboard" : "Return to home page"}
              >
                {role === 'host' ? (
                  <LayoutDashboard className="w-4 h-4 transition-transform group-hover:scale-110 text-primary/70" />
                ) : (
                  <Home className="w-4 h-4 transition-transform group-hover:scale-110 text-primary/70" />
                )}
                <span className="font-bold text-sm hidden sm:inline">
                  {role === 'host' ? 'Back to Dashboard' : 'Back to Home'}
                </span>
              </Button>
            )}

            {/* Logo */}
            <div
              className={`flex items-center space-x-2 cursor-pointer transition-transform hover:scale-105 ${location.pathname === '/' || (role === 'host' && location.pathname === '/host') ? 'flex' : 'hidden sm:flex'}`}
              onClick={() => {
                if (user && role === 'host') {
                  navigate('/host');
                } else {
                  navigate('/');
                }
              }}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-creative rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-black text-base">RS</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-primary to-creative bg-clip-text text-transparent tracking-tight">
                RentSpaces
              </span>
            </div>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavItems />
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {user && role !== 'host' && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hidden lg:flex items-center space-x-2 rounded-full transition-all duration-300 font-bold px-4",
                  location.pathname === '/wishlist'
                    ? "bg-red-500/10 text-red-400 shadow-sm ring-1 ring-red-500/20"
                    : "text-muted-foreground hover:text-red-400 hover:bg-red-500/5"
                )}
                onClick={() => navigate('/wishlist')}
              >
                <Heart className={cn("w-4 h-4", location.pathname === '/wishlist' ? "fill-current" : "")} />
                <span>Wishlist</span>
              </Button>
            )}

            {user && role !== 'host' && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hidden lg:flex items-center space-x-2 rounded-full transition-all duration-300 font-bold px-4",
                  location.pathname === '/my-bookings'
                    ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => navigate('/my-bookings')}
              >
                <Calendar className="w-4 h-4" />
                <span>My Bookings</span>
              </Button>
            )}

            <Button
              variant={user ? "ghost" : "primary"}
              size="sm"
              onClick={handleAuthClick}
              className={cn(
                "hidden sm:flex rounded-full font-bold px-5 transition-all duration-300",
                user
                  ? "text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20"
                  : "bg-gradient-to-r from-primary to-creative hover:opacity-90 shadow-lg shadow-primary/20 hover:shadow-primary/40 text-white"
              )}
            >
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden rounded-full hover:bg-primary/5">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] rounded-l-[2rem] border-l-0 shadow-2xl">
                <SheetHeader className="pb-6 border-b border-border/50">
                  <SheetTitle className="text-left flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-creative rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">RS</span>
                    </div>
                    <span className="text-xl font-black bg-gradient-to-r from-primary to-creative bg-clip-text text-transparent">Menu</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="space-y-2 flex flex-col">
                    <NavItems />
                  </div>
                  <div className="pt-6 border-t border-border/50 space-y-3">
                    {user && role !== 'host' && (
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start rounded-xl px-4 py-6 font-bold transition-all",
                            location.pathname === '/wishlist' ? "bg-red-500/10 text-red-400" : "hover:bg-red-500/5 hover:text-red-400"
                          )}
                          onClick={() => navigate('/wishlist')}
                        >
                          <Heart className={cn("w-5 h-5 mr-3", location.pathname === '/wishlist' ? "fill-current" : "")} />
                          Wishlist
                        </Button>
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start rounded-xl px-4 py-6 font-bold transition-all",
                            location.pathname === '/my-bookings' ? "bg-primary/10 text-primary" : "hover:bg-primary/5 hover:text-primary"
                          )}
                          onClick={() => navigate('/my-bookings')}
                        >
                          <Calendar className="w-5 h-5 mr-3" />
                          My Bookings
                        </Button>
                      </div>
                    )}
                    <Button
                      variant={user ? "outline" : "primary"}
                      className={cn(
                        "w-full rounded-xl py-6 font-bold shadow-sm transition-all",
                        !user && "bg-gradient-to-r from-primary to-creative text-white hover:opacity-90 shadow-lg shadow-primary/20"
                      )}
                      onClick={handleAuthClick}
                    >
                      {user ? (
                        <>
                          <LogOut className="w-5 h-5 mr-3" />
                          Sign Out
                        </>
                      ) : (
                        <>
                          <User className="w-5 h-5 mr-3" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;