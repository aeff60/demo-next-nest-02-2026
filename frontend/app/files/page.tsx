'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import FileUpload from '../../components/FileUpload';
import AvatarUpload from '../../components/AvatarUpload';

interface UploadedFile {
  id: string;
  filename: string;
  originalname: string;
  size: number;
  downloadUrl: string;
  uploadedAt: string;
}

export default function FilesPage() {
  const { user, isLoading } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">กรุณาเข้าสู่ระบบ</h2>
          <a href="/login" className="text-blue-600 hover:text-blue-500">
            เข้าสู่ระบบ
          </a>
        </div>
      </div>
    );
  }

  const handleFileUploadSuccess = (files: UploadedFile | UploadedFile[]) => {
    if (Array.isArray(files)) {
      setUploadedFiles(prev => [...prev, ...files]);
    } else {
      setUploadedFiles(prev => [...prev, files]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (downloadUrl: string, filename: string) => {
    window.open(`http://localhost:4000${downloadUrl}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">จัดการไฟล์</h1>
          <p className="text-gray-600">อัปโหลด ดาวน์โหลด และจัดการไฟล์ของคุณ</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">รูปโปรไฟล์</h2>
            <AvatarUpload
              currentAvatar={avatarUrl}
              onAvatarUpdate={setAvatarUrl}
            />
          </div>

          {/* Single File Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">อัปโหลดไฟล์เดี่ยว</h2>
            <FileUpload
              onUploadSuccess={handleFileUploadSuccess}
              accept="image/*,application/pdf,.doc,.docx,.txt"
              multiple={false}
              maxSize={10}
            />
          </div>

          {/* Multiple Files Upload */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">อัปโหลดหลายไฟล์</h2>
            <FileUpload
              onUploadSuccess={handleFileUploadSuccess}
              accept="image/*,application/pdf,.doc,.docx,.txt"
              multiple={true}
              maxSize={10}
            />
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ไฟล์ที่อัปโหลดแล้ว</h2>
            <div className="space-y-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {/* File Icon */}
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    
                    {/* File Info */}
                    <div>
                      <p className="font-medium text-gray-900">{file.originalname}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(file.downloadUrl, file.originalname)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    ดาวน์โหลด
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            กลับหน้าหลัก
          </a>
        </div>
      </div>
    </div>
  );
}