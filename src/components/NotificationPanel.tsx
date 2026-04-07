import { Bell, AlertTriangle, TrendingDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useStudentStore } from "@/hooks/useStudentStore";
import { markNotificationRead, markAllNotificationsRead } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const NotificationPanel = () => {
  const { notifications, loading, error } = useStudentStore();
  const [updating, setUpdating] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAll = async () => {
    setUpdating(true);
    try {
      await markAllNotificationsRead();
    } catch (err) {
      toast({
        title: "Failed to update notifications",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    setUpdating(true);
    try {
      await markNotificationRead(id);
    } catch (err) {
      toast({
        title: "Failed to update notification",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b border-border p-3">
          <h3 className="font-display font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleMarkAll} disabled={updating}>
              <Check className="h-3 w-3 mr-1" /> Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <p className="p-4 text-sm text-muted-foreground text-center">Loading notifications...</p>
          ) : error ? (
            <p className="p-4 text-sm text-destructive text-center">{error}</p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-sm text-muted-foreground text-center">No notifications</p>
          ) : (
            notifications.map(n => (
              <button
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`flex w-full gap-3 p-3 text-left border-b border-border last:border-0 transition-colors hover:bg-muted ${!n.read ? "bg-primary/5" : ""}`}
              >
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${n.type === "inactive" ? "bg-inactive/10" : "bg-neutral/10"}`}>
                  {n.type === "inactive" ? <AlertTriangle className="h-4 w-4 text-inactive" /> : <TrendingDown className="h-4 w-4 text-neutral" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(n.timestamp, { addSuffix: true })}</p>
                </div>
                {!n.read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPanel;
