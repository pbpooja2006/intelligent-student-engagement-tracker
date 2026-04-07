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
  type: "inactive" | "drop";
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

const firstNames = ["Aarav", "Priya", "Rohan", "Sneha", "Vikram", "Ananya", "Karthik", "Divya", "Arjun", "Meera", "Rahul", "Ishita", "Aditya", "Kavya", "Nikhil", "Pooja"];
const lastNames = ["Sharma", "Patel", "Kumar", "Reddy", "Singh", "Nair", "Gupta", "Iyer", "Joshi", "Das", "Mehta", "Rao", "Verma", "Pillai", "Bhat", "Chopra"];
const mentors = ["Dr. S. Ramanathan", "Prof. A. Krishnan", "Dr. M. Venkatesh", "Prof. R. Sundaram", "Dr. K. Lakshmi"];
const wardens = ["Mr. P. Rajan", "Ms. S. Devi", "Mr. K. Mohan", "Ms. L. Priya"];
const skillsList = ["Python", "Java", "React", "Machine Learning", "Data Structures", "Cloud Computing", "Docker", "SQL", "Git", "TypeScript", "Node.js", "TensorFlow"];
const trainingsList = ["AWS Fundamentals", "Full Stack Dev", "AI/ML Bootcamp", "Cybersecurity Basics", "Data Science Workshop"];
const toLearn = ["Kubernetes", "System Design", "Blockchain", "DevOps", "Microservices"];

