import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  attachment_url?: string;
  attachment_type?: string;
}

export const ChatService = {
  /**
   * Fetch messages for a specific booking
   */
  async getMessages(bookingId: string) {
    const { data, error } = await (supabase as any)
      .from('messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }

    return (data || []) as Message[];
  },

  /**
   * Send a new message
   */
  async sendMessage(bookingId: string, senderId: string, receiverId: string, content: string) {
    const { data, error } = await (supabase as any)
      .from('messages')
      .insert({
        booking_id: bookingId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    return data as Message;
  },

  /**
   * Mark messages as read
   */
  async markAsRead(messageIds: string[]) {
    if (messageIds.length === 0) return;

    const { error } = await (supabase as any)
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', messageIds);

    if (error) {
      console.error('Error marking messages as read:', error);
    }
  },

  /**
   * Fetch unread message counts for specific bookings
   */
  async getUnreadCount(currentUserId: string, bookingIds: string[]) {
    if (bookingIds.length === 0) return {};

    const { data, error } = await (supabase as any)
      .from('messages')
      .select('id, booking_id')
      .is('read_at', null)
      .eq('receiver_id', currentUserId)
      .in('booking_id', bookingIds);

    if (error) {
      console.error('Error fetching unread counts:', error);
      return {};
    }

    const counts: Record<string, number> = {};
    bookingIds.forEach(id => counts[id] = 0);

    (data || []).forEach((msg: any) => {
      if (counts[msg.booking_id] !== undefined) {
        counts[msg.booking_id]++;
      }
    });

    return counts;
  },

  /**
   * Subscribe to unread messages for a user
   */
  subscribeToUserUnreadMessages(userId: string, onUpdate: () => void): RealtimeChannel {
    return (supabase as any)
      .channel(`user-unread-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`,
        },
        () => {
          onUpdate();
        }
      )
      .subscribe();
  },

  /**
   * Subscribe to new messages for a booking
   */
  subscribeToBooking(bookingId: string, onMessage: (payload: any) => void): RealtimeChannel {
    return (supabase as any)
      .channel(`booking-chat-${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload: any) => {
          onMessage(payload.new);
        }
      )
      .subscribe();
  }
};
