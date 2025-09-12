import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ListSpace from "./pages/ListSpace";
import BrowseSpaces from "./pages/BrowseSpaces";
import MyBookings from "./pages/MyBookings";
import Wishlist from "./pages/Wishlist";
import Terms from "./pages/Terms";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/list-space" element={<ListSpace />} />
          <Route path="/browse-spaces" element={<BrowseSpaces />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
