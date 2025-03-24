# BiteRush – Backend Service

This repository contains the backend for **BiteRush**, a food delivery platform that supports browsing restaurants and menus, shopping cart management, order placement and cancellation, and payment method management. The backend is built with NestJS and PostgreSQL (using Neon), and it enforces strict Role-Based Access Control (RBAC) and Country-Based Access Control (CBAC).

### Backend Deployed URL:
[https://bite-rush-service.onrender.com](https://bite-rush-service.onrender.com)

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)

---


## Tech Stack

- **Backend Framework:** NestJS
- **Database:** PostgreSQL (hosted on Neon)
- **ORM/Database Client:** TypeORM
- **Authentication:** JWT (with refresh tokens)
- **Deployment:** Render (Docker-based deployment)
- **Package Manager:** Yarn

---

## Environment Variables

In your .env, set the following environment variables **without quotes**:

```env
NODE_ENV=development
PORT=<PORT>
DATABASE_URL=<YOUR_DB_URL>
JWT_SECRET=<SECRET>
JWT_EXPIRES_IN=<EXPIRATION>
JWT_REFRESH_SECRET=<SECRET>
JWT_REFRESH_EXPIRES_IN=<EXPIRATION>
JWT_REFRESH_EXPIRES_IN_MS=<EXPIRATION>
ENCRYPTION_KEY=<YOUR_ENCRYPTION_KEY>
ENCRYPTION_IV=<YOUR_INITIALIZATION_VECTOR>
```

##  API DOCS
- on live application you can visit [https://bite-rush-service.onrender.com/api/docs](https://bite-rush-service.onrender.com/api/docs)
- on local ```<YOUR_BACKEND_URL>/api/docs```


