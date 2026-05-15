# 🍱 Foodie — Discover & Order Delicious Meals

Foodie is a full-stack meal ordering web application. Customers can browse menus from various food providers, place orders, and track delivery status. Providers manage their menus and fulfil orders. Admins oversee the platform and all users.

**Live Demo:**
- Frontend: [foodie-client-one.vercel.app](https://foodie-client-one.vercel.app)
- Backend API: [foodie-backend-ruby.vercel.app](https://foodie-backend-ruby.vercel.app)

**Repositories:**
- Frontend: [AbdurRahman11072/foodieClient](https://github.com/AbdurRahman11072/foodieClient)
- Backend: [AbdurRahman11072/foodie_backend](https://github.com/AbdurRahman11072/foodie_backend)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Roles & Permissions](#roles--permissions)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Deployment](#deployment)

---

## Overview

Foodie connects customers with local food providers through a clean, role-based web platform. Users register as either a **Customer** or a **Provider**, with **Admin** accounts seeded directly into the database.

The application supports the complete food ordering lifecycle: browsing meals, adding to cart, checking out with a delivery address (Cash on Delivery), real-time order status updates, and post-order reviews.

---

## Tech Stack

### Frontend (`foodieClient`)

| Category | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Forms | React Hook Form + Zod |
| Auth | better-auth |
| Data Tables | TanStack Table |
| Charts | Recharts |
| Animations | Framer Motion |
| HTTP Client | Native fetch |
| Package Manager | pnpm |

### Backend (`foodie_backend`)

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Language | TypeScript |
| ORM | Prisma v7 |
| Database | PostgreSQL (via `pg`) |
| Auth | better-auth |
| File Uploads | Multer + Cloudinary |
| Package Manager | pnpm |

---

## Features

### Public
- Browse all available meals and providers
- Filter meals by cuisine, dietary preferences, and price
- View provider profiles with their menus

### Customer
- Register and log in as a customer
- Add meals to cart and adjust quantities
- Place orders with a delivery address (Cash on Delivery)
- Track order status in real time
- Leave reviews after receiving an order
- Manage account profile

### Provider
- Register and log in as a provider
- Add, edit, and remove menu items
- View and manage incoming orders
- Update order statuses (Preparing → Ready → Delivered)

### Admin
- View and manage all users (customers and providers)
- Suspend or activate user accounts
- View all orders across the platform
- Manage food categories

---

## Roles & Permissions

| Role | Description | Key Permissions |
|---|---|---|
| **Customer** | End users who order meals | Browse menus, place orders, track status, leave reviews |
| **Provider** | Food vendors / restaurants | Manage menu items, view and update orders |
| **Admin** | Platform moderators | Manage all users, oversee all orders, manage categories |

> **Note:** Users choose their role at registration. Admin accounts are seeded directly into the database using the seed script.

---

## Project Structure

```
foodieClient/          # Next.js frontend
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js App Router pages & layouts
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utilities, auth config, API helpers
│   └── types/         # TypeScript type definitions
├── components.json    # shadcn/ui config
├── next.config.ts
└── package.json

foodie_backend/        # Express.js backend
├── prisma/            # Prisma schema & migrations
├── scripts/           # Build utility scripts
├── src/
│   ├── app/
│   │   ├── modules/   # Feature modules (auth, meals, orders, etc.)
│   │   └── script/    # Seed scripts (e.g., seedAdmin.ts)
│   ├── middleware/     # Auth & error middleware
│   └── server.ts      # Express app entry point
├── postman_collection.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- PostgreSQL database

### 1. Clone the Repositories

```bash
git clone https://github.com/AbdurRahman11072/foodieClient.git
git clone https://github.com/AbdurRahman11072/foodie_backend.git
```

### 2. Set Up the Backend

```bash
cd foodie_backend
pnpm install

# Configure your environment variables (see below)
cp .env.example .env

# Run database migrations
pnpm mg

# Generate Prisma client
pnpm ge

# Seed the admin user
pnpm seed

# Start the development server
pnpm dev
```

The API will be available at `http://localhost:5000` (or whichever port is configured).

### 3. Set Up the Frontend

```bash
cd foodieClient
pnpm install

# Configure your environment variables (see below)
cp .env.example .env.local

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/Foodie"
PORT=5000
BETTER_AUTH_SECRET="your-auth-secret"
BETTER_AUTH_URL="http://localhost:5000"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
BETTER_AUTH_SECRET="your-auth-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login a user | Public |
| GET | `/api/auth/me` | Get the current user | Authenticated |

### Meals & Providers

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/meals` | Get all meals (with filters) | Public |
| GET | `/api/meals/:id` | Get meal details | Public |
| GET | `/api/providers` | Get all providers | Public |
| GET | `/api/providers/:id` | Get provider with menu | Public |

### Orders

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/orders` | Place a new order | Customer |
| GET | `/api/orders` | Get current user's orders | Customer |
| GET | `/api/orders/:id` | Get order details | Customer / Provider |

### Provider Management

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/provider/meals` | Add a meal to the menu | Provider |
| PUT | `/api/provider/meals/:id` | Update a meal | Provider |
| DELETE | `/api/provider/meals/:id` | Remove a meal | Provider |
| PATCH | `/api/provider/orders/:id` | Update order status | Provider |

### Admin

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/users` | Get all users | Admin |
| PATCH | `/api/admin/users/:id` | Update user status | Admin |
| GET | `/api/admin/orders` | Get all orders | Admin |
| GET | `/api/admin/categories` | Manage categories | Admin |

> A full Postman collection is available at `foodie_backend/postman_collection.json`.

---

## Database Schema

The following tables form the core data model:

| Table | Description |
|---|---|
| `Users` | User accounts, roles, and authentication details |
| `ProviderProfiles` | Restaurant/vendor-specific info (linked to Users) |
| `Categories` | Food categories (cuisine types, dietary labels) |
| `Meals` | Menu items offered by providers |
| `Orders` | Customer orders including line items and status |
| `Reviews` | Customer reviews submitted after delivery |

### Order Status Flow

```
PLACED
  ├── → PREPARING  (provider accepts)
  │       └── → READY
  │               └── → DELIVERED
  └── → CANCELLED  (customer cancels)
```

---

## Deployment

Both services are configured for deployment on **Render** (via `render.yaml`) and the backend is also configured for **Vercel** (via `vercel.json`).

### Frontend — Vercel

```bash
# In the foodieClient directory
pnpm build
# Deploy via Vercel CLI or connect the GitHub repo to Vercel
```

### Backend — Render / Vercel

```bash
# In the foodie_backend directory
pnpm build   # runs: prisma generate && tsc && node scripts/fix-imports.js
pnpm start   # runs: node dist/server.js
```

---

## Contributing

1. Fork the relevant repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is private and not licensed for public distribution.
