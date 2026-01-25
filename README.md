# Leave Management System

A comprehensive leave management application built with **Angular** (frontend) and **Spring Boot** (backend) that enables employees, managers, and admins to manage leave requests, approvals, and leave allocation.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [License](#license)

## ✨ Features

### Employee Features
- **Apply for Leave**: Submit leave requests with date range and reason
- **View My Leaves**: Track all submitted leave requests and their status
- **Dashboard**: Overview of leave balance and recent requests

### Manager Features
- **Pending Approvals**: Review and approve/reject leave requests from team members
- **Team Leaves**: View all leaves of the team with filtering options
- **Leave Reports**: Generate and view leave reports for the team

### Admin Features
- **Allocate Leaves**: Assign leave balance to employees
- **System Management**: Full control over all leave requests and allocations

## 🛠️ Tech Stack

### Frontend
- **Angular** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **HTML/CSS** - UI markup and styling
- **RxJS** - Reactive programming

### Backend
- **Spring Boot** - Java-based framework
- **Spring Security** - Authentication & Authorization
- **JPA/Hibernate** - ORM for database operations
- **Maven** - Build and dependency management

### Database
- **H2 Database** - In-memory relational database (development/testing)

## 📂 Project Structure

```
├── frontend/                          # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/           # UI Components
│   │   │   │   ├── admin/            # Admin dashboard components
│   │   │   │   ├── auth/             # Login & Registration
│   │   │   │   ├── employee/         # Employee features
│   │   │   │   ├── manager/          # Manager features
│   │   │   │   ├── shared/           # Shared components & services
│   │   │   │   └── app/              # Root app component
│   │   │   ├── guards/               # Route guards (authentication, authorization)
│   │   │   ├── interceptors/         # HTTP interceptors
│   │   │   ├── models/               # TypeScript interfaces & types
│   │   │   ├── services/             # API & business logic services
│   │   │   └── app-routing.ts        # Route definitions
│   │   └── index.html
│   ├── angular.json                  # Angular configuration
│   └── package.json                  # Dependencies
│
├── src/main/java/com/example/gen_ai/ # Spring Boot application
│   ├── GenAiApplication.java         # Application entry point
│   ├── config/                       # Configuration classes
│   ├── controller/                   # REST endpoints
│   ├── dto/                          # Data Transfer Objects
│   ├── model/                        # Entity models
│   ├── repository/                   # Database repositories
│   ├── security/                     # Security configuration
│   └── service/                      # Business logic
│
├── pom.xml                           # Maven configuration
└── README.md                         # This file
```

## 📋 Prerequisites

- **Java 11+** - For running the backend
- **Node.js 16+** - For running the frontend
- **npm** - Package manager for Node.js
- **Maven 3.6+** - Build tool for the backend
- **Database** - Configure as needed (MySQL, PostgreSQL, etc.)

## 🚀 Installation & Setup

### Backend Setup (Spring Boot)

1. **Navigate to the project root:**
   ```bash
   cd e:\deep\Leavemanagementsystem-Code
   ```

2. **Configure the database:**
   - The project uses **H2 Database** (in-memory database)
   - H2 is pre-configured and requires no additional setup
   - Configuration in `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:h2:mem:testdb
     spring.datasource.driverClassName=org.h2.Driver
     spring.datasource.username=sa
     spring.datasource.password=
     spring.h2.console.enabled=true
     spring.jpa.hibernate.ddl-auto=create-drop
     ```

3. **Build the backend:**
   ```bash
   mvn clean install
   ```

### Frontend Setup (Angular)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API endpoint:**
   - Update the API service in `src/app/services/api.service.ts` with your backend URL
   - Default: `http://localhost:8080`

## ▶️ Running the Application

### Start the Backend

```bash
# Option 1: Using mvn spring-boot:run
mvn spring-boot:run

# Option 2: Using Java directly (after build)
java -jar target/gen_ai-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

### Start the Frontend

```bash
cd frontend
ng serve
```

The frontend will start on `http://localhost:4200`

### Access the Application

Open your browser and navigate to: `http://localhost:4200`

**Test Credentials:**
- Admin: admin@company.com / password
- Manager: manager@company.com / password
- Employee: employee@company.com / password

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-Based Access Control** - Different features for different roles
- **Route Guards** - Protected routes based on user roles
- **HTTP Interceptors** - Automatic token attachment to requests
- **CORS Configuration** - Cross-origin resource sharing

## 👥 User Roles

### Admin
- Allocate leave balance to employees
- View all system activities
- Manage all leave requests

### Manager
- View pending leave approvals
- Approve or reject leave requests
- View team member leaves
- Generate leave reports

### Employee
- Apply for leave
- View personal leave status
- Check leave balance
- Track leave history

## 📝 Environment Configuration

### Backend (`src/main/resources/application.properties`)
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# H2 Database Configuration (In-Memory)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# JWT Configuration
app.jwt.secret=your-secret-key
app.jwt.expiration=86400000
```

### Frontend (`frontend/src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 📚 API Documentation

The backend provides REST APIs for all leave management operations. Endpoints include:

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Leaves**: `/api/leaves/apply`, `/api/leaves/my-leaves`, `/api/leaves/pending`
- **Users**: `/api/users/profile`, `/api/users/team`
- **Reports**: `/api/reports/leave-summary`

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ❓ Support

For issues and questions, please open an issue in the repository.