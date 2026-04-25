import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Star, MessageCircle, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatService } from "@/services/ChatService";

interface ListingDetails {
  id: string;
  title: string;
  location: string;
  images: string[] | null;
  user_id: string;
}

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  listing: ListingDetails | null;
}

const MyBookings = () => {
  const { user, loading: authLoading } = useAuthState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingForChat, setSelectedBookingForChat] = useState<Booking | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchBookings();
      const channel = ChatService.subscribeToUserUnreadMessages(user.id, () => {
        fetchUnreadCounts();
      });
      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, authLoading, navigate]);

  const fetchUnreadCounts = async () => {
    if (!user || bookings.length === 0) return;
    const bookingIds = bookings.map(b => b.id);
    const counts = await ChatService.getUnreadCount(user.id, bookingIds);
    setUnreadCounts(counts);
  };


  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('bookings')
        .select(`
          id,
          start_date,
          end_date,
          total_amount,
          status,
          listing:listings (
            id,
            title,
            location,
            images,
            user_id
          )
        `)
        .eq('guest_id', user!.id)
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Transform data to match interface if needed (Supabase returns array or object)
      // The select query above returns listing as an object (single relation) because of foreign key
      setBookings(data as any || []);

      // Fetch Unread Counts
      const bookingIds = (data as any[] || []).map(b => b.id);
      if (user && bookingIds.length > 0) {
        const counts = await ChatService.getUnreadCount(user.id, bookingIds);
        setUnreadCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Could not load your bookings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = (booking: Booking) => {
    if (!booking.listing) return;
    setSelectedBookingForChat(booking);
  };

  const handleMarkCompleted = async (booking: Booking) => {
    if (!booking.listing) return;
    try {
      const { error } = await (supabase as any).from('bookings')
        .update({ status: 'completed' })
        .eq('id', booking.id);

      if (error) throw error;

      // Update local state without fetching again
      setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: 'completed' } : b));

      // Route to review page
      navigate(`/leave-review/${booking.listing.id}`);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to complete booking: " + error.message, variant: "destructive" });
    }
  };

  if (authLoading || (loading && !bookings.length)) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  const getStatusColor = (status: string) => {

    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "completed":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Manage your upcoming and past reservations</p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="group overflow-hidden border-none bg-card/50 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ring-1 ring-border/50">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-72 h-56 md:h-auto relative overflow-hidden">
                    <img
                      src={booking.listing?.images?.[0] || "/placeholder.svg"}
                      alt={booking.listing?.title || "Space"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 md:hidden">
                      <Badge className={`backdrop-blur-md shadow-sm border-none font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-3">
                          <h3 className="text-2xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                            {booking.listing?.title || 'Space Unavailable'}
                          </h3>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-muted-foreground text-sm font-medium">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <MapPin className="w-4 h-4 text-primary" />
                              </div>
                              {booking.listing?.location || 'Location hidden'}
                            </div>
                            <div className="flex items-center text-muted-foreground text-sm font-medium">
                              <div className="w-8 h-8 rounded-full bg-creative/10 flex items-center justify-center mr-3">
                                <Calendar className="w-4 h-4 text-creative" />
                              </div>
                              <span className="text-foreground font-bold">
                                {format(new Date(booking.start_date), 'MMM dd')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`hidden md:flex backdrop-blur-md shadow-sm border-none font-bold px-4 py-1.5 rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Paid</span>
                        <div className="text-2xl font-black text-foreground tracking-tight">${booking.total_amount}</div>
                      </div>

                      <div className="flex gap-3">
                        {booking.listing && (
                          <Button
                            variant="outline"
                            className="rounded-full font-bold border-primary/20 hover:border-primary hover:bg-primary/5 transition-all"
                            onClick={() => navigate(`/spaces/${booking.listing?.id}`)}
                          >
                            View Space
                          </Button>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            className="rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                            onClick={() => handleOpenChat(booking)}
                          >
                            <div className="relative flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              <span>Message Host</span>
                              {unreadCounts[booking.id] > 0 && (
                                <span className="absolute -top-3 -right-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                                  {unreadCounts[booking.id]}
                                </span>
                              )}
                            </div>
                          </Button>
                        )}
                        {booking.status === 'confirmed' && new Date(booking.end_date) < new Date() && (
                          <Button
                            className="rounded-full font-bold bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all"
                            onClick={() => handleMarkCompleted(booking)}
                          >
                            Mark Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {bookings.length === 0 && (
            <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground mb-6">
                Start exploring amazing spaces and make your first booking
              </p>
              <Button onClick={() => navigate('/browse-spaces')}>
                Browse Spaces
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Chat Window */}
      {selectedBookingForChat && user && selectedBookingForChat.listing && (
        <ChatWindow
          bookingId={selectedBookingForChat.id}
          currentUserId={user.id}
          otherUserId={selectedBookingForChat.listing.user_id}
          otherUserName="Host"
          isOpen={!!selectedBookingForChat}
          onClose={() => setSelectedBookingForChat(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default MyBookings;