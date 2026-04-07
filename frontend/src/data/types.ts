export type Classification = "advanced" | "intermediate" | "foundational";

export interface Student {
  id: string;
  name: string;
  department: string;
  year: string;
  classification: Classification;
  mentor: string;
  warden: string;
  residenceType: "Hosteller" | "Day Scholar";
  attendance: {
    percentage: number;
    presentDays: number;
    totalDays: number;
    leaveCount: number;
  };
  academics: {
    semesters: { sem: number; sgpa: number }[];
    cgpa: number;
  };
  platforms: {
    github?: string;
    leetcode?: string;
    codeforces?: string;
    hackerrank?: string;
    linkedin?: string;
  };
  skills: string[];
  trainings: string[];
  skillsToLearn: string[];
  rewardPoints: number;
  activityPoints: number;
  engagementLevel: "High" | "Medium" | "Low";
  email: string;
  phone: string;
  rollNo: string;
}

export interface Notification {
  id: string;
  type: "inactive" | "drop" | "info";
  message: string;
  studentName: string;
  department: string;
  timestamp: Date;
  read: boolean;
}

export interface Educator {
  name: string;
  email: string;
  department: string;
  designation: string;
  isMentor: boolean;
  mentorId: string;
}

export interface StudentStats {
  advanced: number;
  intermediate: number;
  foundational: number;
  all: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  designation?: string;
  mentorId?: string;
}
