import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { departments, classificationLabels } from "@/data/mockData";
import { useStudentStore } from "@/hooks/useStudentStore";

const classColors: Record<string, string> = {
  advanced: "bg-committed",
  intermediate: "bg-neutral",
  foundational: "bg-inactive",
  all: "bg-all-students",
};

const ClassificationView = () => {
  const { classification } = useParams<{ classification: string }>();
  const navigate = useNavigate();
  const { students } = useStudentStore();

  const filteredByClassification = classification === "all"
    ? students
    : students.filter((s) => s.classification === classification);

  const deptCounts = departments.map((dept) => ({
    name: dept,
    count: filteredByClassification.filter((s) => s.department === dept).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {classificationLabels[classification || "all"]} Students
          </h1>
          <p className="text-sm text-muted-foreground">
            {filteredByClassification.length} students • Select a department
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {deptCounts.map((dept) => (
          <button
            key={dept.name}
            onClick={() => navigate(`/dashboard/classification/${classification}/department/${encodeURIComponent(dept.name)}`)}
            className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${classColors[classification || "all"]}/10`}>
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{dept.name}</p>
              <p className="text-sm text-muted-foreground">{dept.count} students</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClassificationView;
