import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ListSpace from "./pages/ListSpace";
import BrowseSpaces from "./pages/BrowseSpaces";
import SpaceDetails from "./pages/SpaceDetails";
import MyBookings from "./pages/MyBookings";
import Wishlist from "./pages/Wishlist";
import Terms from "./pages/Terms";
import HowItWorks from "./pages/HowItWorks";
import LeaveReview from "./pages/LeaveReview";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HostDashboard from "./pages/host/HostDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import { SearchProvider } from "./context/SearchContext";

const App: React.FC = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SearchProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse-spaces" element={<BrowseSpaces />} />
            <Route path="/spaces/:id" element={<SpaceDetails />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/how-it-works" element={<HowItWorks />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/leave-review/:id" element={<LeaveReview />} />
            </Route>

            {/* Host Routes */}
            <Route element={<ProtectedRoute allowedRoles={['host', 'admin']} />}>
              <Route path="/list-space" element={<ListSpace />} />
              <Route path="/edit-space/:id" element={<ListSpace />} />
              <Route path="/host" element={<HostDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SearchProvider>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;

