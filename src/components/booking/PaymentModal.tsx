import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckoutForm } from "./CheckoutForm";
import { Listing } from "@/context/SearchContext";

// Replace with your actual Stripe publishable key or use a test key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx");

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

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails;
}

export function PaymentModal({ isOpen, onClose, bookingDetails }: PaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Confirm and Pay</DialogTitle>
          <DialogDescription>
            Complete your booking for {bookingDetails.listing.title}
          </DialogDescription>
        </DialogHeader>
        
        <Elements stripe={stripePromise}>
          <CheckoutForm bookingDetails={bookingDetails} onSuccess={onClose} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
