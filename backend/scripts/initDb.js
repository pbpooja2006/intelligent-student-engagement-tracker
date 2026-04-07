import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '../schema.sql');

const seedStudents = [
  {
    name: 'Aarav Sharma',
    department: 'Computer Science & Engineering',
    year: '2nd Year',
    classification: 'advanced',
    mentor: 'Dr. S. Ramanathan',
    warden: 'Mr. P. Rajan',
    residenceType: 'Hosteller',
    attendance: { percentage: 91, presentDays: 145, totalDays: 160, leaveCount: 3 },
    academics: { semesters: [{ sem: 1, sgpa: 8.7 }, { sem: 2, sgpa: 8.9 }], cgpa: 8.8 },
    platforms: { github: 'https://github.com/aaravsharma', leetcode: 'https://leetcode.com/aarav_sharma', linkedin: 'https://linkedin.com/in/aarav-sharma' },
    skills: ['Python', 'React', 'Data Structures'],
    trainings: ['Full Stack Dev'],
    skillsToLearn: ['System Design'],
    rewardPoints: 220,
    activityPoints: 180,
    engagementLevel: 'High',
    email: 'aarav.sharma@university.edu',
    phone: '+91 9000000001',
    rollNo: 'CS2001'
  },
  {
    name: 'Sneha Reddy',
    department: 'Electronics & Communication',
    year: '3rd Year',
    classification: 'foundational',
    mentor: 'Prof. R. Sundaram',
    warden: 'Ms. L. Priya',
    residenceType: 'Hosteller',
    attendance: { percentage: 58, presentDays: 93, totalDays: 160, leaveCount: 12 },
    academics: { semesters: [{ sem: 1, sgpa: 5.8 }, { sem: 2, sgpa: 5.5 }], cgpa: 5.6 },
    platforms: { linkedin: 'https://linkedin.com/in/sneha-reddy' },
    skills: ['C', 'Digital Circuits'],
    trainings: ['Cybersecurity Basics'],
    skillsToLearn: ['DevOps'],
    rewardPoints: 35,
    activityPoints: 20,
    engagementLevel: 'Low',
    email: 'sneha.reddy@university.edu',
    phone: '+91 9000000002',
    rollNo: 'EC3005'
  },
  {
    name: 'Rahul Mehta',
    department: 'Information Technology',
    year: '1st Year',
    classification: 'intermediate',
    mentor: 'Dr. M. Venkatesh',
    warden: 'Ms. S. Devi',
    residenceType: 'Day Scholar',
    attendance: { percentage: 74, presentDays: 118, totalDays: 160, leaveCount: 7 },
    academics: { semesters: [{ sem: 1, sgpa: 7.2 }], cgpa: 7.1 },
    platforms: { github: 'https://github.com/rahulmehta' },
    skills: ['Java', 'SQL'],
    trainings: ['AWS Fundamentals'],
    skillsToLearn: ['Microservices'],
    rewardPoints: 110,
    activityPoints: 70,
    engagementLevel: 'Medium',
    email: 'rahul.mehta@university.edu',
    phone: '+91 9000000003',
    rollNo: 'IT1009'
  },
  {
  name: 'Kiranya S R',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  classification: 'advanced',
  mentor: 'Dr. Meenakshi',
  warden: 'Mr. Rajesh',
  residenceType: 'Hosteller',
  attendance: { percentage: 92, presentDays: 148, totalDays: 160, leaveCount: 2 },
  academics: { semesters: [{ sem: 3, sgpa: 9.1 }, { sem: 4, sgpa: 9.3 }], cgpa: 9.2 },
  platforms: { github: 'https://github.com/kiranyasr', leetcode: 'https://leetcode.com/u/Kiranya_Ravi/', linkedin: 'https://www.linkedin.com/in/kiranyaravikumar' },
  skills: ['React', 'Node.js', 'DSA'],
  trainings: ['Full Stack Development'],
  skillsToLearn: ['System Design'],
  rewardPoints: 250,
  activityPoints: 200,
  engagementLevel: 'High',
  email: 'kiranya@university.edu',
  phone: '+91 9000000101',
  rollNo: 'CSE3001'
},

{
  name: 'Jeevitha S',
  department: 'Information Technology',
  year: '2nd Year',
  classification: 'intermediate',
  mentor: 'Dr. Kavitha',
  warden: 'Ms. Latha',
  residenceType: 'Day Scholar',
  attendance: { percentage: 84, presentDays: 135, totalDays: 160, leaveCount: 5 },
  academics: { semesters: [{ sem: 2, sgpa: 8.2 }], cgpa: 8.1 },
  platforms: { github: 'https://github.com/JEEVITHA2855', leetcode: 'leetcode.com/u/Jeevitha_05/', linkedin: 'www.linkedin.com/in/jeevitha2805' },
  skills: ['Java', 'SQL'],
  trainings: ['Cloud Basics'],
  skillsToLearn: ['Microservices'],
  rewardPoints: 180,
  activityPoints: 140,
  engagementLevel: 'Medium',
  email: 'jeevitha@university.edu',
  phone: '+91 9000000102',
  rollNo: 'IT2002'
},

{
  name: 'Sandhyaa K',
  department: 'Electronics & Communication',
  year: '3rd Year',
  classification: 'advanced',
  mentor: 'Dr. Ramesh',
  warden: 'Mr. Kumar',
  residenceType: 'Hosteller',
  attendance: { percentage: 88, presentDays: 140, totalDays: 160, leaveCount: 4 },
  academics: { semesters: [{ sem: 3, sgpa: 8.8 }], cgpa: 8.7 },
  platforms: { github: 'https://github.com/Sandhyaa-kumar', linkedin: 'https://www.linkedin.com/in/sandhyaa-k' },
  skills: ['Embedded Systems', 'C++'],
  trainings: ['IoT Workshop'],
  skillsToLearn: ['AI'],
  rewardPoints: 210,
  activityPoints: 170,
  engagementLevel: 'High',
  email: 'sandhyaa@university.edu',
  phone: '+91 9000000103',
  rollNo: 'ECE3003'
},

{
  name: 'Subiksha M',
  department: 'Computer Science & Engineering',
  year: '4th Year',
  classification: 'advanced',
  mentor: 'Dr. Anand',
  warden: 'Ms. Priya',
  residenceType: 'Hosteller',
  attendance: { percentage: 90, presentDays: 144, totalDays: 160, leaveCount: 3 },
  academics: { semesters: [{ sem: 7, sgpa: 9.0 }], cgpa: 9.1 },
  platforms: { github: 'https://github.com/SubikshaMoorthi', leetcode: 'https://leetcode.com/u/SubikshaMoorthi/', linkedin: 'https://www.linkedin.com/in/subiksha27/' },
  skills: ['Python', 'Machine Learning'],
  trainings: ['AI Training'],
  skillsToLearn: ['Deep Learning'],
  rewardPoints: 260,
  activityPoints: 210,
  engagementLevel: 'High',
  email: 'subiksha@university.edu',
  phone: '+91 9000000104',
  rollNo: 'CSE4004'
},

// 5 MORE STUDENTS (generated)

{
  name: 'Arjun N',
  department: 'Mechanical Engineering',
  year: '2nd Year',
  classification: 'intermediate',
  mentor: 'Dr. Suresh',
  warden: 'Mr. Babu',
  residenceType: 'Day Scholar',
  attendance: { percentage: 76, presentDays: 122, totalDays: 160, leaveCount: 6 },
  academics: { semesters: [{ sem: 2, sgpa: 7.5 }], cgpa: 7.4 },
  platforms: { github: 'https://github.com/arjunN' },
  skills: ['AutoCAD'],
  trainings: ['Design Basics'],
  skillsToLearn: ['Robotics'],
  rewardPoints: 120,
  activityPoints: 80,
  engagementLevel: 'Medium',
  email: 'arjun@university.edu',
  phone: '+91 9000000105',
  rollNo: 'ME2005'
},

{
  name: 'Divya R',
  department: 'Information Technology',
  year: '1st Year',
  classification: 'foundational',
  mentor: 'Dr. Meena',
  warden: 'Ms. Devi',
  residenceType: 'Hosteller',
  attendance: { percentage: 65, presentDays: 104, totalDays: 160, leaveCount: 10 },
  academics: { semesters: [{ sem: 1, sgpa: 6.5 }], cgpa: 6.4 },
  platforms: { linkedin: 'https://linkedin.com/divyaR' },
  skills: ['HTML', 'CSS'],
  trainings: ['Web Basics'],
  skillsToLearn: ['JavaScript'],
  rewardPoints: 60,
  activityPoints: 40,
  engagementLevel: 'Low',
  email: 'divya@university.edu',
  phone: '+91 9000000106',
  rollNo: 'IT1006'
},

{
  name: 'Vignesh K',
  department: 'Computer Science & Engineering',
  year: '3rd Year',
  classification: 'advanced',
  mentor: 'Dr. Kumar',
  warden: 'Mr. Raj',
  residenceType: 'Hosteller',
  attendance: { percentage: 89, presentDays: 142, totalDays: 160, leaveCount: 3 },
  academics: { semesters: [{ sem: 3, sgpa: 8.9 }], cgpa: 8.8 },
  platforms: { github: 'https://github.com/vigneshk' },
  skills: ['Node.js', 'MongoDB'],
  trainings: ['Backend Dev'],
  skillsToLearn: ['DevOps'],
  rewardPoints: 200,
  activityPoints: 160,
  engagementLevel: 'High',
  email: 'vignesh@university.edu',
  phone: '+91 9000000107',
  rollNo: 'CSE3007'
},

{
  name: 'Harini P',
  department: 'Electronics & Communication',
  year: '2nd Year',
  classification: 'intermediate',
  mentor: 'Dr. Ravi',
  warden: 'Ms. Latha',
  residenceType: 'Day Scholar',
  attendance: { percentage: 80, presentDays: 128, totalDays: 160, leaveCount: 5 },
  academics: { semesters: [{ sem: 2, sgpa: 8.0 }], cgpa: 7.9 },
  platforms: { linkedin: 'https://linkedin.com/hariniP' },
  skills: ['Circuit Design'],
  trainings: ['Electronics Lab'],
  skillsToLearn: ['VLSI'],
  rewardPoints: 150,
  activityPoints: 120,
  engagementLevel: 'Medium',
  email: 'harini@university.edu',
  phone: '+91 9000000108',
  rollNo: 'ECE2008'
},

{
  name: 'Rohit S',
  department: 'CSE',
  year: '4th Year',
  classification: 'advanced',
  mentor: 'Dr. Anand',
  warden: 'Mr. Suresh',
  residenceType: 'Hosteller',
  attendance: { percentage: 93, presentDays: 149, totalDays: 160, leaveCount: 1 },
  academics: { semesters: [{ sem: 7, sgpa: 9.4 }], cgpa: 9.3 },
  platforms: { github: 'https://github.com/rohitS' },
  skills: ['AI', 'Deep Learning'],
  trainings: ['ML Bootcamp'],
  skillsToLearn: ['NLP'],
  rewardPoints: 300,
  activityPoints: 250,
  engagementLevel: 'High',
  email: 'rohit@university.edu',
  phone: '+91 9000000109',
  rollNo: 'CSE4009'
}
];

