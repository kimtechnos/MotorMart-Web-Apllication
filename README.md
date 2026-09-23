# MotorMart

MotorMart is a full-stack vehicle marketplace. Visitors can search the inventory and open a vehicle. Signed-in customers send inquiries about a specific car and see only their own messages. Admins add, edit, and remove listings, manage accounts, and read inquiries and contact messages.

There is no public demo URL yet. This branch has been run locally against Postgres.

## Features

- Public vehicle search by make, model, year, and maximum price
- Public vehicle detail page
- Registration and cookie login
- Customer dashboard with that person's inquiries
- Admin inventory editing, with year and price stored as numbers
- Contact form stored in Postgres
- Admin-only contact inbox

## Architecture

The React app is a static Vite build. It calls an Express API. The API uses Prisma to talk to PostgreSQL. Login state is an HttpOnly cookie. The browser does not store the access token.

```text
browser  ->  React (Vite)  ->  Express API  ->  PostgreSQL
```

Production target:

- Database: Supabase Postgres
- API: Render
- Website: any static host

The database URL, API origin, and frontend origin all come from environment variables.

## Stack

Frontend: React 18, Vite, React Router, Formik, Yup, Zustand, Vitest.

Backend: Node.js, Express, Prisma, JWT in an HttpOnly cookie, node:test.

Database: PostgreSQL. Local Postgres works for development. Supabase is the hosted database.

## Project structure

```text
client/          React application
Server/          Express API and Prisma schema
Server/prisma/   schema and migrations
.github/         CI workflow
```

## Prerequisites

- Node.js 22
- npm
- PostgreSQL 16, either local or a Supabase project

## Installation

```bash
cd client
npm install
cd ../Server
npm install
```

Copy the example environment files and fill in real values locally. Do not commit those copies.

```bash
cp client/.env.example client/.env
cp Server/.env.example Server/.env
```

## Environment variables

Client (`client/.env`):

| Name | Purpose |
| --- | --- |
| `VITE_API_URL_BASE` | API origin, with no trailing slash. Locally this is `http://localhost:3000`. On Render, use the service origin. |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for admin vehicle photos. |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Unsigned Cloudinary upload preset. |

Server (`Server/.env`):

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string. Include `schema=public`. Supabase also needs `sslmode=require`. |
| `JWT_SECRET` | Long random string used to sign the session cookie. |
| `FRONTEND_ORIGIN` | Browser origin allowed by CORS. Locally this is `http://localhost:5173`. |
| `PORT` | API port. Defaults to `3000`. Render sets this itself. |
| `ADMIN_EMAIL` | Bootstrap admin email. |
| `ADMIN_PASSWORD` | Bootstrap admin password. |
| `ADMIN_PHONE` | Bootstrap admin phone number. |
| `ADMIN_FULL_NAME` | Optional display name. |

Public registration cannot set `role`. The admin account is created only by the seed command.

## Database setup

For a local database, create an empty database named `motormart` and put its URL in `DATABASE_URL`.

For Supabase, use the session pooler URI on port `5432`. The direct `db.<project>.supabase.co` host is IPv6-only and is unreachable from some networks. Do not use the transaction pooler on port `6543` for Prisma migrations. The pooler username looks like `postgres.<project-ref>`.

Apply migrations:

```bash
cd Server
npx prisma migrate deploy
```

Create the admin account after `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_PHONE` are set:

```bash
npx prisma db seed
```

Useful checks:

```bash
npx prisma validate
npx prisma generate
```

Tests use a separate database named `motormart_test`. They refuse to run if the URL still points at a database name containing `cardelivary`.

## Start, test, and build

Start the API:

```bash
cd Server
npm run dev
```

`npm start` runs the API without nodemon.

Start the website:

```bash
cd client
npm run dev
```

Open `http://localhost:5173/home`.

Frontend:

```bash
cd client
npm run lint
npm test
npm run build
```

Backend:

```bash
cd Server
npm test
```

GitHub Actions runs the same checks. The backend job uses a Postgres service and does not connect to Supabase.

## API overview

| Method | Path | Who can call it |
| --- | --- | --- |
| `POST` | `/api/users/register` | Public. Role is always `user`. |
| `POST` | `/api/auth/login` | Public. Sets the `access_token` cookie. |
| `GET` | `/api/auth/session` | Signed-in user. |
| `POST` | `/api/auth/logout` | Clears the session cookie. |
| `GET` | `/api/users` | Admin. Passwords are omitted. |
| `PATCH` | `/api/users/update/:id` | That same user. |
| `DELETE` | `/api/users/:id` | Admin. Returns 409 when cars or inquiries still exist. |
| `GET` | `/api/cars` | Public. Accepts `make`, `model`, `year`, and `maxPrice`. |
| `GET` | `/api/cars/:id` | Public. |
| `POST` | `/api/cars/add` | Admin. |
| `PATCH` | `/api/cars/:id` | Admin. |
| `DELETE` | `/api/cars/:id` | Admin. |
| `POST` | `/api/inquiries` | Signed-in user. Body is `carId` and `message`. |
| `GET` | `/api/inquiries/mine` | Signed-in user. |
| `GET` | `/api/inquiries` | Admin. |
| `POST` | `/api/contact` | Public. |
| `GET` | `/api/contact` | Admin. |

## Security model

The server is the authority for identity. The session cookie is HttpOnly. In production it is also `Secure` and `SameSite=None`, so a website on one host can call an API on another. Locally the cookie is not `Secure` and `SameSite` is `Lax`.

Customers can update only their own profile. Admin routes require an admin role. Failed responses use short messages and do not return database errors or password hashes.

## Deployment

The hosted database is Supabase. The API host is Render. The website can be any static host that serves `client/dist`.

Render settings for the API:

- Root directory: `Server`
- Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
- Start command: `npm start`
- Environment: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_ORIGIN`, `NODE_ENV=production`

Set `FRONTEND_ORIGIN` to the public website origin, including `https://`. Set the website's `VITE_API_URL_BASE` to the Render service origin. Do not commit real values.

No live deployment URL is recorded yet.

## Known limitations

- Vite 8, Vitest 5, React Router 7, and bcrypt 6 are deferred because each upgrade is a major change. The remaining dependency advisories are on those packages. The bcrypt advisory is in the `tar` package used while installing bcrypt, not in request handling.
- Admin photo upload depends on a Cloudinary unsigned preset. The cloud name and preset come from the client environment.
- Screenshots and a demo link will be added after a verified deployment.

## Screenshots

Not captured yet. The public pages are still being finished, and there is no deployed site to photograph.
