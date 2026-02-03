'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                🔐 NestAuth
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                href="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                🏠 หน้าหลัก
              </Link>

              <Link
                href="/files"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/files')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                📁 ไฟล์
              </Link>

              {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                <Link
                  href="/reports"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive('/reports')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  📊 รายงาน
                </Link>
              )}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  user?.role === 'ADMIN'
                    ? 'bg-red-100 text-red-800'
                    : user?.role === 'MANAGER'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {user?.role}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden border-t border-gray-200">
        <div className="px-2 py-2 space-y-1">
          <Link
            href="/"
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              isActive('/')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🏠 หน้าหลัก
          </Link>

          <Link
            href="/files"
            className={`block px-3 py-2 text-base font-medium rounded-md ${
              isActive('/files')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            📁 ไฟล์
          </Link>

          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
            <Link
              href="/reports"
              className={`block px-3 py-2 text-base font-medium rounded-md ${
                isActive('/reports')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              📊 รายงาน
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
