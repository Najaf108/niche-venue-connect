import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/Header";
import { DollarSign, Users, Home, Calendar as CalendarIcon, Loader2, MapPin, Bell, Check, X, Edit, MessageCircle } from "lucide-react";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { Listing } from "@/context/SearchContext";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatService } from "@/services/ChatService";

interface Booking {
  id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  created_at: string;
  listing_id: string;
  guest_id: string;
  listings: {
    title: string;
    images: string[];
    location: string;
  };
  profiles: {
    display_name: string;
    email?: string;
  };
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata?: any;
}

const HostDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedBookingForChat, setSelectedBookingForChat] = useState<Booking | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({
    revenue: 0,
    activeListings: 0,
    pendingBookings: 0,
    totalGuests: 0
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchDashboardData();
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch Listings
      const { data: listingsData, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      setListings((listingsData as Listing[]) || []);

      // Fetch Bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          listings (
            title,
            images,
            location
          )
        `)
        .eq('host_id', user!.id)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      const bookingsList = (bookingsData as any[]) || [];

      // Fetch Profiles manually since no FK relationship exists for auto-join
      const guestIds = Array.from(new Set(bookingsList.map(b => b.guest_id).filter(Boolean)));

      let profilesMap: Record<string, any> = {};

      if (guestIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .in('user_id', guestIds);

        if (!profilesError && profilesData) {
          profilesData.forEach((p: any) => {
            profilesMap[p.user_id] = p;
          });
        }
      }

      // Merge profiles into bookings
      const bookingsWithProfiles = bookingsList.map(b => ({
        ...b,
        profiles: profilesMap[b.guest_id] || { display_name: 'Guest', email: '' }
      }));

      setBookings(bookingsWithProfiles as Booking[]);

      // Fetch Unread Counts
      const bookingIds = (bookingsWithProfiles as any[]).map(b => b.id);
      if (user && bookingIds.length > 0) {
        const counts = await ChatService.getUnreadCount(user.id, bookingIds);
        setUnreadCounts(counts);
      }

      // Fetch Notifications
      const { data: notificationsData, error: notificationsError } = await (supabase as any)
        .from('notifications')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (notificationsError) throw notificationsError;
      setNotifications((notificationsData as Notification[]) || []);

      // Calculate Stats
      const confirmedBookings = bookingsWithProfiles.filter(b => b.status === 'confirmed' || b.status === 'completed');
      const revenue = confirmedBookings.reduce((sum, b) => sum + b.total_amount, 0);
      const activeCount = (listingsData as Listing[])?.filter(l => l.is_active).length || 0;
      const pendingCount = bookingsWithProfiles.filter(b => b.status === 'pending').length;
      const uniqueGuests = new Set(bookingsWithProfiles.map(b => b.guest_id)).size;

      setStats({
        revenue,
        activeListings: activeCount,
        pendingBookings: pendingCount,
        totalGuests: uniqueGuests
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Could not load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      if (unreadIds.length === 0) return;

      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .in('id', unreadIds);

      if (error) throw error;

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: newStatus === 'confirmed' ? "Booking Approved" : "Booking Declined",
        description: newStatus === 'confirmed'
          ? "The booking has been confirmed and revenue updated."
          : "The booking has been declined.",
        variant: newStatus === 'confirmed' ? "default" : "destructive",
      });

      // Refresh dashboard data to update stats and UI
      fetchDashboardData();
    } catch (error) {
      console.error(`Error updating booking to ${newStatus}:`, error);
      toast({
        title: "Error",
        description: "Failed to update booking status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'notifications') {
      markNotificationsAsRead();
    }
  };

  const toggleListingStatus = async (listingId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_active: !currentStatus })
        .eq('id', listingId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Listing is now ${!currentStatus ? 'Active' : 'Inactive'}.`,
      });

      // Update local state and refresh data
      setListings(prev => prev.map(l =>
        l.id === listingId ? { ...l, is_active: !currentStatus } : l
      ));
      fetchDashboardData();
    } catch (error) {
      console.error("Error toggling listing status:", error);
      toast({
        title: "Error",
        description: "Failed to update listing status.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Host Dashboard</h1>
          <Button onClick={() => navigate('/list-space')}>
            List New Space
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {notifications.some(n => !n.is_read) && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeListings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingBookings}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Guests</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalGuests}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Stay updated with your bookings and alerts.</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="mx-auto h-12 w-12 opacity-20 mb-3" />
                    <p>No new notifications</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                        <div className="mr-4 mt-1">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Bell className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(notification.created_at), 'MMM dd, yyyy • h:mm a')}
                          </p>
                        </div>
                        {/* Use is_read from database schema */}
                        {notification.is_read === false && (
                          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Your Spaces</CardTitle>
                <CardDescription>Manage your listings and visibility.</CardDescription>
              </CardHeader>
              <CardContent>
                {listings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">You haven't listed any spaces yet.</p>
                    <Button onClick={() => navigate('/list-space')}>Create Your First Listing</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                      <div key={listing.id} className="group border-none rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ring-1 ring-border/50">
                        <div className="h-48 bg-muted relative overflow-hidden">
                          {listing.images && listing.images[0] ? (
                            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">No Image</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                          <Badge className="absolute top-3 right-3 bg-white/90 backdrop-blur text-primary font-bold border-none shadow-sm px-2.5 py-1">
                            ${listing.price_per_night}/night
                          </Badge>
                          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                            <Switch
                              checked={listing.is_active}
                              onCheckedChange={() => toggleListingStatus(listing.id, listing.is_active)}
                              className="data-[state=checked]:bg-green-500"
                            />
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/90 backdrop-blur shadow-sm ${listing.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                              {listing.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg mb-1 truncate group-hover:text-primary transition-colors">{listing.title}</h3>
                          <div className="flex items-center text-muted-foreground text-xs mb-4 font-medium">
                            <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
                            <span className="truncate">{listing.location}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full rounded-lg font-bold border-primary/20 hover:border-primary hover:bg-primary/5 text-primary transition-all duration-300"
                              onClick={() => navigate(`/edit-space/${listing.id}`)}
                            >
                              <Edit className="w-3.5 h-3.5 mr-2" />
                              Edit Listing
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Bookings</CardTitle>
                <CardDescription>View and manage reservations.</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No active reservations found.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                        <div className="flex items-start space-x-4 mb-4 md:mb-0">
                          <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            {booking.listings?.images && booking.listings.images[0] && (
                              <img src={booking.listings.images[0]} alt={booking.listings.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">{booking.listings?.title || 'Unknown Space'}</h4>
                            <p className="text-sm text-muted-foreground">
                              Guest: {booking.profiles?.display_name || booking.profiles?.email || 'Unknown Guest'}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {format(new Date(booking.start_date), 'MMM dd')} - {format(new Date(booking.end_date), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                          <div className="font-bold text-lg">${booking.total_amount}</div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              variant={
                                booking.status === 'confirmed' ? 'default' :
                                  booking.status === 'pending' ? 'secondary' :
                                    'destructive'
                              }
                              className={
                                booking.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' :
                                  booking.status === 'pending' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' :
                                    ''
                              }
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>

                            {booking.status === 'confirmed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/5 flex items-center gap-1"
                                onClick={() => setSelectedBookingForChat(booking)}
                              >
                                <div className="relative flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>Chat</span>
                                  {unreadCounts[booking.id] > 0 && (
                                    <span className="absolute -top-3 -right-4 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                                      {unreadCounts[booking.id]}
                                    </span>
                                  )}
                                </div>
                              </Button>
                            )}

                            {booking.status === 'pending' && (
                              <div className="flex gap-2 mt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center gap-1"
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                >
                                  <Check className="h-4 w-4" />
                                  <span>Approve</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                >
                                  <X className="h-4 w-4" />
                                  <span>Decline</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>View your earnings and payouts.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Total Earnings</h3>
                      <p className="text-3xl font-bold text-green-900 dark:text-green-100">${stats.revenue.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Pending Payouts</h3>
                      <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">$0.00</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Processed every Monday</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">Recent Transactions</h3>
                    {bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length === 0 ? (
                      <p className="text-muted-foreground text-sm">No completed transactions yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {bookings
                          .filter(b => b.status === 'confirmed' || b.status === 'completed')
                          .slice(0, 5)
                          .map(b => (
                            <div key={b.id} className="flex justify-between items-center text-sm p-2 hover:bg-muted rounded transition-colors">
                              <div>
                                <p className="font-medium">{b.listings.title}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(b.created_at), 'MMM dd, yyyy')}</p>
                              </div>
                              <div className="font-bold text-green-600 dark:text-green-400">+${b.total_amount.toFixed(2)}</div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Chat Window */}
      {selectedBookingForChat && user && (
        <ChatWindow
          bookingId={selectedBookingForChat.id}
          currentUserId={user.id}
          otherUserId={selectedBookingForChat.guest_id}
          otherUserName={selectedBookingForChat.profiles?.display_name || selectedBookingForChat.profiles?.email || 'Guest'}
          isOpen={!!selectedBookingForChat}
          onClose={() => setSelectedBookingForChat(null)}
        />
      )}
    </div>
  );
};

export default HostDashboard;
