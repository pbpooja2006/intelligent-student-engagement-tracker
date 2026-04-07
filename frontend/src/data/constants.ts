import type { Educator } from "@/data/types";

export const departments = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
];

export const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export const classificationLabels: Record<string, string> = {
  advanced: "Advanced",
  intermediate: "Intermediate",
  foundational: "Foundational",
  all: "All Students",
};

export const educatorProfile: Educator = {
  name: "Dr. S. Ramanathan",
  email: "s.ramanathan@university.edu",
  department: "Computer Science & Engineering",
  designation: "Associate Professor & Mentor",
  isMentor: true,
  mentorId: "Dr. S. Ramanathan",
};