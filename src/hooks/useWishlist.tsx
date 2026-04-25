import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from './useAuthState';
import { useToast } from './use-toast';

export const useWishlist = () => {
  const { user } = useAuthState();
  const { toast } = useToast();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistIds([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistIds(data.map((item: { listing_id: string }) => item.listing_id));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (listingId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save spaces to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    const isWishlisted = wishlistIds.includes(listingId);

    try {
      if (isWishlisted) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);

        if (error) throw error;
        setWishlistIds(prev => prev.filter(id => id !== listingId));
        toast({
          title: "Removed from wishlist",
          description: "Space has been removed from your wishlist.",
        });
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id, listing_id: listingId });

        if (error) throw error;
        setWishlistIds(prev => [...prev, listingId]);
        toast({
          title: "Added to wishlist",
          description: "Space has been added to your wishlist.",
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { wishlistIds, toggleWishlist, loading, refreshWishlist: fetchWishlist };
};
