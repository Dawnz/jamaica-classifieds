# Jamaica Classifieds

Jamaica's #1 classifieds marketplace — built with Next.js 14, PostgreSQL (Docker), Prisma, NextAuth, Cloudinary, and Stripe.

---

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn

---

## Local Setup (5 steps)

### 1. Clone & install dependencies
```bash
npm install
```

### 2. Copy environment variables
```bash
cp .env.example .env
```
The default `.env` is pre-filled for local Docker. No changes needed to get started.

### 3. Start the PostgreSQL container
```bash
docker-compose up -d
```
PostgreSQL runs on **port 5433** (not the default 5432, to avoid conflicts).

Verify it's running:
```bash
docker ps
# or
docker logs jamaica_classifieds_db
```

### 4. Set up the database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates all tables)
npm run db:push

# Seed categories, sub-categories, and sample data
npm run db:seed
```

### 5. Start the dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Seeded accounts

| Role  | Email                              | Password    |
|-------|------------------------------------|-------------|
| Admin | admin@jamaicaclassifieds.com       | admin123!   |
| User  | demo@example.com                   | user123!    |

---

## Useful Commands

| Command              | What it does                                  |
|----------------------|-----------------------------------------------|
| `npm run dev`        | Start dev server on port 3000                 |
| `npm run db:studio`  | Open Prisma Studio (visual DB browser)        |
| `npm run db:seed`    | Re-run seed data                              |
| `npm run db:reset`   | Drop + recreate DB, re-run seed               |
| `npm run db:migrate` | Create a new migration (production workflow)  |
| `docker-compose up -d`   | Start DB container                        |
| `docker-compose down`    | Stop DB container                         |
| `docker-compose down -v` | Stop DB and DELETE all data               |

---

## Database Connection

**Local Docker:**
```
postgresql://jc_user:jc_password@localhost:5433/jamaica_classifieds?schema=public
```

**When ready for Neon (production):**

1. Create a project at https://neon.tech
2. Copy your connection string from the Neon dashboard
3. In `.env`, replace `DATABASE_URL` with:
```
postgresql://<user>:<password>@<host>.neon.tech/jamaica_classifieds?sslmode=require
```
4. Run `npm run db:migrate` to apply your schema to Neon

That's it — no other code changes needed.

---

## Project Structure

```
jamaica-classifieds/
├── docker-compose.yml         # PostgreSQL on port 5433
├── prisma/
│   ├── schema.prisma          # Full data model
│   └── seed.ts                # 22 categories + sample listings
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css
│   │   └── api/
│   │       └── auth/[...nextauth]/route.ts
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── auth.ts            # NextAuth config
│   └── types/
└── README.md
```

---

## Data Model Overview

| Model         | Purpose                                              |
|---------------|------------------------------------------------------|
| User          | Accounts (email/password + Google OAuth)             |
| Category      | 22 top-level categories                              |
| SubCategory   | Sub-categories per category                          |
| Listing       | Ad listings with expiry date                         |
| ListingImage  | Cloudinary image URLs per listing                    |
| ListingField  | Dynamic key-value fields (make, bedrooms, etc.)      |
| Payment       | Stripe payments for premium listings                 |

---

## Transposing to Neon (when ready)

1. Sign up at https://neon.tech (free tier)
2. Create a new project: `jamaica-classifieds`
3. Copy the connection string
4. Update `DATABASE_URL` in `.env`
5. Run: `npm run db:migrate`
6. Run: `npm run db:seed`
7. Deploy frontend to Vercel — add `DATABASE_URL` to Vercel environment variables

No code changes required. The connection string is the only difference.
