import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  Request,
  Res,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import type { Response as ExpressResponse } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileService } from './file.service';
import * as path from 'path';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {
    // สร้างโฟลเดอร์ uploads
    this.fileService.ensureUploadsDir();
  }

  // อัปโหลดไฟล์เดี่ยว
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('ไม่พบไฟล์ที่ต้องการอัปโหลด');
    }

    const fileInfo = {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    };

    const savedFile = await this.fileService.saveFileInfo(fileInfo, req.user.userId);

    return {
      message: 'อัปโหลดไฟล์สำเร็จ',
      file: {
        id: savedFile.id,
        filename: savedFile.filename,
        originalname: savedFile.originalname,
        mimetype: savedFile.mimetype,
        size: savedFile.size,
        uploadedAt: savedFile.createdAt,
        downloadUrl: `/files/download/${savedFile.filename}`,
      },
    };
  }

  // อัปโหลดหลายไฟล์
  @UseGuards(JwtAuthGuard)
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // สูงสุด 10 ไฟล์
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Request() req) {
    if (!files || files.length === 0) {
      throw new BadRequestException('ไม่พบไฟล์ที่ต้องการอัปโหลด');
    }

    const uploadedFiles: any[] = [];

    for (const file of files) {
      const fileInfo = {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
      };

      const savedFile = await this.fileService.saveFileInfo(fileInfo, req.user.userId);
      uploadedFiles.push({
        id: savedFile.id,
        filename: savedFile.filename,
        originalname: savedFile.originalname,
        mimetype: savedFile.mimetype,
        size: savedFile.size,
        uploadedAt: savedFile.createdAt,
        downloadUrl: `/files/download/${savedFile.filename}`,
      });
    }

    return {
      message: `อัปโหลด ${files.length} ไฟล์สำเร็จ`,
      files: uploadedFiles,
    };
  }

  // ดาวน์โหลดไฟล์
  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: ExpressResponse) {
    if (!this.fileService.fileExists(filename)) {
      throw new NotFoundException('ไม่พบไฟล์ที่ต้องการ');
    }

    const filePath = path.join(process.cwd(), 'uploads', filename);
    const stats = this.fileService.getFileStats(filename);

    if (!stats) {
      throw new NotFoundException('ไม่พบไฟล์ที่ต้องการ');
    }

    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    return res.sendFile(filePath);
  }

  // ดูไฟล์ (สำหรับรูปภาพ)
  @Get('view/:filename')
  async viewFile(@Param('filename') filename: string, @Res() res: ExpressResponse) {
    if (!this.fileService.fileExists(filename)) {
      throw new NotFoundException('ไม่พบไฟล์ที่ต้องการ');
    }

    const filePath = path.join(process.cwd(), 'uploads', filename);
    const stats = this.fileService.getFileStats(filename);

    if (!stats) {
      throw new NotFoundException('ไม่พบไฟล์ที่ต้องการ');
    }

    res.setHeader('Content-Length', stats.size);
    
    return res.sendFile(filePath);
  }

  // ลบไฟล์
  @UseGuards(JwtAuthGuard)
  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string, @Request() req) {
    const deleted = await this.fileService.deleteFile(filename);
    
    if (deleted) {
      return {
        message: 'ลบไฟล์สำเร็จ',
        filename,
      };
    } else {
      throw new NotFoundException('ไม่พบไฟล์ที่ต้องการลบ');
    }
  }

  // อัปโหลดรูปโปรไฟล์
  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('ไม่พบไฟล์รูปภาพ');
    }

    // ตรวจสอบว่าเป็นรูปภาพ
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('ไฟล์ต้องเป็นรูปภาพเท่านั้น');
    }

    const fileInfo = {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
    };

    const savedFile = await this.fileService.saveFileInfo(fileInfo, req.user.userId);

    return {
      message: 'อัปโหลดรูปโปรไฟล์สำเร็จ',
      avatar: {
        id: savedFile.id,
        filename: savedFile.filename,
        url: `/files/view/${savedFile.filename}`,
      },
    };
  }
}