let studentId = 0;
function generateStudent(dept: string, year: string, classification: Classification): Student {
  studentId++;
  const fn = firstNames[studentId % firstNames.length];
  const ln = lastNames[(studentId * 3) % lastNames.length];
  const semCount = parseInt(year) * 2 || 2;
  const baseGpa = classification === "advanced" ? 8.5 : classification === "intermediate" ? 7.0 : 5.5;

  return {
    id: `STU${String(studentId).padStart(4, "0")}`,
    name: `${fn} ${ln}`,
    department: dept,
    year,
    classification,
    mentor: mentors[studentId % mentors.length],
    warden: wardens[studentId % wardens.length],
    residenceType: studentId % 3 === 0 ? "Day Scholar" : "Hosteller",
    attendance: {
      percentage: classification === "advanced" ? 85 + Math.random() * 15 : classification === "intermediate" ? 65 + Math.random() * 20 : 40 + Math.random() * 25,
      presentDays: classification === "advanced" ? 140 + Math.floor(Math.random() * 20) : classification === "intermediate" ? 110 + Math.floor(Math.random() * 20) : 70 + Math.floor(Math.random() * 30),
      totalDays: 160,
      leaveCount: classification === "advanced" ? Math.floor(Math.random() * 5) : classification === "intermediate" ? 5 + Math.floor(Math.random() * 10) : 15 + Math.floor(Math.random() * 15),
    },
    academics: {
      semesters: Array.from({ length: semCount }, (_, i) => ({
        sem: i + 1,
        sgpa: Math.min(10, Math.max(4, baseGpa + (Math.random() - 0.5) * 2)),
      })),
      cgpa: Math.min(10, Math.max(4, baseGpa + (Math.random() - 0.3))),
    },
    platforms: {
      github: `https://github.com/${fn.toLowerCase()}${ln.toLowerCase()}`,
      leetcode: `https://leetcode.com/${fn.toLowerCase()}_${ln.toLowerCase()}`,
      linkedin: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}`,
      ...(studentId % 2 === 0 ? { codeforces: `https://codeforces.com/profile/${fn.toLowerCase()}` } : {}),
      ...(studentId % 3 === 0 ? { hackerrank: `https://hackerrank.com/${fn.toLowerCase()}` } : {}),
    },
    skills: skillsList.slice(0, 3 + (studentId % 5)),
    trainings: trainingsList.slice(0, 1 + (studentId % 3)),
    skillsToLearn: toLearn.slice(0, 2 + (studentId % 3)),
    rewardPoints: classification === "advanced" ? 200 + Math.floor(Math.random() * 300) : classification === "intermediate" ? 80 + Math.floor(Math.random() * 120) : Math.floor(Math.random() * 80),
    activityPoints: classification === "advanced" ? 150 + Math.floor(Math.random() * 200) : classification === "intermediate" ? 50 + Math.floor(Math.random() * 100) : Math.floor(Math.random() * 50),
    engagementLevel: classification === "advanced" ? "High" : classification === "intermediate" ? "Medium" : "Low",
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@university.edu`,
    phone: `+91 ${9000000000 + studentId}`,
    rollNo: `${dept.substring(0, 2).toUpperCase()}${year.charAt(0)}${String(studentId).padStart(3, "0")}`,
  };
}

// Generate students for all combinations
export const allStudents: Student[] = [];
departments.forEach((dept) => {
  years.forEach((year) => {
    for (let i = 0; i < 3; i++) allStudents.push(generateStudent(dept, year, "advanced"));
    for (let i = 0; i < 2; i++) allStudents.push(generateStudent(dept, year, "intermediate"));
    allStudents.push(generateStudent(dept, year, "foundational"));
  });
});

// Mutable store
let _students = [...allStudents];
let _notifications: Notification[] = [
  {
    id: "notif-1",
    type: "inactive",
    message: "Student Priya Gupta from Computer Science & Engineering is inactive for a long time",
    studentName: "Priya Gupta",
    department: "Computer Science & Engineering",
    timestamp: new Date(Date.now() - 3600000),
    read: false,
  },
  {
    id: "notif-2",
    type: "drop",
    message: "Student Rohan Kumar dropped from Advanced to Intermediate",
    studentName: "Rohan Kumar",
    department: "Information Technology",
    timestamp: new Date(Date.now() - 7200000),
    read: false,
  },
  {
    id: "notif-3",
    type: "inactive",
    message: "Student Sneha Reddy from Electronics & Communication is inactive for a long time",
    studentName: "Sneha Reddy",
    department: "Electronics & Communication",
    timestamp: new Date(Date.now() - 10800000),
    read: false,
  },
];

let _listeners: (() => void)[] = [];

export function subscribe(listener: () => void) {
  _listeners.push(listener);
  return () => { _listeners = _listeners.filter(l => l !== listener); };
}

function notify() {
  _stats = computeStats();
  _listeners.forEach(l => l());
}

export function getStudents() { return _students; }
export function getNotifications() { return _notifications; }

export const getStudentsByClassification = (c: Classification) => _students.filter((s) => s.classification === c);
export const getStudentsByDeptAndYear = (dept: string, year: string, classification?: Classification) =>
  _students.filter((s) => s.department === dept && s.year === year && (!classification || s.classification === classification));
export const getStudentById = (id: string) => _students.find((s) => s.id === id);

let _stats = computeStats();

function computeStats() {
  return {
    advanced: _students.filter(s => s.classification === "advanced").length,
    intermediate: _students.filter(s => s.classification === "intermediate").length,
    foundational: _students.filter(s => s.classification === "foundational").length,
    all: _students.length,
  };
}

export function getClassificationStats() {
  return _stats;
}

let nextId = allStudents.length + 1;
export function addStudent(student: Omit<Student, "id">) {
  const newStudent: Student = { ...student, id: `STU${String(nextId++).padStart(4, "0")}` };
  _students = [..._students, newStudent];
  notify();
  return newStudent;
}

export function deleteStudent(id: string) {
  const student = _students.find(s => s.id === id);
  _students = _students.filter(s => s.id !== id);
  notify();
  return student;
}

export function addNotification(notif: Omit<Notification, "id">) {
  const newNotif: Notification = { ...notif, id: `notif-${Date.now()}` };
  _notifications = [newNotif, ..._notifications];
  notify();
  return newNotif;
}

export function markNotificationRead(id: string) {
  _notifications = _notifications.map(n => n.id === id ? { ...n, read: true } : n);
  notify();
}

export function markAllNotificationsRead() {
  _notifications = _notifications.map(n => ({ ...n, read: true }));
  notify();
}

export const educatorProfile: Educator = {
  name: "Dr. S. Ramanathan",
  email: "s.ramanathan@university.edu",
  department: "Computer Science & Engineering",
  designation: "Associate Professor & Mentor",
  isMentor: true,
  mentorId: "Dr. S. Ramanathan",
};

export function getMentees(mentorName: string) {
  return _students.filter(s => s.mentor === mentorName);
}

export const classificationLabels: Record<string, string> = {
  advanced: "Advanced",
  intermediate: "Intermediate",
  foundational: "Foundational",
  all: "All Students",
};
