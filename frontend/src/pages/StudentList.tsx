import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useStudentStore } from "@/hooks/useStudentStore";
import DeleteStudentDialog from "@/components/DeleteStudentDialog";

const engagementColors: Record<string, string> = {
  High: "bg-committed text-committed-foreground",
  Medium: "bg-neutral text-neutral-foreground",
  Low: "bg-inactive text-inactive-foreground",
};

const StudentList = () => {
  const { classification, department, year } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const decodedDept = decodeURIComponent(department || "");
  const decodedYear = decodeURIComponent(year || "");
  const { students: allStudents, loading, error } = useStudentStore();

  let students = allStudents.filter((s) => s.department === decodedDept && s.year === decodedYear);
  if (classification !== "all") {
    students = students.filter((s) => s.classification === classification);
  }
  if (search) {
    students = students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{decodedYear} Students</h1>
          <p className="text-sm text-muted-foreground">{decodedDept} • {students.length} students</p>
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading students...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name or roll no..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-2">
        {students.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground">No students found.</p>
        )}
        {students.map((student) => (
          <div
            key={student.id}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left shadow-card transition-all hover:shadow-card-hover"
          >
            <button
              onClick={() => navigate(`/dashboard/student/${student.id}`)}
              className="flex flex-1 items-center gap-4 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium text-foreground">{student.name}</p>
                <p className="text-sm text-muted-foreground">{student.rollNo} • {student.residenceType}</p>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-foreground">{student.attendance.percentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${engagementColors[student.engagementLevel]}`}>
                {student.engagementLevel}
              </span>
              <DeleteStudentDialog studentId={student.id} studentName={student.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
