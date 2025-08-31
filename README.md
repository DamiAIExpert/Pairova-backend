
# Pairova Backend API

Welcome to the official backend repository for **Pairova**, a robust, AI-powered platform designed to connect job seekers with non-profit organizations. Built with a production-ready, scalable architecture using **NestJS**, this API serves as the backbone for all user management, job postings, real-time communication, and administrative functions.

---

## ✨ Features

This backend provides a comprehensive set of features, structured into clean, modular components:

- 🔐 **Authentication & Authorization**: Secure JWT-based authentication, role-based access control (Admin, Applicant, Nonprofit), and OTP verification flows.
- 👤 **User & Profile Management**: Distinct flows and profile management for both Applicants and Non-Profit Organizations.
- 📋 **Job & Application Lifecycle**: Full CRUD for job postings and a complete application tracking system from submission to hiring.
- 🎓 **Rich Profile Building**: Applicants can add detailed Education, Experience, and Certification records to their profiles.
- ☁️ **Cloud File Uploads**: Seamless integration with **Cloudinary** for handling resumes, profile photos, and other file attachments.
- 👑 **Admin Panel**: A powerful administrative module for user management, CMS for landing pages, platform-wide settings (Email, SMS), and detailed audit logs.
- 💬 **Real-Time Communication**: WebSocket-based Messaging for live chat and an Interview scheduling system.
- 🔔 **Notification System**: Multi-channel notifications via Email (SMTP) and real-time in-app alerts.
- 🤖 **AI-Powered Matching**: An intelligent recommendation engine that provides an explainable match score for job-applicant pairings.
- 📚 **API Documentation**: Auto-generated, interactive API documentation via **Swagger** (OpenAPI).

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### **Prerequisites**
- **Node.js** (v18 or later recommended)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for easy database setup)

---

### **1. Clone the Repository**

```bash
git clone <your-repository-url>
cd pairova-backend
```

---

### **2. Install Dependencies**

```bash
npm install
```

---

### **3. Configure Environment**

Copy the example environment file and fill in your configuration details:

```bash
cp .env.example .env
```

Open the `.env` file and set the following variables:

```bash
# Application
PORT=3000
CLIENT_URL=http://localhost:3001

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=pairova
DB_SYNCHRONIZE=true # Set to false in production

# Authentication
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRATION_TIME=3600s # e.g., 1 hour

# SMTP (for Email Service) - Optional
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="Pairova <noreply@pairova.com>"

# Cloudinary (for File Uploads) - Optional
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMS Providers (Termii, Twilio, etc.) - Optional
TERMII_API_KEY=your_termii_key
TERMII_SENDER_ID=Pairova
```

---

### **4. Set Up the Database**

The easiest way to run a PostgreSQL database is with **Docker**. A `docker-compose.yml` file is included for your convenience.

```bash
docker-compose up -d
```

This will create a PostgreSQL instance with the credentials you specified in the `.env` file.

---

## 🏃‍♂️ Running the Application

```bash
# Development mode with hot-reloading
npm run start:dev

# Production mode
npm run start:prod

# Run tests
npm run test
```

Once the application is running, you can access the following endpoints:

- **API Base URL**: [http://localhost:3000](http://localhost:3000)
- **Swagger Docs**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **Chat WebSocket Namespace**: `ws://localhost:3000/chat`
- **Notification WebSocket Namespace**: `ws://localhost:3000/notify`

---

## 📊 Database Schema (ERD)

The database architecture is designed to be scalable and maintainable. The complete schema is defined in the DBML below.

<details>
<summary>Click to view the full Entity-Relationship Diagram (DBML)</summary>

```dbml
//////////////////////////////////////////////////////
// PAIROVA — ERD (DBML for dbdiagram.io)
//////////////////////////////////////////////////////

// -------------------- ENUMS ------------------------
Enum user_role {
  ADMIN
  APPLICANT
  NONPROFIT
}

Enum gender {
  MALE
  FEMALE
  OTHER
  UNDISCLOSED
}

Enum employment_type {
  FULL_TIME
  PART_TIME
  CONTRACT
  VOLUNTEER
  INTERNSHIP
}

// ... (The rest of your ERD schema is included here) ...

Table users {
  id              uuid [pk]
  role            user_role
  email           varchar(255) [unique, not null]
  password_hash   varchar(255)
  phone           varchar(64)
  is_verified     bool [default: false]
  last_login_at   timestamptz
  created_at      timestamptz
  updated_at      timestamptz
}

// ... All other tables from your schema ...

Table recommendation_scores {
  id            uuid [pk]
  job_id        uuid [not null, ref: > jobs.id]
  applicant_id  uuid [not null, ref: > users.id]
  score         numeric(5,2)
  score_details jsonb
  created_at    timestamptz

  indexes {
    (job_id, applicant_id) [unique]
  }
}
```

</details>

---

## 📂 Project Structure

The project follows the standard **NestJS modular architecture**, promoting separation of concerns and scalability.

```
/src
├── admin/            # Admin Panel & CMS
├── ai/               # AI Matching & Scoring
├── auth/             # Authentication & Authorization
├── common/           # Shared Guards, Decorators, Filters, etc.
├── jobs/             # Job & Application Management
├── messaging/        # Real-time Chat & Interviews
├── notifications/    # Email, In-App, and SMS Notifications
├── profiles/         # Profile Building (Edu, Exp, Certs, Uploads)
├── users/            # Core User Management (Applicant & Nonprofit)
├── app.module.ts     # Root Application Module
└── main.ts           # Application Entry Point
```

---

## 📜 License

This project is licensed under the **MIT License**.
