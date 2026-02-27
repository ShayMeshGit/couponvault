# CouponVault

CouponVault is a modern Next.js app for managing gift cards and coupons in one place.
It helps you track balances, monitor expiry dates, categorize coupons, and redeem partial amounts over time.

## Features

- Add coupons with store name, optional code, value, category, and expiry date.
- Track both original value and remaining balance.
- Redeem partial amounts until a coupon is fully redeemed.
- Search and filter coupons by text and status.
- Expiry alerts for coupons close to expiration.
- Persistent storage with Prisma + PostgreSQL.
- Smooth UI transitions powered by Motion.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM
- PostgreSQL
- `date-fns` for date handling
- `lucide-react` for icons
- `motion` for animations

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Configure database

Copy the env file and set your PostgreSQL connection string:

```bash
cp .env.example .env
```

Run Prisma migration and generate the client:

```bash
npm run prisma:migrate -- --name init
npm run prisma:generate
```

### Run in development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build and run production

```bash
npm run build
npm run start
```

### Run with Docker Compose

Start app + PostgreSQL:

```bash
docker compose up --build
```

This starts:

- App at `http://localhost:3000`
- PostgreSQL at `localhost:5432`

Stop containers:

```bash
docker compose down
```

Stop and remove database volume:

```bash
docker compose down -v
```

## Available Scripts

- `npm run dev` — start dev server
- `npm run build` — create production build
- `npm run start` — run production server
- `npm run lint` — run ESLint
- `npm run clean` — run Next clean
- `npm run prisma:generate` — generate Prisma client
- `npm run prisma:migrate` — run/create DB migrations
- `npm run prisma:studio` — inspect DB in Prisma Studio

## Data Model

Each coupon includes:

- `id`
- `storeName`
- `code` (optional)
- `originalAmount`
- `amountLeft`
- `currency`
- `expiryDate` (`yyyy-MM-dd`)
- `description`
- `category` (`Groceries`, `Clothing`, `Dining`, `Electronics`, `Home Goods`, `Other`)
- `status` (`active`, `used`, `expired`, `redeemed`)
- `createdAt`

## Project Structure

```text
app/
   layout.tsx
   page.tsx
components/
   AddCouponModal.tsx
   CouponCard.tsx
   CouponDashboard.tsx
lib/
   notifications.ts
   prisma.ts
   coupons-api.ts
   types.ts
prisma/
   schema.prisma
```

## Notes

- Coupon data is persisted in PostgreSQL via Prisma and served through Next.js API routes.
- If you see hydration warnings in Chrome showing attributes like `data-np-*`, that is usually caused by an autofill/password browser extension mutating the DOM before hydration.
