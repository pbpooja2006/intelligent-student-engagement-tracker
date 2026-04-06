import { Outlet, Link, useNavigate } from "react-router-dom";
import { GraduationCap, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NotificationPanel from "@/components/NotificationPanel";
import EducatorProfile from "./EducatorProfileCard";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border glass-effect">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground hidden sm:inline">
              Student Engagement Tracker
            </span>
            <span className="font-display text-lg font-bold text-foreground sm:hidden">SET</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <NotificationPanel />
            <div className="ml-2 h-8 w-px bg-border" />
            <div className="ml-2">
              <EducatorProfile />
            </div>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
            <Link to="/dashboard" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-muted" onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}>
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
