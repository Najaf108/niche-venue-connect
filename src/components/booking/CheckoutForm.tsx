import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { Listing } from "@/context/SearchContext";
import { Loader2, Lock } from "lucide-react";
import { format } from "date-fns";

interface BookingDetails {
  listing: Listing;
  hostId: string;
  dateRange: { from: Date; to: Date };
  guests: number;
  amount: {
    base: number;
    commission: number;
    total: number;
  };
}

interface CheckoutFormProps {
  bookingDetails: BookingDetails;
  onSuccess: () => void;
}

export function CheckoutForm({ bookingDetails, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { user } = useAuthState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Validate Card Details via Stripe (Client-side validation)
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user.email, // In real app, ask for name
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      // 2. Simulate Backend Processing
      // In a real app, you would send paymentMethod.id to your backend
      // Here we simulate a successful charge if the token creation worked
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay

      const startDateStr = format(bookingDetails.dateRange.from, 'yyyy-MM-dd');
      const endDateStr = format(bookingDetails.dateRange.to, 'yyyy-MM-dd');

      // 2.5. Check for conflicts before booking
      const { data: spaceConflicts, error: spaceConflictError } = await supabase
        .from('bookings')
        .select('id')
        .eq('listing_id', bookingDetails.listing.id)
        .neq('status', 'cancelled')
        .lte('start_date', endDateStr)
        .gte('end_date', startDateStr);

      if (spaceConflictError) throw spaceConflictError;
      if (spaceConflicts && spaceConflicts.length > 0) {
        throw new Error("This space is already booked for the selected dates.");
      }

      const { data: userConflicts, error: userConflictError } = await supabase
        .from('bookings')
        .select('id')
        .eq('guest_id', user.id)
        .neq('status', 'cancelled')
        .lte('start_date', endDateStr)
        .gte('end_date', startDateStr);

      if (userConflictError) throw userConflictError;
      if (userConflicts && userConflicts.length > 0) {
        throw new Error("You already have another booking during these dates.");
      }

      // 3. Create Booking Record
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          listing_id: bookingDetails.listing.id,
          guest_id: user.id,
          host_id: bookingDetails.hostId,
          start_date: format(bookingDetails.dateRange.from, 'yyyy-MM-dd'),
          end_date: format(bookingDetails.dateRange.to, 'yyyy-MM-dd'),
          total_amount: bookingDetails.amount.total,
          status: 'pending' // Initial status is pending for host approval
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // 4. Create Transaction Record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          booking_id: booking.id,
          payer_id: user.id,
          payee_id: bookingDetails.hostId,
          amount: bookingDetails.amount.total,
          commission_amount: bookingDetails.amount.commission,
          status: 'success',
          stripe_payment_id: paymentMethod.id
        });

      if (transactionError) throw transactionError;

      // 5. Create Notification for Host
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: bookingDetails.hostId,
          type: 'booking_request',
          title: 'New Booking Request',
          message: `You have a new booking from ${user.email} for ${bookingDetails.listing.title}.`,
          metadata: {
            booking_id: booking.id,
            guest_email: user.email,
            dates: `${format(bookingDetails.dateRange.from, 'MMM dd')} - ${format(bookingDetails.dateRange.to, 'MMM dd')}`
          }
        });

      if (notificationError) console.error("Failed to send notification", notificationError);

      // Success
      toast({
        title: "Booking Confirmed!",
        description: "Your payment was successful and the host has been notified.",
      });

      onSuccess();

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
      toast({
        title: "Payment Failed",
        description: err.message || "Please check your card details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Base Price</span>
          <span>${bookingDetails.amount.base.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Fee</span>
          <span>${bookingDetails.amount.commission.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>${bookingDetails.amount.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border rounded-md p-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={!stripe || isProcessing}>
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay ${bookingDetails.amount.total.toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        This is a test environment. Use a Stripe test card (e.g., 4242 4242 4242 4242).
      </p>
    </form>
  );
}
