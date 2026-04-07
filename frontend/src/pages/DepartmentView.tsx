import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { years, classificationLabels } from "@/data/mockData";
import { useStudentStore } from "@/hooks/useStudentStore";

const DepartmentView = () => {
  const { classification, department } = useParams<{ classification: string; department: string }>();
  const navigate = useNavigate();
  const decodedDept = decodeURIComponent(department || "");
  const { students, loading, error } = useStudentStore();

  const filtered = classification === "all"
    ? students.filter((s) => s.department === decodedDept)
    : students.filter((s) => s.department === decodedDept && s.classification === classification);

  const yearCounts = years.map((year) => ({
    year,
    count: filtered.filter((s) => s.year === year).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{decodedDept}</h1>
          <p className="text-sm text-muted-foreground">
            {classificationLabels[classification || "all"]} • {filtered.length} students • Select a year
          </p>
        </div>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading students...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {yearCounts.map(({ year, count }) => (
          <button
            key={year}
            onClick={() => navigate(`/dashboard/classification/${classification}/department/${department}/year/${encodeURIComponent(year)}`)}
            className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <p className="text-lg font-semibold text-foreground">{year}</p>
            <p className="text-sm text-muted-foreground">{count} students</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DepartmentView;
