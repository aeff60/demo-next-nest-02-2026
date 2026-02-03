# Company Portal API

Backend API สำหรับระบบ Company Portal ที่พัฒนาด้วย NestJS framework พร้อมระบบ Authentication แบบ Local และ LDAP

## 📋 คำอธิบาย

REST API ที่สร้างด้วย NestJS สำหรับจัดการ:
- 🔐 Authentication & Authorization (Local + LDAP)
- 👥 User Management 
- 📁 File Upload/Download
- 📊 Report Generation (Excel, PDF)
- 🛡️ Role-Based Access Control (RBAC)

## ✨ ฟีเจอร์หลัก

### Authentication
- ✅ Local Authentication (Email/Password) พร้อม Bcrypt hashing
- ✅ LDAP Authentication (OpenLDAP integration)
- ✅ JWT Token-based authorization
- ✅ Role-based access control (Admin, Manager, User)
- ✅ Password validation และ security

### User Management
- ✅ User registration
- ✅ User profile management
- ✅ Role assignment
- ✅ LDAP user auto-creation

### File Management
- ✅ File upload ด้วย Multer
- ✅ File download
- ✅ File validation
- ✅ UUID filename generation

### Report System
- ✅ Excel report generation (ExcelJS)
- ✅ PDF report generation (Puppeteer)
- ✅ Custom report templates

## 🛠️ เทคโนโลยีที่ใช้

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.x
- **Authentication**: 
  - Passport.js (Local, JWT, LDAP strategies)
  - BCrypt (password hashing)
- **File Upload**: Multer
- **Report Generation**: 
  - ExcelJS (Excel files)
  - Puppeteer (PDF generation)
- **Language**: TypeScript
- **Validation**: class-validator, class-transformer

## 📦 การติดตั้ง

### ข้อกำหนดเบื้องต้น
- Node.js 18.x หรือสูงกว่า
- Docker และ Docker Compose
- npm หรือ yarn

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

แก้ไขค่าใน `.env`:

```env
# Database
DATABASE_URL="postgresql://root:example@localhost:5432/authdb"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="1d"

# LDAP Configuration
LDAP_URL="ldap://localhost:389"
LDAP_BIND_DN="cn=admin,dc=borntodev,dc=com"
LDAP_BIND_CREDENTIALS="admin123"
LDAP_SEARCH_BASE="dc=borntodev,dc=com"
LDAP_SEARCH_FILTER="(uid={{username}})"

# Application
PORT=3000
```

### 3. รัน Docker Services

รัน PostgreSQL และ LDAP Server:

```bash
docker-compose up -d
```

ตรวจสอบว่า services รันสำเร็จ:

```bash
docker-compose ps
```

Services ที่จะรัน:
- **PostgreSQL**: `localhost:5432`
- **LDAP Server**: `localhost:389`
- **phpLDAPadmin**: `http://localhost:8080`

### 4. Setup Database

รัน Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

(Optional) เปิด Prisma Studio เพื่อดูข้อมูล:

```bash
npx prisma studio
```

## 🚀 รันโปรเจกต์

### Development Mode

```bash
# รันแบบ watch mode
npm run start:dev

# รันแบบ debug mode
npm run start:debug
```

### Production Mode

```bash
# Build
npm run build

# รัน production
npm run start:prod
```

API จะรันที่: `http://localhost:3000`

## 🔑 การทดสอบ API

### สร้างบัญชี Admin

```bash
POST http://localhost:3000/user/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "name": "Admin User",
  "tel": "0812345678",
  "role": "ADMIN"
}
```

### เข้าสู่ระบบ

**Local Login:**
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**LDAP Login:**
```bash
POST http://localhost:3000/auth/login/ldap
Content-Type: application/json

{
  "username": "john",
  "password": "ldappassword"
}
```

### ดูข้อมูล Profile (ต้องมี JWT Token)

```bash
GET http://localhost:3000/auth/profile
Authorization: Bearer <your_access_token>
```

