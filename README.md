# CouponVault

CouponVault is a Next.js app to manage coupons/gift cards, track remaining balance, and monitor expiry dates.

## Basic Features

- Add, update, and delete coupons
- Track original amount and amount left
- Search and filter coupons by status/text
- Expiry notifications for soon-to-expire coupons
- PostgreSQL persistence via Prisma

## Run the App

### Local development

1. Install dependencies:
   `npm install`
2. Set `DATABASE_URL` in `.env` (PostgreSQL)
3. Run migrations:
   `npm run prisma:migrate -- --name init`
4. Start the app:
   `npm run dev`

Open http://localhost:3000

### Docker (app + database)

Run:
`docker compose up --build`

Stop:
`docker compose down`
