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
- [ ] Auth middleware (protect routes)
- [ ] Role-based access (contributor / maintainer)

---

## 🔎 Features
- [ ] Filtering issues (type, status)
- [ ] Sorting (newest / oldest)

---

## ⚠️ Error Handling
- [ ] Standard success response format
- [ ] Standard error response format
- [ ] Global error handler middleware

---

## 🚀 Deployment
- [ ] Deploy backend (Render / Railway / Vercel)
- [ ] Setup PostgreSQL cloud DB
- [ ] Configure environment variables in production

---

## 📄 Documentation
- [ ] Write README.md
- [ ] Add API endpoints list
- [ ] Add setup instructions
- [ ] Add live backend URL