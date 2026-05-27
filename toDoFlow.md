# 🚀 DevPulse Backend Checklist

## 🛠️ Project Setup
- [x] Initialize Node.js project (npm init)
- [x] Install Express
- [x] Install TypeScript
- [x] Configure tsconfig.json
- [x] Setup dev script (ts-node-dev / tsx)
- [x] Create folder structure (config, modules, middleware, utils)
- [x] Setup Express app.ts
- [x] Setup server.ts

---

## ⚙️ Environment Setup
- [x] Create .env file
- [x] Setup config/index.ts for env variables
- [x] Add PORT configuration
- [x] Add DATABASE_URL configuration
- [x] Add JWT_SECRET configuration

---

## 🗄️ Database (PostgreSQL)
- [x] Create database connection file (db/index.ts)
- [x] Setup pg Pool connection
- [x] Test database connection
- [x] Create users table
- [x] Create issues table

---

## 📦 Project Structure (Modular Architecture)
- [x] Create modules folder
- [x] Create auth module (route, controller, service)
- [x] Create issues module (route, controller, service)
- [x] Create users module (route, controller, service)
- [x] Create utility folder (sendResponse)
- [x] Create middleWare folder (auth.ts for RBAC authorization, globalErrorHandler.ts, index.d.ts for namespace
      logger.ts)
- [x] Create types folder (index.ts for userRole type)

---

## 👥 Users Module
- [x] Create users API
- [x] Get all users API
- [x] Get single users API
- [x] Update users API
- [x] Delete users API

---

## 🐛 Issues Module
- [x] Create issue API
- [x] Get all issues API
- [x] Get single issue API
- [x] Update issue API
- [x] Delete issue API

---

## 🔐 Auth Module
- [x] Signup API
- [x] Login API
- [x] Password hashing (bcrypt)
- [x] JWT token generation
- [x] JWT verification middleware

---

## 🛡️ Authorization
- [x] Auth middleware (protect routes)
- [x] Role-based access (contributor / maintainer)

---

## 🔎 Features
- [x] Filtering issues (type, status)
- [x] Sorting (newest / oldest)

---

## ⚠️ Error Handling
- [x] Standard success response format
- [x] Standard error response format
- [x] Global error handler middleware

---

## 🚀 Deployment
- [x] Deploy backend in Vercel
- [x] Setup PostgreSQL cloud DB
- [x] Configure environment variables in production

---

## 📄 Documentation
- [x] Write README.md
- [x] Add API endpoints list
- [x] Add setup instructions
- [x] Add live backend URL