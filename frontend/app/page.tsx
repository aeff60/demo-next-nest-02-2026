'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              ยินดีต้อนรับ! 🎉
            </h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info Card */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                ข้อมูลผู้ใช้
              </h2>
              <div className="space-y-2">
                <p><span className="font-medium">ชื่อ:</span> {user?.name}</p>
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p>
                  <span className="font-medium">Role:</span>{' '}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user?.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                    user?.role === 'MANAGER' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user?.role}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Auth Source:</span>{' '}
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user?.authSource === 'LDAP' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.authSource}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-green-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition"
                >
                  📱 View Profile
                </button>
                
                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                  <button
                    onClick={() => router.push('/management')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition"
                  >
                    👥 Management Dashboard
                  </button>
                )}
                
                {user?.role === 'ADMIN' && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition"
                  >
                    ⚙️ Admin Panel
                  </button>
                )}

                {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
                  <button
                    onClick={() => router.push('/reports')}
                    className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition"
                  >
                    📊 Reports (PDF/Excel)
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/files')}
                  className="w-full text-left px-4 py-3 bg-white rounded-lg border hover:bg-gray-50 transition"
                >
                  📁 File Upload & Management
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibont text-gray-900 mb-4">
              System Status
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Backend Connected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Authentication Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
