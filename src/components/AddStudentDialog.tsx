import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { departments, years, addStudent, classificationLabels, type Classification } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const mentors = ["Dr. S. Ramanathan", "Prof. A. Krishnan", "Dr. M. Venkatesh", "Prof. R. Sundaram", "Dr. K. Lakshmi"];
const wardens = ["Mr. P. Rajan", "Ms. S. Devi", "Mr. K. Mohan", "Ms. L. Priya"];

const AddStudentDialog = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "", department: departments[0], year: years[0],
    classification: "intermediate" as Classification,
    mentor: mentors[0], warden: wardens[0],
    residenceType: "Hosteller" as "Hosteller" | "Day Scholar",
    email: "", phone: "", rollNo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.rollNo.trim()) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    const engagementLevel = form.classification === "advanced" ? "High" : form.classification === "intermediate" ? "Medium" : "Low";
    const baseGpa = form.classification === "advanced" ? 8.5 : form.classification === "intermediate" ? 7.0 : 5.5;
    const semCount = parseInt(form.year) * 2 || 2;

    setSubmitting(true);
    try {
      await addStudent({
        ...form,
        engagementLevel,
        attendance: { percentage: 75, presentDays: 120, totalDays: 160, leaveCount: 5 },
        academics: {
          semesters: Array.from({ length: semCount }, (_, i) => ({ sem: i + 1, sgpa: baseGpa + (Math.random() - 0.5) })),
          cgpa: baseGpa,
        },
        platforms: { github: "", leetcode: "", linkedin: "" },
        skills: [],
        trainings: [],
        skillsToLearn: [],
        rewardPoints: 0,
        activityPoints: 0,
      });

      toast({
        title: "Student Added Successfully",
        description: `Student added successfully to ${classificationLabels[form.classification]}`,
      });

      setForm({ name: "", department: departments[0], year: years[0], classification: "intermediate", mentor: mentors[0], warden: wardens[0], residenceType: "Hosteller", email: "", phone: "", rollNo: "" });
      setOpen(false);
    } catch (err) {
      toast({
        title: "Failed to add student",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="h-4 w-4" /> Add Student</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">Add New Student</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="Enter student name" />
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={e => updateField("email", e.target.value)} placeholder="email@university.edu" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="+91 9000000000" />
            </div>
            <div>
              <Label>Roll No *</Label>
              <Input value={form.rollNo} onChange={e => updateField("rollNo", e.target.value)} placeholder="CS1001" />
            </div>
            <div>
              <Label>Department</Label>
              <Select value={form.department} onValueChange={v => updateField("department", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year</Label>
              <Select value={form.year} onValueChange={v => updateField("year", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Classification</Label>
              <Select value={form.classification} onValueChange={v => updateField("classification", v as Classification)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="foundational">Foundational</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mentor</Label>
              <Select value={form.mentor} onValueChange={v => updateField("mentor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{mentors.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Warden</Label>
              <Select value={form.warden} onValueChange={v => updateField("warden", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{wardens.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Residence</Label>
              <Select value={form.residenceType} onValueChange={v => updateField("residenceType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hosteller">Hosteller</SelectItem>
                  <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Adding..." : "Add Student"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentDialog;
