import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Star, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LeaveReview() {
    const { id } = useParams<{ id: string }>(); // listing_id
    const { user } = useAuthState();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async () => {
        if (!user) return;
        if (rating === 0) {
            toast({ title: "Error", description: "Please select a rating", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await (supabase as any).from("reviews").insert({
                listing_id: id,
                user_id: user.id,
                rating,
                comment,
            });

            if (error) throw error;

            toast({ title: "Success", description: "Review submitted successfully!" });
            navigate("/my-bookings");
        } catch (err: any) {
            console.error(err);
            toast({ title: "Error", description: "Could not submit review: " + err.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 flex justify-center items-center p-4">
                <Card className="w-full max-w-lg shadow-xl ring-1 ring-border/50">
                    <CardHeader>
                        <CardTitle className="text-2xl">Leave a Review</CardTitle>
                        <CardDescription className="text-base">Share your experience about this space</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex justify-center space-x-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-12 h-12 cursor-pointer transition-all duration-300 transform hover:scale-110 ${star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                                        }`}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Your comment (optional)</label>
                            <Textarea
                                placeholder="What did you like about this space? Would you recommend it?"
                                rows={5}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="resize-none"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-6 bg-muted/20">
                        <Button variant="ghost" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Not now
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0} className="px-8 shadow-md">
                            {isSubmitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </CardFooter>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
