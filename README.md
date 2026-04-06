# 🎓 Student Engagement Tracker

## 📌 Project Overview

The **Student Engagement Tracker** is a full-stack web application designed to monitor, analyze, and improve student performance and engagement in an academic environment.

This system helps educators:

* Track student academic performance
* Monitor activity and reward points
* Classify students into different engagement levels
* Identify inactive or low-performing students
* Manage student data efficiently

---

## 🚀 Features

### 🔐 Authentication

* Secure educator login system

### 📊 Student Classification

Students are categorized into:

* 🟢 **Advanced Learners**
* 🟡 **Intermediate Learners**
* 🔴 **Foundational Learners**

Based on:

* Reward points
* Activity points
* Academic performance

---

### 🧭 Navigation Flow

* Select Category → Year → Department → Students List

---

### 👤 Student Details

Each student profile includes:

* Name, Roll Number
* Department & Year
* Mentor Details
* Email & Contact Info
* Attendance (Present / Absent / Percentage)
* Semester-wise SGPA (Graph)
* CGPA
* Coding Profiles (GitHub, LeetCode, LinkedIn, etc.)
* Skills & Trainings
* Reward & Activity Points
* Engagement Level

---

### ➕ Student Management

* Add new students
* Delete existing students
* Dynamic category updates

---

### 🔔 Notifications

* Alerts for inactive students
* Alerts when a student drops category (e.g., Advanced → Intermediate)

---

### 👩‍🏫 Educator Dashboard

* View educator profile
* Track mentees
* Identify inactive mentees

---

## 🛠️ Technologies Used

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Node.js
* Express.js

### Database

* MySQL

---

## ⚙️ Installation & Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project folder
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 🗄️ Database Setup

* Create MySQL database: `student_tracker`
* Import the provided `schema.sql`
* Insert student data using SQL scripts

---

## 📊 Key Functionalities

* Filter students by:

  * Category
  * Department
  * Year
* Real-time student classification
* Data visualization using graphs
* Mentor-based tracking

---

## 🎯 Project Goal

To build an intelligent system that enables educators to:

* Make data-driven decisions
* Improve student engagement
* Identify and support struggling students

---

## 📌 Future Enhancements

* PDF report generation
* Admin panel
* Role-based access control
* Real-time notifications
* Integration with external learning platforms

---

✨ *Turning data into insights. Turning students into achievers.*
