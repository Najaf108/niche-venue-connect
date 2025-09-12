import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Star, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// Mock data for bookings
const mockBookings = [
  {
    id: "1",
    title: "Modern Downtown Loft",
    location: "New York, NY",
    dates: "March 15-20, 2024",
    guests: 2,
    status: "upcoming",
    price: "$150/night",
    total: "$750",
    image: "/placeholder.svg",
    rating: 4.8,
    host: "Sarah Johnson"
  },
  {
    id: "2",
    title: "Cozy Beach House",
    location: "Miami, FL", 
    dates: "February 10-15, 2024",
    guests: 4,
    status: "completed",
    price: "$200/night",
    total: "$1000",
    image: "/placeholder.svg",
    rating: 4.9,
    host: "Mike Chen"
  },
  {
    id: "3",
    title: "Mountain Cabin Retreat",
    location: "Aspen, CO",
    dates: "April 5-10, 2024",
    guests: 6,
    status: "cancelled",
    price: "$300/night",
    total: "$1500",
    image: "/placeholder.svg",
    rating: 4.7,
    host: "Emma Davis"
  }
];

const MyBookings = () => {
  const { user, loading } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your space reservations and booking history</p>
        </div>

        <div className="grid gap-6">
          {mockBookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-64 h-48 md:h-auto bg-muted flex items-center justify-center">
                    <img 
                      src={booking.image} 
                      alt={booking.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{booking.title}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {booking.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {booking.dates}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {booking.guests} guests
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            {booking.rating} • Hosted by {booking.host}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">{booking.price}</div>
                        <div className="text-lg font-semibold text-foreground">Total: {booking.total}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {booking.status === "upcoming" && (
                        <>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact Host
                          </Button>
                          <Button variant="destructive" size="sm">
                            Cancel Booking
                          </Button>
                        </>
                      )}
                      
                      {booking.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm">
                            View Receipt
                          </Button>
                          <Button variant="primary" size="sm">
                            Leave Review
                          </Button>
                          <Button variant="outline" size="sm">
                            Book Again
                          </Button>
                        </>
                      )}
                      
                      {booking.status === "cancelled" && (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {mockBookings.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No bookings yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Start exploring amazing spaces and make your first booking
                </p>
                <Button onClick={() => navigate('/browse-spaces')}>
                  Browse Spaces
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyBookings;