import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center p-8 bg-card rounded-2xl shadow-[var(--shadow-card)] border border-border max-w-md w-full mx-4">
          <h1 className="mb-4 text-6xl font-bold bg-gradient-to-r from-primary to-creative bg-clip-text text-transparent">404</h1>
          <p className="mb-8 text-xl text-muted-foreground">Oops! The space you're looking for doesn't exist.</p>
          <Link 
            to="/" 
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
