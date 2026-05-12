import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedListings from "@/components/FeaturedListings";
import Footer from "@/components/Footer";
import { useAuthState } from "@/hooks/useAuthState";

const Index = () => {
  const { user, loading, role } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role === 'host') {
      navigate('/host', { replace: true });
    }
  }, [user, loading, role, navigate]);

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background bg-dot-pattern">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedListings />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
