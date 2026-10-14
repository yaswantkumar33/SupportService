# SupportService Master Progress Log & Daily Activity

**Project:** Support Service (Modular Monolith)  
**Tech Stack:** Node.js, Express, TypeScript, PostgreSQL (`dev_support_db`), Drizzle ORM, Zod

---

## 1. Project Initialization & Database Architecture (Oct 6, 2026)

### Key Achievements

- **PostgreSQL Setup:** Created `dev_support_db` database in pgAdmin 4.
- **Environment Validation:** Built `src/config/env.ts` using Zod schema to validate required runtime variables (`PORT`, `DATABASE_URL`, `NODE_ENV`).
- **Drizzle Pool Setup:** Initialized database connection pool in `src/db/index.ts` passing `{ schema }` to enable Drizzle relational queries.
- **Database Schema (`src/db/schema.ts`):**
  - Created `users` and `tickets` tables with auto-generated UUID primary keys (`defaultRandom()`).
  - Defined PostgreSQL enums for `role` (`customer`, `agent`, `admin`), `status` (`open`, `in_progress`, `resolved`, `closed`), and `priority` (`low`, `medium`, `high`, `urgent`).
  - Configured foreign key cascading constraints (`ON DELETE CASCADE` on `customerId`, `ON DELETE SET NULL` on `assignedAgentId`).
  - Added indexes (`idx_tickets_customer_id`, `idx_tickets_status`).
- **Database Push:** Synchronized schema directly to PostgreSQL using `npx drizzle-kit push`.

---

## 2. Domain Modules Development (Oct 7, 2026)

### Key Achievements

- **Users Module (`src/modules/users/`):**
  - Built Zod schema `createUserSchema` for payload validation.
  - Implemented `POST /api/users` with email uniqueness verification.
  - Implemented `GET /api/users` returning embedded ticket arrays via Drizzle relational queries with column filtering.
- **Tickets Module (`src/modules/tickets/`):**
  - Built Zod schema `createTicketSchema`.
  - Implemented `POST /api/tickets` with customer verification prior to ticket creation.
  - Configured Drizzle `relations()` (`usersRelations` and `ticketsRelations`) in `src/db/schema.ts`.
  - Implemented `GET /api/tickets` returning nested customer details (`id`, `name`, `email`), resolving N+1 query bottlenecks.

---

## 3. Centralized Error Handling Middleware (Oct 8–9, 2026)

### Key Achievements

- **Custom Operational Error Class (`src/shared/errors/app-error.ts`):**
  - Created `AppError` class extending `Error` with `statusCode` and `isOperational = true` flags.
- **Global Error Middleware (`src/shared/middlewares/error.middleware.ts`):**
  - Intercepts Zod validation failures and formats structured array errors (`field`, `message`).
  - Intercepts operational `AppError` instances and returns respective HTTP status codes (`400`, `404`, etc.).
  - Handles unexpected server and database exceptions with a fallback `500 Internal Server Error`.
- **Controller Refactoring:** Updated all controllers to catch and delegate errors to `next(error)`.
- **Registered Middleware:** Mounted `app.use(errorHandler)` as the final middleware in `src/index.ts`.
- **Ticket Updates & Agent Assignment API (`PATCH /api/tickets/:id`):**
  - Added `updateTicketSchema` for status changes (`in_progress`, `resolved`, `closed`) and agent assignment.
  - Added role verification in service layer ensuring assigned users hold `agent` or `admin` roles.

---

## 4. Query Filtering, Pagination & Foreign Key Integrity (Oct 13, 2026)

### Key Achievements

- **Advanced Filtering & Pagination (`GET /api/tickets`):**
  - Added `getTicketsQuerySchema` in `tickets.schema.ts` using `z.coerce.number()` for page/limit handling.
  - Updated `getAllTickets` service with dynamic Drizzle `and()` and `eq()` WHERE filters (`?status=open&priority=medium`).
  - Formatted API response payload to return pagination metadata (`page`, `limit`, `data`).
- **User Deletion & Foreign Key Cascading Verification:**
  - Implemented `deleteUser` service method and `handleDeleteUser` controller.
  - Exposed `DELETE /api/users/:id` endpoint in `users.router.ts`.
  - Verified live database behavior in `dev_support_db`: deleting a customer user automatically purged their associated tickets (`ON DELETE CASCADE`).
- **Ticket Comments Schema Design:**
  - Defined `ticketComments` table schema and Drizzle relations (`ticketCommentsRelations`) in `src/db/schema.ts`.

---

## 5. Ticket Comments Sub-resource Module (Oct 14, 2026)

- **Database Schema & Relations:**
  - Created `ticket_comments` table in PostgreSQL (`dev_support_db`) using `npx drizzle-kit push`.
  - Configured foreign key rules (`ON DELETE CASCADE`) linking comments to tickets and author users.
  - Established Drizzle ORM relational definitions (`ticketCommentsRelations` & updated `ticketsRelations`).
- **Comments Module (`src/modules/comments/`):**
  - Built `createCommentSchema` using Zod for validation.
  - Implemented `createComment` service method verifying ticket and author existence.
  - Implemented `getTicketComments` service method returning chronological comment threads (`asc` by `createdAt`) with embedded author metadata (`id`, `name`, `email`, `role`).
- **API Routing:**
  - Mounted comment sub-routes under tickets router (`src/modules/tickets/tickets.router.ts`): `POST /api/tickets/:id/comments` and `GET /api/tickets/:id/comments`.
