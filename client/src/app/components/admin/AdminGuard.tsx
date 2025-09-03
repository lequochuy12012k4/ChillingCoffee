'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  console.log('AdminGuard: Component rendered');
  console.log('AdminGuard: user:', user);
  console.log('AdminGuard: token:', token);
  console.log('AdminGuard: loading:', loading);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Wait for AuthContext to finish loading
      if (loading) {
        console.log('AdminGuard: AuthContext still loading, waiting...');
        return;
      }

      if (!token) {
        console.log('AdminGuard: No token found, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        console.log('AdminGuard: Checking admin status with token:', token);
        const response = await fetch('/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('AdminGuard: Profile response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('AdminGuard: User data:', userData);
          if (userData.role === 'admin') {
            console.log('AdminGuard: User is admin, allowing access');
            setIsAdmin(true);
          } else {
            console.log('AdminGuard: User is not admin, redirecting to home');
            router.push('/');
          }
        } else {
          console.log('AdminGuard: Profile request failed, redirecting to login');
          router.push('/login');
        }
      } catch (error) {
        console.error('AdminGuard: Error checking admin status:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [token, router, loading]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? 'Loading authentication...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect to home or login
  }

  return <>{children}</>;
}
