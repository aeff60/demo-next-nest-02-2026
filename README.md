# Nest Auth Monorepo

Full-stack authentication system built with NestJS (Backend) and Next.js (Frontend) using TypeORM.

## Project Structure

```
├── api/                 # NestJS Backend API
│   ├── src/
│   ├── uploads/
│   └── package.json
├── frontend/           # Next.js Frontend
│   ├── app/
│   ├── components/
│   └── package.json
├── docker-compose.yml  # Docker services (PostgreSQL, LDAP)
└── package.json       # Monorepo root
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for database)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend.

### 2. Setup Environment

Copy the example environment file in the API:

```bash
cp api/.env.example api/.env
```

Edit `api/.env` with your database credentials.

### 3. Start Database

```bash
npm run docker:up
```

This starts PostgreSQL and LDAP services.

### 4. Run Development

```bash
npm run dev
```

This starts both:
- Backend API at http://localhost:3000
- Frontend at http://localhost:3001

### Individual Commands

```bash
# Run only API
npm run dev:api

# Run only Frontend
npm run dev:frontend

# Build both projects
npm run build

# Start production mode
npm run start

# Stop Docker services
npm run docker:down
```

## Features

### Backend (NestJS)
- ✅ Local & LDAP Authentication
- ✅ JWT Token-based Authorization
- ✅ Role-based Access Control (ADMIN, MANAGER, USER)
- ✅ TypeORM with PostgreSQL
- ✅ File Upload/Download
- ✅ PDF & Excel Report Generation
- ✅ RESTful API

### Frontend (Next.js)
- ✅ Modern React with TypeScript
- ✅ Tailwind CSS for styling
- ✅ React Query for data fetching
- ✅ Authentication flow
- ✅ Protected routes
- ✅ File upload with avatar support

## API Endpoints

### Authentication
- `POST /user/register` - Register new user
- `POST /auth/login` - Local login
- `POST /auth/login/ldap` - LDAP login
- `GET /auth/profile` - Get user profile

### Protected (Requires JWT)
- `GET /auth/admin` - Admin only
- `GET /auth/management` - Admin/Manager only

### Files
- `POST /file/upload` - Upload single file
- `POST /file/upload-multiple` - Upload multiple files
- `GET /file/download/:filename` - Download file
- `DELETE /file/:filename` - Delete file

### Reports
- `GET /reports/summary` - Get report summary
- `GET /reports/users/pdf` - Download users PDF report
- `GET /reports/users/excel` - Download users Excel report

## Tech Stack

### Backend
- NestJS
- TypeORM
- PostgreSQL
- JWT
- Passport (Local & LDAP strategies)
- Bcrypt
- Puppeteer (PDF generation)
- ExcelJS

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- React Query
- js-cookie

## Environment Variables

### API (.env)
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=nest_auth
DATABASE_SYNC=true

JWT_SECRET=SECRET_KEY_2025

LDAP_URL=ldap://localhost:389
LDAP_BIND_DN=cn=admin,dc=borntodev,dc=com
LDAP_BIND_PASSWORD=admin123
LDAP_SEARCH_BASE=dc=borntodev,dc=com
LDAP_SEARCH_FILTER=(uid={{username}})
```

## Development

### API Development
```bash
cd api
npm run start:dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## Production Build

```bash
# Build both projects
npm run build

# Start production servers
npm run start
```

## Docker Services

The project includes Docker Compose with:
- PostgreSQL (port 5432)
- LDAP Server (port 389)
- phpLDAPadmin (port 8080)

Access phpLDAPadmin: http://localhost:8080

## License

Private
