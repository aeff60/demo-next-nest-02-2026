# Company Portal Web

Frontend Web Application สำหรับระบบ Company Portal ที่พัฒนาด้วย Next.js 16 (App Router) พร้อม React 19 และ Tailwind CSS

## 📋 คำอธิบาย

Web Application สำหรับจัดการระบบ Company Portal ที่ทำงานร่วมกับ Backend API (portal-api) รองรับ:
- 🔐 Authentication (Local + LDAP)
- 👥 User Management
- 📁 File Upload/Download
- 📊 Reports Generation
- 🎨 Responsive Design

## ✨ ฟีเจอร์หลัก

### Authentication
- ✅ Login ด้วย Email/Password
- ✅ Login ด้วย LDAP
- ✅ สมัครสมาชิก (Register)
- ✅ JWT Token-based authentication
- ✅ Auto-logout เมื่อ token หมดอายุ
- ✅ Protected routes

### User Interface
- ✅ Responsive Design (Mobile-first)
- ✅ Navbar พร้อม User Menu
- ✅ Avatar Upload component
- ✅ File Upload component
- ✅ Toast notifications

### Pages
- ✅ **หน้าแรก** (`/`) - Dashboard
- ✅ **Login** (`/login`) - เข้าสู่ระบบ
- ✅ **Register** (`/register`) - สมัครสมาชิก
- ✅ **Files** (`/files`) - จัดการไฟล์
- ✅ **Reports** (`/reports`) - รายงาน

## 🛠️ เทคโนโลยีที่ใช้

- **Framework**: Next.js 16.x (App Router)
- **UI Library**: React 19.x
- **Styling**: Tailwind CSS 4.x
- **State Management**: TanStack React Query 5.x
- **HTTP Client**: Axios
- **Cookie Management**: js-cookie
- **Font**: Geist (Vercel Font)
- **Language**: TypeScript

## 📦 การติดตั้ง

### ข้อกำหนดเบื้องต้น
- Node.js 18.x หรือสูงกว่า
- npm หรือ yarn
- Backend API รันอยู่ที่ `http://localhost:4000`

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
```

หรือแก้ไขด้วยตัวเอง:

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**หมายเหตุ**: ตรวจสอบว่า Backend API (portal-api) รันอยู่ที่ port 4000

## 🚀 รันโปรเจกต์

### Development Mode

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่: `http://localhost:3000`

### Production Build

```bash
# Build โปรเจกต์
npm run build

# รัน production server
npm start
```

### Linting

```bash
npm run lint
```

## 📁 โครงสร้างโปรเจกต์

```
app/
├── globals.css              # Global styles
├── layout.tsx               # Root layout พร้อม AuthProvider
├── page.tsx                 # หน้าแรก (Dashboard)
│
├── login/
│   └── page.tsx            # หน้า Login (Local + LDAP)
│
├── register/
│   └── page.tsx            # หน้าสมัครสมาชิก
│
├── files/
│   └── page.tsx            # หน้าจัดการไฟล์
│
└── reports/
    └── page.tsx            # หน้ารายงาน

components/
├── Navbar.tsx              # Navigation bar พร้อม User menu
├── AvatarUpload.tsx        # Avatar upload component
└── FileUpload.tsx          # File upload component

lib/
├── api.ts                  # API client (Axios) พร้อม interceptors
├── auth.tsx                # AuthContext & AuthProvider
└── types.ts                # TypeScript type definitions

public/                     # Static assets
```

## 🔑 การใช้งาน

### 1. สมัครสมาชิก

1. เปิด `http://localhost:3000/register`
2. กรอกข้อมูล: Name, Email, Password
3. คลิก "Register"
4. ระบบจะพาไปหน้า Login อัตโนมัติ

### 2. เข้าสู่ระบบ

**Local Login:**
1. เปิด `http://localhost:3000/login`
2. กรอก Email และ Password
3. คลิก "Login"

**LDAP Login:**
1. เลือกแท็บ "LDAP Login"
2. กรอก Username และ Password
3. คลิก "Login with LDAP"

