'use client';

import React, { useState } from 'react';
import Cookies from 'js-cookie';

interface FileUploadProps {
  onUploadSuccess?: (file: any) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export default function FileUpload({
  onUploadSuccess,
  accept = "image/*,application/pdf,.doc,.docx,.txt",
  multiple = false,
  maxSize = 10,
  className = ""
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);

    // Validate file size
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > maxSize) {
        setError(`ไฟล์ "${file.name}" มีขนาดใหญ่เกินไป (สูงสุด ${maxSize}MB)`);
        return;
      }
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      if (multiple) {
        Array.from(files).forEach(file => {
          formData.append('files', file);
        });
        
        // Simulate progress for multiple files
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);

        const response = await fetch('http://localhost:4000/files/upload-multiple', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        });

        clearInterval(interval);
        setUploadProgress(100);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'การอัปโหลดล้มเหลว');
        }

        const result = await response.json();
        setSuccess(`อัปโหลด ${result.files.length} ไฟล์สำเร็จ`);
        
        if (onUploadSuccess) {
          onUploadSuccess(result.files);
        }
      } else {
        formData.append('file', files[0]);
        
        // Simulate progress
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval);
              return prev;
            }
            return prev + 10;
          });
        }, 150);

        const response = await fetch('http://localhost:4000/files/upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`
          }
        });

        clearInterval(interval);
        setUploadProgress(100);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'การอัปโหลดล้มเหลว');
        }

        const result = await response.json();
        setSuccess('อัปโหลดไฟล์สำเร็จ');
        
        if (onUploadSuccess) {
          onUploadSuccess(result.file);
        }
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            uploading
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <>
                <div className="w-12 h-12 mb-3 animate-spin">
                  <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <p className="mb-2 text-sm text-blue-600 font-medium">
                  กำลังอัปโหลด... {uploadProgress}%
                </p>
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <>
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">คลิกเพื่ือเลือกไฟล์</span> หรือ ลาก-วาง
                </p>
                <p className="text-xs text-gray-500">
                  {multiple ? 'หลายไฟล์' : 'ไฟล์เดียว'} (สูงสุด {maxSize}MB)
                </p>
              </>
            )}
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}