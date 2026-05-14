# 🍱 FoodHub — Backend API

> REST API server for the **FoodHub** meal ordering platform.

Handles authentication, meal browsing, order management, image uploads, and role-based access for Customers, Providers, and Admins.

🌐 **Live API:** [foodie-backend-ruby.vercel.app](https://foodie-backend-ruby.vercel.app)
🔗 **Frontend Repo:** [foodieClient_test](https://github.com/AbdurRahman11072/foodieClient_test)

---

## 🧰 Tech Stack

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
| Deployment | Vercel / Render |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- pnpm `>= 10`
- A PostgreSQL database (local or hosted, e.g. Supabase, Neon)
- A Cloudinary account (for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/AbdurRahman11072/foodie_backend.git
cd foodie_backend

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/foodie_db

# Auth (better-auth)
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=http://localhost:5000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
```

### Database Setup

```bash
# Run Prisma migrations
pnpm mg

# Generate Prisma client
pnpm ge

# Seed the admin user
pnpm seed
```

### Running the Development Server

```bash
pnpm dev
```

The API will be available at `http://localhost:5000`.

### Building for Production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
foodie_backend/
├── prisma/
│   ├── schema/          # Prisma schema files
│   └── migrations/      # Database migration history
├── scripts/
│   └── fix-imports.js   # Post-build ESM import fixer
├── src/
│   ├── app/
│   │   ├── modules/     # Feature modules (auth, meals, orders, users…)
│   │   └── script/      # Seed scripts (e.g. seedAdmin.ts)
│   ├── middleware/       # Auth guards, error handlers
│   ├── utils/            # Shared utilities
│   └── server.ts         # App entry point
├── postman_collection.json  # Postman API collection
├── prisma.config.ts
├── render.yaml           # Render deployment config
├── vercel.json           # Vercel deployment config
└── tsconfig.json
```

---

## 🗃️ Database Schema

| Table | Description |
|---|---|
| `Users` | User accounts and authentication details |
| `ProviderProfiles` | Restaurant/vendor-specific info (linked to Users) |
| `Categories` | Food cuisine categories |
| `Meals` | Menu items offered by providers |
| `Orders` | Customer orders with items and status |
| `Reviews` | Customer reviews for meals |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Auth |

### Meals & Providers

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/meals` | Get all meals (with filters) | Public |
| GET | `/api/meals/:id` | Get meal details | Public |
| GET | `/api/providers` | Get all providers | Public |
| GET | `/api/providers/:id` | Get provider with their menu | Public |

### Orders

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/orders` | Create new order | Customer |
| GET | `/api/orders` | Get current user's orders | Customer |
| GET | `/api/orders/:id` | Get order details | Customer |

### Provider Management

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/provider/meals` | Add meal to menu | Provider |
| PUT | `/api/provider/meals/:id` | Update meal | Provider |
| DELETE | `/api/provider/meals/:id` | Remove meal | Provider |
| PATCH | `/api/provider/orders/:id` | Update order status | Provider |

### Admin

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/admin/users` | Get all users | Admin |
| PATCH | `/api/admin/users/:id` | Update user status | Admin |
| GET | `/api/admin/orders` | Get all orders | Admin |

> A full Postman collection is included in the repo at `postman_collection.json`.

---

## 📦 NPM Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start development server with hot reload (`tsx watch`) |
| `pnpm build` | Compile TypeScript for production |
| `pnpm start` | Run the compiled production server |
| `pnpm mg` | Run Prisma database migrations |
| `pnpm ge` | Regenerate Prisma client |
| `pnpm seed` | Seed the admin user into the database |

---

## 🔗 Related

- **Frontend:** [foodieClient](https://github.com/AbdurRahman11072/foodieClient) — Next.js 16 + Tailwind CSS
- **Frontend Live URL:** [foodie-client-one.vercel.app](https://foodie-client-one.vercel.app)

---

## 📜 License

This project is private and not licensed for public redistribution.
