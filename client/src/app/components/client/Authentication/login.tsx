'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChillingCoffeeLogo from '@/../public/Navbar/ChillingCoffee_logo.png';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useAuth } from '@/app/contexts/AuthContext';

// Một component SVG đơn giản cho logo Google
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C41.38,36.173,44,30.659,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccessMessage(message);
    }
  }, [searchParams]);

  // If already logged in via custom auth, go home
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  // Auto-complete login when NextAuth session is ready (Google sign-in)
  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      // Save token to our AuthContext
      login(session.accessToken, session.userEmail || session.user?.email || '');

      // Check if user is admin and redirect accordingly
      // For Google users, we need to check their role from the server
      const checkUserRole = async () => {
        try {
          const response = await fetch('/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const userData = await response.json();
            const isAdmin = userData.role === 'admin';
            router.push(isAdmin ? '/admin' : '/');
          } else {
            router.push('/');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          router.push('/');
        }
      };

      checkUserRole();
    }
  }, [status, session, login, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login response:', data); // Debug log
        login(data.access_token, formData.email);
        const isAdmin = data.user?.role === 'admin';
        console.log('Is admin:', isAdmin); // Debug log
        console.log('Redirecting to:', isAdmin ? '/admin' : '/');
        console.log('About to call router.push...');
        router.push(isAdmin ? '/admin' : '/');
        console.log('router.push called');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Login failed';
        if (errorMessage.includes('Account is not activated')) {
          setError('Account is not activated. Please check your email for the activation code or visit the activation page.');
        } else if (errorMessage.includes('Invalid email or password')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      // Google sign-in will be handled by the useEffect that checks session
      await signIn('google', { callbackUrl: '/login' });
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src={ChillingCoffeeLogo}
              alt="ChillingCoffee Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
              priority
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Sign in or create an account</h1>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onFinish} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[rgba(75,61,35,1)] focus:border-[rgba(75,61,35,1)] hover:border-[rgba(75,61,35,1)] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[rgba(75,61,35,1)] focus:border-[rgba(75,61,35,1)] hover:border-[rgba(75,61,35,1)] sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-green-700 border-gray-300 rounded focus:ring-green-600" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Keep me signed in</label>
            </div>
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-[rgba(75,61,35,1)] hover:text-[rgba(232,220,182,1)]">Forgot your password?</Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[rgba(75,61,35,1)] hover:bg-[rgba(232,220,182,1)] hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign in with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              type="button"
              disabled={loading}
              className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <GoogleIcon />
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-600">
            New to ChillingCoffee?{' '}
            <Link href="/register">
              <span className="font-medium text-[rgba(75,61,35,1)] hover:text-[rgba(232,220,182,1)] cursor-pointer">
                Create an account
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}