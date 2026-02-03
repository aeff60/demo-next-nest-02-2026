import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface FileInfo {
  id?: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  uploadedBy?: string;
  createdAt?: Date;
}

@Injectable()
export class FileService {
  async saveFileInfo(fileInfo: FileInfo, userId?: string): Promise<any> {
    return {
      id: fileInfo.filename,
      filename: fileInfo.filename,
      originalname: fileInfo.originalname,
      mimetype: fileInfo.mimetype,
      size: fileInfo.size,
      path: fileInfo.path,
      uploadedBy: userId,
      createdAt: new Date(),
    };
  }

  async deleteFile(filename: string): Promise<boolean> {
    try {
      const filePath = path.join('./uploads', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      throw new BadRequestException('ไม่สามารถลบไฟล์ได้');
    }
  }

  fileExists(filename: string): boolean {
    const filePath = path.join('./uploads', filename);
    return fs.existsSync(filePath);
  }

  getFileStats(filename: string): fs.Stats | null {
    try {
      const filePath = path.join('./uploads', filename);
      if (this.fileExists(filename)) {
        return fs.statSync(filePath);
      }
      return null;
    } catch {
      return null;
    }
  }

  ensureUploadsDir() {
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }
}