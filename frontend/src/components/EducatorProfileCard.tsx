import { useNavigate } from "react-router-dom";
import { User, LogOut, Users, AlertTriangle, TrendingDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { educatorProfile } from "@/data/constants";
import { useStudentStore } from "@/hooks/useStudentStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { logout } from "@/data/authStore";

const EducatorProfileCard = () => {
  const navigate = useNavigate();
  const { stats, students } = useStudentStore();
  const { user } = useAuthStore();
  const mentees = students.filter((s) => s.mentor === educatorProfile.mentorId);
  const inactiveMentees = mentees.filter(s => s.classification === "foundational");
  const lowPerformers = mentees.filter(s => s.academics.cgpa < 6);
  const displayName = user?.name || educatorProfile.name;
  const displayEmail = user?.email || educatorProfile.email;
  const displayDesignation = user?.designation || educatorProfile.designation;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted transition-colors">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            {displayName.charAt(0)}
          </div>
          <span className="text-sm font-medium text-foreground hidden lg:inline">{displayName.split(" ").slice(-1)[0]}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
              {displayName.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="font-semibold text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayDesignation}</p>
              <p className="text-xs text-muted-foreground">{displayEmail}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-border p-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Dashboard Summary</h4>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-committed-light p-2 text-center">
              <p className="text-lg font-bold text-committed">{stats.advanced}</p>
              <p className="text-[10px] text-muted-foreground">Advanced</p>
            </div>
            <div className="rounded-lg bg-neutral-light p-2 text-center">
              <p className="text-lg font-bold text-neutral">{stats.intermediate}</p>
              <p className="text-[10px] text-muted-foreground">Intermediate</p>
            </div>
            <div className="rounded-lg bg-inactive-light p-2 text-center">
              <p className="text-lg font-bold text-inactive">{stats.foundational}</p>
              <p className="text-[10px] text-muted-foreground">Foundational</p>
            </div>
          </div>
        </div>

        {educatorProfile.isMentor && (
          <div className="border-b border-border p-4">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              <Users className="h-3 w-3 inline mr-1" /> Mentees ({mentees.length})
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {mentees.slice(0, 25).map(s => {
                const isInactive = s.classification === "foundational";
                const isLow = s.academics.cgpa < 6;
                return (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/dashboard/student/${s.id}`)}
                    className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm hover:bg-muted transition-colors"
                  >
                    <span className="text-foreground truncate">{s.name}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      {isInactive && <AlertTriangle className="h-3 w-3 text-inactive" />}
                      {isLow && <TrendingDown className="h-3 w-3 text-neutral" />}
                    </div>
                  </button>
                );
              })}
            </div>
            {inactiveMentees.length > 0 && (
              <p className="mt-2 text-xs text-inactive">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                {inactiveMentees.length} foundational students need attention
              </p>
            )}
            {lowPerformers.length > 0 && (
              <p className="text-xs text-neutral">
                <TrendingDown className="h-3 w-3 inline mr-1" />
                {lowPerformers.length} low-performing students (CGPA &lt; 6)
              </p>
            )}
          </div>
        )}

        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive gap-2"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EducatorProfileCard;
