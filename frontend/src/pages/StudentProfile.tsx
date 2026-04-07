import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Github, Linkedin, Award, BookOpen, Target, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { classificationLabels } from "@/data/constants";
import { useStudentStore } from "@/hooks/useStudentStore";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import DeleteStudentDialog from "@/components/DeleteStudentDialog";

const engagementBadge: Record<string, string> = {
  High: "bg-committed text-committed-foreground",
  Medium: "bg-neutral text-neutral-foreground",
  Low: "bg-inactive text-inactive-foreground",
};

const classificationBadge: Record<string, string> = {
  advanced: "bg-committed-light text-committed",
  intermediate: "bg-neutral-light text-neutral",
  foundational: "bg-inactive-light text-inactive",
};

const StudentProfile = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { students, loading } = useStudentStore();
  const student = students.find((s) => s.id === (studentId || ""));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Loading student...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Student not found</p>
        <Button variant="ghost" className="mt-4" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const chartData = student.academics.semesters.map((s) => ({
    name: `Sem ${s.sem}`,
    SGPA: parseFloat(s.sgpa.toFixed(2)),
    CGPA: parseFloat(student.academics.cgpa.toFixed(2)),
  }));

  const attendanceData = [
    { name: "Present", value: student.attendance.presentDays, fill: "hsl(152, 60%, 42%)" },
    { name: "Leave", value: student.attendance.leaveCount, fill: "hsl(38, 80%, 52%)" },
    { name: "Absent", value: student.attendance.totalDays - student.attendance.presentDays - student.attendance.leaveCount, fill: "hsl(0, 72%, 51%)" },
  ];

  const platformIcons: Record<string, { icon: React.ReactNode; label: string }> = {
    github: { icon: <Github className="h-4 w-4" />, label: "GitHub" },
    leetcode: { icon: <Target className="h-4 w-4" />, label: "LeetCode" },
    codeforces: { icon: <BookOpen className="h-4 w-4" />, label: "Codeforces" },
    hackerrank: { icon: <Award className="h-4 w-4" />, label: "HackerRank" },
    linkedin: { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground">Student Profile</h1>
        </div>
        <DeleteStudentDialog studentId={student.id} studentName={student.name} variant="button" />
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
            {student.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-2xl font-bold text-foreground">{student.name}</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${engagementBadge[student.engagementLevel]}`}>
                {student.engagementLevel} Engagement
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${classificationBadge[student.classification]}`}>
                {classificationLabels[student.classification]}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm">
              <p className="text-muted-foreground">Roll No: <span className="font-medium text-foreground">{student.rollNo}</span></p>
              <p className="text-muted-foreground">Department: <span className="font-medium text-foreground">{student.department}</span></p>
              <p className="text-muted-foreground">Year: <span className="font-medium text-foreground">{student.year}</span></p>
              <p className="text-muted-foreground">Mentor: <span className="font-medium text-foreground">{student.mentor}</span></p>
              <p className="text-muted-foreground">Warden: <span className="font-medium text-foreground">{student.warden}</span></p>
              <p className="text-muted-foreground">Residence: <span className="font-medium text-foreground">{student.residenceType}</span></p>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {student.email}</span>
              <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {student.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Attendance</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="rounded-lg bg-committed-light p-3 text-center">
              <p className="text-2xl font-bold text-committed">{student.attendance.percentage.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Overall</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold text-foreground">{student.attendance.presentDays}</p>
              <p className="text-xs text-muted-foreground">Present</p>
            </div>
            <div className="rounded-lg bg-inactive-light p-3 text-center">
              <p className="text-2xl font-bold text-inactive">{student.attendance.leaveCount}</p>
              <p className="text-xs text-muted-foreground">Leaves</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Academic Performance</h3>
          <div className="mb-4 flex items-center gap-6">
            <div className="rounded-lg bg-primary/10 px-4 py-2">
              <p className="text-2xl font-bold text-primary">{student.academics.cgpa.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">CGPA</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="SGPA" stroke="hsl(215, 70%, 28%)" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="CGPA" stroke="hsl(175, 60%, 38%)" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Coding Profiles</h3>
          <div className="space-y-2">
            {Object.entries(student.platforms).map(([key, url]) => {
              if (!url) return null;
              const platform = platformIcons[key];
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted">
                  {platform?.icon}
                  <span className="flex-1 text-sm font-medium text-foreground">{platform?.label || key}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Points & Rewards</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-committed-light p-4 text-center">
                <p className="text-2xl font-bold text-committed">{student.rewardPoints}</p>
                <p className="text-xs text-muted-foreground">Reward Points</p>
              </div>
              <div className="rounded-lg bg-all-students-light p-4 text-center">
                <p className="text-2xl font-bold text-all-students">{student.activityPoints}</p>
                <p className="text-xs text-muted-foreground">Activity Points</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-3 font-display text-lg font-semibold text-foreground">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {student.skills.map((skill) => (
                <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{skill}</span>
              ))}
            </div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Training Attended</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {student.trainings.map((t) => (
                <span key={t} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{t}</span>
              ))}
            </div>
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">Skills to Learn</h4>
            <div className="flex flex-wrap gap-2">
              {student.skillsToLearn.map((s) => (
                <span key={s} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