const run = async () => {
  const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2'
  },
  connectTimeout: 10000
});

  await connection.query(`USE \`${process.env.DB_NAME || 'student_engagement_tracker'}\``);

  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
// Split on semicolon followed by a newline (handles most SQL files)
const statements = schemaSql
  .split(/;\s*[\r\n]+/)
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

for (const stmt of statements) {
  await connection.query(stmt);
}
  const [rows] = await connection.query('SELECT COUNT(*) as count FROM students');
  if (rows[0].count > 0) {
    console.log('Database already seeded.');
    await connection.end();
    process.exit(0);
  }

  for (const student of seedStudents) {
    await connection.query(
      `INSERT INTO students
       (name, department, year, classification, mentor, warden, residence_type,
        attendance_percentage, attendance_present_days, attendance_total_days, attendance_leave_count,
        academics_semesters, academics_cgpa, platforms, skills, trainings, skills_to_learn,
        reward_points, activity_points, engagement_level, email, phone, roll_no)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student.name, student.department, student.year, student.classification, student.mentor, student.warden, student.residenceType,
        student.attendance.percentage, student.attendance.presentDays, student.attendance.totalDays, student.attendance.leaveCount,
        JSON.stringify(student.academics.semesters), student.academics.cgpa,
        JSON.stringify(student.platforms), JSON.stringify(student.skills), JSON.stringify(student.trainings), JSON.stringify(student.skillsToLearn),
        student.rewardPoints, student.activityPoints, student.engagementLevel, student.email, student.phone, student.rollNo
      ]
    );
  }

  await connection.query(
    `INSERT INTO notifications (type, message, student_name, department, timestamp, is_read)
     VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)`,
    [
      'inactive', 'Student Sneha Reddy from Electronics & Communication is inactive for a long time', 'Sneha Reddy', 'Electronics & Communication', new Date(), 0,
      'drop', 'Student Rahul Mehta dropped from Advanced to Intermediate', 'Rahul Mehta', 'Information Technology', new Date(), 0
    ]
  );

  console.log('Seed data inserted.');
  await connection.end();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ FULL ERROR:', err);
  process.exit(1);
});