### 3. จัดการไฟล์

1. ไปที่ `/files`
2. คลิก "Upload File"
3. เลือกไฟล์
4. ไฟล์จะถูกอัปโหลดไปยัง Backend

### 4. ดูรายงาน

1. ไปที่ `/reports`
2. เลือกประเภทรายงานที่ต้องการ
3. คลิก "Generate Report"

## 🔐 การจัดการ Authentication

### AuthContext

โปรเจกต์ใช้ React Context API สำหรับจัดการ Authentication:

```typescript
import { useAuth } from '@/lib/auth';

function MyComponent() {
  const { user, login, logout, isLoading } = useAuth();
  
  // ใช้งาน user, login, logout functions
}
```

### Protected Routes

Routes ที่ต้องการ authentication สามารถป้องกันได้ด้วย:

```typescript
'use client';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return <div>Protected Content</div>;
}
```

## 📡 API Integration

### API Client

ใช้ Axios instance ที่ตั้งค่าไว้ใน `lib/api.ts`:

```typescript
import { authAPI, userAPI, fileAPI } from '@/lib/api';

// Login
const data = await authAPI.login('user@example.com', 'password');

// Get Profile
const profile = await authAPI.getProfile();

// Upload File
const result = await fileAPI.upload(file);
```

### Interceptors

- **Request Interceptor**: เพิ่ม JWT token ให้ทุก request อัตโนมัติ
- **Response Interceptor**: จัดการ 401 Unauthorized (token หมดอายุ)

## 🎨 Styling

### Tailwind CSS

โปรเจกต์ใช้ Tailwind CSS 4.x:

```tsx
<div className="flex items-center justify-center min-h-screen bg-gray-50">
  <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
    {/* Content */}
  </div>
</div>
```

### Global Styles

แก้ไข `app/globals.css` สำหรับ custom styles

### Fonts

ใช้ Geist และ Geist Mono จาก Vercel:

```typescript
import { Geist, Geist_Mono } from "next/font/google";
```

## 🔧 Configuration Files

### `next.config.ts`
```typescript
// Next.js configuration
```

### `tailwind.config.js`
```javascript
// Tailwind CSS configuration
```

### `tsconfig.json`
```json
// TypeScript configuration
```

## 🐛 การแก้ไขปัญหา

### API Connection Error

```bash
# ตรวจสอบว่า Backend รันอยู่
cd ../portal-api
npm run start:dev

# ตรวจสอบ NEXT_PUBLIC_API_URL ใน .env.local
cat .env.local
```

### CORS Error

ตรวจสอบว่า Backend อนุญาต CORS จาก Frontend URL:

```typescript
// portal-api/src/main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Cookie Not Set

ตรวจสอบว่า API response มี `access_token`:

```typescript
// Response ต้องมี format:
{
  "access_token": "jwt_token_here",
  "user": { ... }
}
```

### Build Error

```bash
# ลบ cache และ rebuild
rm -rf .next
npm run build
```

## 📱 Responsive Design

โปรเจกต์ออกแบบให้รองรับทุกขนาดหน้าจอ:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

ใช้ Tailwind breakpoints:

```tsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive Text
</div>
```

## 🚀 Deployment

### Vercel (แนะนำ)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Variables

อย่าลืมตั้ง Environment Variables บน hosting platform:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## 📖 เอกสารเพิ่มเติม

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 🤝 การพัฒนาต่อ

### เพิ่ม Page ใหม่

```bash
# สร้าง folder ใน app/
mkdir app/new-page

# สร้าง page.tsx
touch app/new-page/page.tsx
```

### เพิ่ม Component ใหม่

```bash
# สร้าง component ใน components/
touch components/NewComponent.tsx
```

### เพิ่ม API Function

แก้ไข `lib/api.ts`:

```typescript
export const myAPI = {
  getData: async () => {
    const response = await api.get('/my-endpoint');
    return response.data;
  },
};
```

## 📄 License

UNLICENSED

---

Made with ❤️ using Next.js and React
