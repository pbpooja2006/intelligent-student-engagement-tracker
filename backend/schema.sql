-- MySQL schema for student_engagement_tracker

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'teacher') DEFAULT 'teacher',
  department VARCHAR(255) DEFAULT '',
  designation VARCHAR(255) DEFAULT '',
  mentor_id VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  year VARCHAR(50) NOT NULL,
  classification ENUM('advanced', 'intermediate', 'foundational') DEFAULT 'intermediate',
  mentor VARCHAR(255) DEFAULT '',
  warden VARCHAR(255) DEFAULT '',
  residence_type ENUM('Hosteller', 'Day Scholar') DEFAULT 'Hosteller',
  attendance_percentage INT DEFAULT 0,
  attendance_present_days INT DEFAULT 0,
  attendance_total_days INT DEFAULT 0,
  attendance_leave_count INT DEFAULT 0,
  academics_semesters JSON,
  academics_cgpa DECIMAL(4,2) DEFAULT 0,
  platforms JSON,
  skills JSON,
  trainings JSON,
  skills_to_learn JSON,
  reward_points INT DEFAULT 0,
  activity_points INT DEFAULT 0,
  engagement_level ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) DEFAULT '',
  roll_no VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS engagements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  attendance JSON,
  participation_score INT DEFAULT 0,
  assignment_score INT DEFAULT 0,
  quiz_score INT DEFAULT 0,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_engagement_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('inactive', 'drop', 'info') DEFAULT 'info',
  message TEXT NOT NULL,
  student_name VARCHAR(255) DEFAULT '',
  department VARCHAR(255) DEFAULT '',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_read TINYINT(1) DEFAULT 0,
  student_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_notification_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  period VARCHAR(100) DEFAULT '',
  summary TEXT,
  metrics JSON,
  generated_by INT NULL,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_report_user FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
);
