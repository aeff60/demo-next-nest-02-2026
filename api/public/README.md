# วิธีใช้งานหน้าเว็บ

## เริ่มต้นใช้งาน

### 1. เปิดเซิร์ฟเวอร์
```bash
npm run start:dev
```

### 2. เปิดหน้าเว็บ
เปิดไฟล์ `public/index.html` ในเว็บเบราว์เซอร์ หรือใช้ Live Server

ตัวเลือกง่ายๆ:
- ดับเบิลคลิกที่ไฟล์ `public/index.html`
- หรือใช้ VS Code extension: Live Server (คลิกขวาที่ไฟล์ > Open with Live Server)
- หรือเปิดโดยตรง: `file:///C:/Users/porsc/sandbox/nest-auth/public/index.html`

## คุณสมบัติ

### ✅ หน้าลงทะเบียน
- กรอกอีเมล (จำเป็น)
- กรอกรหัสผ่าน อย่างน้อย 6 ตัวอักษร (จำเป็น)
- กรอกชื่อ (ไม่จำเป็น)
- กรอกเบอร์โทร (ไม่จำเป็น)

### ✅ หน้าเข้าสู่ระบบ
- กรอกอีเมล
- กรอกรหัสผ่าน
- ระบบจะบันทึก token ใน localStorage

### ✅ หน้าข้อมูลผู้ใช้ (Protected)
- แสดงอีเมลของผู้ใช้
- แสดง JWT token
- ปุ่มออกจากระบบ

## ฟีเจอร์

✨ **Auto Login** - หลังลงทะเบียนสำเร็จจะกรอกข้อมูลให้อัตโนมัติ
✨ **Token Management** - จัดเก็บ token ใน localStorage
✨ **Auto Redirect** - ถ้ามี token จะเข้าหน้า profile อัตโนมัติ
✨ **Error Handling** - แสดงข้อความ error ที่เข้าใจง่าย
✨ **Responsive Design** - ใช้งานได้ทั้งมือถือและคอมพิวเตอร์
✨ **Loading States** - ปุ่มจะแสดงสถานะขณะกำลังประมวลผล

## ไฟล์ที่สร้าง

```
public/
├── index.html  - หน้าเว็บหลัก
├── style.css   - การตกแต่ง
└── app.js      - JavaScript สำหรับเรียก API
```

## การทำงาน

1. **ลงทะเบียน** → ส่งข้อมูลไป `POST /user/register`
2. **เข้าสู่ระบบ** → ส่งข้อมูลไป `POST /auth/login` และเก็บ token
3. **ดูข้อมูล** → ใช้ token เรียก `GET /auth/profile`
4. **ออกจากระบบ** → ลบ token ออกจาก localStorage

## หมายเหตุ

- ระบบใช้ `localStorage` เก็บ token (เหมาะสำหรับการทดสอบ)
- CORS ถูกเปิดใช้งานใน server เรียบร้อยแล้ว
- ถ้า token หมดอายุ (1 วัน) จะถูกนำกลับไปหน้า login อัตโนมัติ
