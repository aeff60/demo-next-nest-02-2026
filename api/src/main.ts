import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Static files serving
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // เปิด CORS เพื่อให้หน้าเว็บเรียกใช้ API ได้
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'];
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({ // ตั้งค่าการตรวจสอบข้อมูลขาเข้า
    whitelist: true, // ลบฟิลด์ที่ไม่ได้ระบุใน DTO ออก
    forbidNonWhitelisted: true, // โยนข้อผิดพลาดถ้ามีฟิลด์ที่ไม่ได้ระบุใน DTO
    transform: true, // แปลงข้อมูลขาเข้าให้ตรงกับชนิดที่ระบุใน DTO
  }));
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
