# SupportService API

A production-grade, modular monolith RESTful backend for ticket and customer support management built with Node.js, Express, TypeScript, PostgreSQL, and Drizzle ORM.

---

## Features

- **Authentication & RBAC:** Stateless JWT authentication with role-based access control (`customer`, `agent`, `admin`).
- **Resource Ownership Scoping:** Strict tenant isolation so customers only access their own tickets and comments.
- **Ticket Lifecycle Management:** Enforced state transitions (`open` -> `in_progress` -> `resolved` / `closed`) with admin-only reopening rules.
- **Paginated Filtering:** Dynamic PostgreSQL queries with metadata (`totalCount`, `totalPages`, `hasNextPage`) and Drizzle `SQL[]` conditions.
- **Type Safety & Validation:** End-to-end request validation using Zod schemas with runtime environment variable parsing.
- **Modular Monolith Architecture:** Service-oriented folder layout separating routes, controllers, services, schemas, and database relations.

---

## Tech Stack

- **Runtime:** Node.js, TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM (with Drizzle Kit migrations & pgAdmin 4 support)
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`

---

## Project Structure

```text

src/
├── db/                     # Drizzle schema, relations, pgEnum, & DB client
├── modules/
│   ├── auth/               # Login, registration, password hashing
│   ├── tickets/            # Lifecycle logic, query filters, ownership checks
│   ├── comments/           # Sub-resource comment controllers & service
│   └── users/              # User management & admin endpoints
├── shared/
│   ├── errors/             # AppError & centralized error handling middleware
│   └── middlewares/        # Authentication & requireRole RBAC guards
├── types/                  # Express Request interface context extensions
├── app.ts                  # Express application configuration
└── server.ts               # Server entry point

```

## Getting Started

### 1. Prerequisites
  - Node.js (v18+)
  - PostgreSQL installed locally or via Docker
  - npm or pnpm

### 2. Environment Setup
  
 - Create a .env file in the root directory:
    
  ```code

  PORT=5000
  NODE_ENV=development
  DATABASE_URL=postgres://postgres:password@localhost:5432/support_db
  JWT_SECRET=your_super_secret_jwt_key
  JWT_EXPIRES_IN=1d

 ```

### 3. Installation & Database Setup

```code
# Install dependencies
npm install

# Push schema to PostgreSQL database
npx drizzle-kit push

# Start development server
npm run dev
```

## API Documentation Overview
 
 ### Authentication
 
 ```text

 POST /api/auth/register - Create a new user account

 POST /api/auth/login - Authenticate and receive a Bearer JWT token

```
 ### Tickets

 ```text

 POST /api/tickets - Create a new support ticket (customer)

 GET /api/tickets - Fetch paginated tickets (Scoped by ownership for customer; All for agent/admin)

 GET /api/tickets/:id - Fetch single ticket details (Ownership validated)

 PATCH /api/tickets/:id - Update status/assignment (agent, admin - follows state transition rules)

```

###  Ticket Comments

```text

POST /api/tickets/:id/comments - Add a comment to a ticket (Ticket owner, assigned agent, or admin only)

```

### Security Highlights
 
 - Anti-Identity Spoofing: customerId and authorId are stripped from client request bodies and injected directly from verified JWT claims (req.user.userId).
 - Forbidden Route Guards: Middleware blocks unauthorized roles with standard 403 Forbidden responses prior to execution.
 - Parameterized Queries: All dynamic filters utilize Drizzle's SQL expression trees to prevent SQL injection.