ดูเพิ่มเติมได้ที่: [API-TESTING-GUIDE-UPDATED.md](API-TESTING-GUIDE-UPDATED.md)

## 📁 โครงสร้างโปรเจกต์

```
src/
├── auth/                    # Authentication module
│   ├── decorators/         # Custom decorators (Roles)
│   ├── dto/                # Data Transfer Objects
│   ├── guards/             # Guards (Roles, JWT, LDAP, Local)
│   ├── strategies/         # Passport strategies
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.service.ts     # Auth business logic
│   └── auth.module.ts      
│
├── user/                    # User management module
│   ├── dto/                # User DTOs
│   ├── user.controller.ts  # User endpoints
│   ├── user.service.ts     # User business logic
│   └── user.module.ts
│
├── file/                    # File management module
│   ├── file.controller.ts  # File upload/download endpoints
│   ├── file.service.ts     # File operations
│   └── file.module.ts
│
├── report/                  # Report generation module
│   ├── report.controller.ts
│   ├── report.service.ts   # Excel/PDF generation
│   └── report.module.ts
│
├── prisma/                  # Prisma ORM module
│   ├── prisma.service.ts   # Database connection
│   └── prisma.module.ts
│
├── app.module.ts           # Root module
└── main.ts                 # Application entry point

prisma/
├── schema.prisma           # Database schema
└── migrations/             # Database migrations

uploads/                     # Uploaded files directory
```

## 🗄️ Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  tel       String?
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  USER
  MANAGER
}
```

## 🔒 Role-Based Access Control

### Roles
- **ADMIN**: เข้าถึงทุกฟังก์ชัน
- **MANAGER**: เข้าถึงฟังก์ชันจัดการ
- **USER**: เข้าถึงฟังก์ชันพื้นฐาน

### การใช้งาน Guards

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Get('admin')
async adminOnly() {
  return { message: 'Admin only endpoint' };
}
```

## 🧪 การทดสอบ

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐳 Docker Commands

```bash
# รัน services
docker-compose up -d

# ดู logs
docker-compose logs -f

# หยุด services
docker-compose down

# รีสตาร์ท
docker-compose restart

# ลบ volumes (ข้อมูลจะหายหมด!)
docker-compose down -v
```

## 🔧 การแก้ไขปัญหา

### Database Connection Error
```bash
# ตรวจสอบ PostgreSQL
docker-compose logs postgres

# รีสตาร์ท database
docker-compose restart postgres
```

### LDAP Connection Error
```bash
# ตรวจสอบ LDAP server
docker-compose logs ldap

# เข้าถึง LDAP Admin
# http://localhost:8080
# Login DN: cn=admin,dc=borntodev,dc=com
# Password: admin123
```

### Prisma Sync Issues
```bash
# Reset database (ข้อมูลจะหายหมด!)
npx prisma migrate reset

# Generate client
npx prisma generate

# Push schema without migration
npx prisma db push
```

## 📚 API Endpoints

### Authentication
- `POST /user/register` - สมัครสมาชิก
- `POST /auth/login` - เข้าสู่ระบบ (Local)
- `POST /auth/login/ldap` - เข้าสู่ระบบ (LDAP)
- `GET /auth/profile` - ดูโปรไฟล์ (ต้องใช้ JWT)

### Protected Endpoints
- `GET /auth/admin` - เฉพาะ Admin
- `GET /auth/management` - เฉพาะ Admin และ Manager

### File Management
- `POST /file/upload` - อัปโหลดไฟล์
- `GET /file/:filename` - ดาวน์โหลดไฟล์

### Reports
- Report endpoints (ดูใน [report.controller.ts](src/report/report.controller.ts))

## 📖 เอกสารเพิ่มเติม

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Passport.js Documentation](http://www.passportjs.org/)
- [API Testing Guide](API-TESTING-GUIDE-UPDATED.md)

## 📄 License

UNLICENSED
