import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { X, Send, Loader2 } from "lucide-react";
import { ChatService, Message } from "@/services/ChatService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ChatWindowProps {
  bookingId: string;
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  bookingId,
  currentUserId,
  otherUserId,
  otherUserName,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && bookingId && currentUserId) {
      loadMessages();
      const channel = ChatService.subscribeToBooking(bookingId, (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
        // If message is for me, mark it as read
        if (newMessage.receiver_id === currentUserId) {
          ChatService.markAsRead([newMessage.id]);
        }
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [isOpen, bookingId, currentUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await ChatService.getMessages(bookingId);
      setMessages(data || []);

      // Mark all unread messages for current user as read
      if (data && currentUserId) {
        const unreadIds = data
          .filter(m => !m.read_at && m.receiver_id === currentUserId)
          .map(m => m.id);
        if (unreadIds.length > 0) {
          await ChatService.markAsRead(unreadIds);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const messageContent = newMessage;
    setNewMessage(""); // Clear input immediately for better UX
    setSending(true);

    try {
      const sentMessage = await ChatService.sendMessage(bookingId, currentUserId, otherUserId, messageContent);

      if (sentMessage) {
        setMessages((prev) => {
          // Avoid duplicates if realtime event came in first
          if (prev.some(m => m.id === sentMessage.id)) return prev;
          return [...prev, sentMessage];
        });
      }
    } catch (error) {
      setNewMessage(messageContent); // Restore message on error
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md shadow-2xl transition-all duration-300 ease-in-out transform translate-y-0">
      <Card className="border-primary/20 h-[500px] flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <CardHeader className="p-4 border-b flex flex-row items-center justify-between space-y-0 bg-primary/5">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500 absolute bottom-0 right-0 ring-2 ring-background"></div>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {otherUserName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <CardTitle className="text-base font-bold">{otherUserName}</CardTitle>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : null}

          <ScrollArea className="h-full p-4">
            <div className="flex flex-col space-y-4">
              {messages.length === 0 && !loading && (
                <div className="text-center text-muted-foreground py-8 text-sm">
                  No messages yet. Start the conversation!
                </div>
              )}

              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground rounded-bl-none'
                        }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {format(new Date(msg.created_at), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-3 border-t bg-background/50">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
              disabled={loading || sending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={loading || sending || !newMessage.trim()}
              className="rounded-full shadow-md bg-gradient-to-r from-primary to-creative hover:opacity-90 transition-opacity"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 ml-0.5" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};
