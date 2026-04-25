import { useState, useEffect } from "react";
import { format, differenceInCalendarDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { DateRange } from "react-day-picker";
import { supabase } from "@/integrations/supabase/client";
import { Calendar as CalendarIcon, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Listing } from "@/context/SearchContext";
import { cn } from "@/lib/utils";
import { useAuthState } from "@/hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { PaymentModal } from "./PaymentModal";

interface BookingWidgetProps {
  listing: Listing;
  hostId: string;
}

export function BookingWidget({ listing, hostId }: BookingWidgetProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState<{ start: Date; end: Date }[]>([]);
  const [dateError, setDateError] = useState<string | null>(null);
  const { user } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      // Fetch space bookings
      const { data: spaceBookings } = await supabase
        .from("bookings")
        .select("start_date, end_date")
        .eq("listing_id", listing.id)
        .neq("status", "cancelled");

      let userBookings: any[] = [];
      if (user) {
        const { data } = await supabase
          .from("bookings")
          .select("start_date, end_date")
          .eq("guest_id", user.id)
          .neq("status", "cancelled");
        if (data) userBookings = data;
      }

      const combinedBookings = [...(spaceBookings || []), ...userBookings];

      setUnavailableDates(
        combinedBookings.map((b) => ({
          start: new Date(b.start_date),
          end: new Date(b.end_date),
        }))
      );
    };
    fetchUnavailableDates();
  }, [listing.id, user]);

  const isDateUnavailable = (date: Date) => {
    if (startOfDay(date) < startOfDay(new Date())) return true;
    for (const range of unavailableDates) {
      if (isWithinInterval(startOfDay(date), { start: startOfDay(range.start), end: endOfDay(range.end) })) {
        return true;
      }
    }
    return false;
  };

  const pricePerNight = listing.price_per_night;
  const nights = date?.from && date?.to
    ? differenceInCalendarDays(date.to, date.from)
    : 0;

  const basePrice = pricePerNight * nights;
  const commissionRate = 0.15;
  const commission = basePrice * commissionRate;
  const total = basePrice + commission;

  const handleGuestChange = (delta: number) => {
    const newValue = guests + delta;
    if (newValue >= 1 && newValue <= listing.max_guests) {
      setGuests(newValue);
    }
  };

  const handleReserve = () => {
    if (!user) {
      navigate("/auth", { state: { from: window.location.pathname } });
      return;
    }

    if (date?.from && date?.to) {
      let current = new Date(date.from);
      while (current <= date.to) {
        for (const range of unavailableDates) {
          if (isWithinInterval(startOfDay(current), { start: startOfDay(range.start), end: endOfDay(range.end) })) {
            setDateError("Selected range contains unavailable dates.");
            return;
          }
        }
        current.setDate(current.getDate() + 1);
      }
    }

    setDateError(null);
    setIsPaymentOpen(true);
  };

  return (
    <>
      <Card className="shadow-lg border-primary/20">
        <CardHeader>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-2xl font-bold">${pricePerNight}</span>
              <span className="text-muted-foreground"> / night</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Max {listing.max_guests} guests
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Picker */}
          <div className="grid gap-2">
            <span className="text-sm font-medium">Dates</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Check-in - Check-out</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setDateError(null);
                  }}
                  numberOfMonths={2}
                  disabled={isDateUnavailable}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guest Selector */}
          <div className="grid gap-2">
            <span className="text-sm font-medium">Guests</span>
            <div className="flex items-center justify-between border rounded-md p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleGuestChange(-1)}
                disabled={guests <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-medium">{guests}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleGuestChange(1)}
                disabled={guests >= listing.max_guests}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {dateError && <div className="text-red-500 text-sm">{dateError}</div>}
          </div>

          {/* Price Breakdown */}
          {nights > 0 && (
            <div className="space-y-3 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  ${pricePerNight} x {nights} nights
                </span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Platform fee (15%)
                </span>
                <span>${commission.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!date?.from || !date?.to}
            onClick={handleReserve}
          >
            {user ? "Reserve" : "Login to Reserve"}
          </Button>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {isPaymentOpen && date?.from && date?.to && (
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          bookingDetails={{
            listing,
            hostId,
            dateRange: { from: date.from, to: date.to },
            guests,
            amount: {
              base: basePrice,
              commission,
              total
            }
          }}
        />
      )}
    </>
  );
}
