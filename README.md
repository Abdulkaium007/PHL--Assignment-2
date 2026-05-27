# 🚀 DevPulse Backend API

A role-based Issue Tracking System API built with **Node.js, Express.js, TypeScript, and PostgreSQL**.

This backend supports:
- JWT Authentication
- Refresh Token mechanism
- Role-based Authorization (RBAC)
- User Management
- Issue Management
- Protected Routes
- Sorting & relational response formatting
- Global Error Handling

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">


# 🌐 Live API

## Base URL
https://phl2assignment-2.vercel.app

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">

# 🔗 API Endpoints

## 🔐 Authentication Routes

| Method |         Endpoint       |         Description        |
| :---:  |          :---:         |          :---:             |
|  POST  |     `/auth/signup`     |      Register new user     |
|  POST  |      `/auth/login`     |          Login user        |
|  POST  |  `/auth/refresh-token` |  Generate new access token |

### Live Links
- https://phl2assignment-2.vercel.app/auth/signup
- https://phl2assignment-2.vercel.app/auth/login
- https://phl2assignment-2.vercel.app/auth/refresh-token

<hr style="border: 2px solid;">

## 👤 User Routes

| Method |     Endpoint     |                 Access               |
| :---:  |      :---:       |                  :---:               |
|   GET  |    `/api/users`  |               Maintainer             |
|   GET  | `/api/users/:id` |               Maintainer             |
|   PUT  | `/api/users/:id` | Contributor(Owner only) / Maintainer |
| DELETE | `/api/users/:id` |               Maintainer             |

### Live Link
https://phl2assignment-2.vercel.app/api/users

<hr style="border: 2px solid;">

## 🐛 Issue Routes

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/issues` | Contributor / Maintainer |
| GET | `/api/issues` | Authenticated Users |
| GET | `/api/issues/:id` | Authenticated Users |
| PUT | `/api/issues/:id` | Owner / Maintainer |
| DELETE | `/api/issues/:id` | Maintainer |

### Live Link
https://phl2assignment-2.vercel.app/api/issues

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">

# ✨ Features

- 🔐 JWT Authentication System
- ♻ Refresh Token Support
- 👥 Role-Based Access Control
- 🛡 Protected Routes Middleware
- 🔑 Password Hashing using bcrypt
- 🐛 Issue CRUD Operations
- 👤 User CRUD Operations
- 📊 Issue Sorting (`newest`, `oldest`)
- 🔗 Reporter Information Population
- ⚠ Global Error Handling
- 📦 Modular Architecture

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">

# 🧰 Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL (NeonDB)
- JWT (jsonwebtoken)
- bcrypt
- dotenv
- cookie-parser
- cors

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Abdulkaium007/PHL--Assignment-2.git

```

<hr style="border: 2px solid;">

## 2️⃣ Install Dependencies

```bash
npm install
```

<hr style="border: 2px solid;">

## 3️⃣ Configure Environment Variables

Create a `.env` file:

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

<hr style="border: 2px solid;">

## 4️⃣ Run Development Server

```bash
npm run dev
```

<hr style="border: 2px solid;">

## 5️⃣ Build Production

```bash
npm run build
npm start
```

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">

# 🗄 Database Schema Summary

## 👤 Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'contributor',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
```

<hr style="border: 2px solid;">

## 🐛 Issues Table

```sql
CREATE TABLE IF NOT EXISTS issues (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                type VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'open',
                reporter_id INTEGER NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
```

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">

# 📊 Sorting Feature

Issues endpoint supports sorting using query parameters:

| Query | Description |
|------|-------------|
| `?sort=newest` | Latest issues first |
| `?sort=oldest` | Oldest issues first |

### Example

```http
GET /api/issues?sort=newest
```

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">

# 🛡 Role Permissions

## 👤 Contributor
- Can update own user info only
- Can create issues
- Can update own issues only
- Cannot change issue status
- Cannot delete issues

## 🛠 Maintainer
- Full access to users
- Full access to issues
- Can change issue status
- Can delete issues

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">

# ⚠️ HTTP Status Codes Used

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">


# 🧠 Project Architecture

```bash
src/
├── config/
├── db/
├── middleware/
├── modules/
│   ├── auth/
│   ├── issues/
│   └── users/
├── types/
├── utils/
├── app.ts
└── server.ts
```

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">


# 🚀 Future Improvements

- Pagination
- Filtering
- Advanced Search
- Swagger Documentation
- Unit Testing
- Docker Support

<hr style="border: 2px solid;">
<hr style="margin-bottom: 30px;">


# 👨‍💻 Author

Developed by **Sk Md Abdul Kaium**