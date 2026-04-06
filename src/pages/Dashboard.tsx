import { useNavigate } from "react-router-dom";
import { Users, UserCheck, UserMinus, UserX, AlertTriangle, TrendingUp, Award } from "lucide-react";
import { getStudentsByClassification, classificationLabels } from "@/data/mockData";
import { useStudentStore } from "@/hooks/useStudentStore";
import AddStudentDialog from "@/components/AddStudentDialog";

const classificationCards = [
  {
    key: "advanced" as const,
    label: "Advanced",
    icon: UserCheck,
    colorClass: "bg-committed",
    lightClass: "bg-committed-light",
    textClass: "text-committed",
    borderClass: "border-committed/20",
    description: "Highly engaged students",
  },
  {
    key: "intermediate" as const,
    label: "Intermediate",
    icon: Users,
    colorClass: "bg-neutral",
    lightClass: "bg-neutral-light",
    textClass: "text-neutral",
    borderClass: "border-neutral/20",
    description: "Moderately engaged students",
  },
  {
    key: "foundational" as const,
    label: "Foundational",
    icon: UserX,
    colorClass: "bg-inactive",
    lightClass: "bg-inactive-light",
    textClass: "text-inactive",
    borderClass: "border-inactive/20",
    description: "Students needing attention",
  },
  {
    key: "all" as const,
    label: "All Students",
    icon: UserMinus,
    colorClass: "bg-all-students",
    lightClass: "bg-all-students-light",
    textClass: "text-all-students",
    borderClass: "border-all-students/20",
    description: "Complete student directory",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { stats } = useStudentStore();
  const foundationalStudents = getStudentsByClassification("foundational").slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Overview of student engagement across all departments</p>
        </div>
        <AddStudentDialog />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.all}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-committed-light">
            <Award className="h-5 w-5 text-committed" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {stats.all > 0 ? Math.round((stats.advanced / stats.all) * 100) : 0}%
            </p>
            <p className="text-xs text-muted-foreground">Engagement Rate</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-light">
            <Users className="h-5 w-5 text-neutral" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">10</p>
            <p className="text-xs text-muted-foreground">Departments</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-card">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-inactive-light">
            <AlertTriangle className="h-5 w-5 text-inactive" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.foundational}</p>
            <p className="text-xs text-muted-foreground">Need Attention</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Student Classifications</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {classificationCards.map((card) => {
            const count = stats[card.key];
            return (
              <button
                key={card.key}
                onClick={() => navigate(`/dashboard/classification/${card.key}`)}
                className={`group relative overflow-hidden rounded-xl border ${card.borderClass} bg-card p-6 text-left shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1`}
              >
                <div className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${card.lightClass}`} />
                <div className="relative">
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.colorClass}`}>
                    <card.icon className="h-6 w-6 text-card" />
                  </div>
                  <p className="text-3xl font-bold text-foreground">{count}</p>
                  <p className={`mt-1 font-semibold ${card.textClass}`}>{card.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-inactive/20 bg-inactive-light p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-inactive" />
          <h3 className="font-display text-lg font-semibold text-foreground">Students Requiring Attention</h3>
        </div>
        <div className="space-y-3">
          {foundationalStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => navigate(`/dashboard/student/${student.id}`)}
              className="flex cursor-pointer items-center justify-between rounded-lg bg-card p-3 shadow-card transition-all hover:shadow-card-hover"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-inactive/10 text-sm font-semibold text-inactive">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.department} • {student.year}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-inactive">{student.attendance.percentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
