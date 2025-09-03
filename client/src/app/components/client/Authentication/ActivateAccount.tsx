'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ChillingCoffeeLogo from '@/../public/Navbar/ChillingCoffee_logo.png';

export default function ActivateAccount() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activationCode, setActivationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const message = searchParams.get('message');
    if (message) {
      setSuccess(message);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!activationCode.trim()) {
      setError('Please enter your activation code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: activationCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Account activation failed');
      }

      setSuccess('Account activated successfully! You can now log in.');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push('/login?message=Account activated successfully! Please log in.');
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Account activation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src={ChillingCoffeeLogo}
              alt="ChillingCoffee Logo"
              width={100}
              height={100}
              className="mx-auto mb-4"
            />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">Activate Your Account</h1>
          <p className="text-gray-600 mt-2">
            Enter the activation code sent to your email to activate your account
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="activationCode" className="block text-sm font-medium text-gray-700">
              Activation Code
            </label>
            <div className="mt-1">
              <input
                id="activationCode"
                name="activationCode"
                type="text"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="Enter your activation code"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(75,61,35,1)] focus:border-[rgba(75,61,35,1)] hover:border-[rgba(75,61,35,1)] sm:text-sm"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Check your email for the activation code sent after registration
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[rgba(106,88,54,1)] hover:bg-[rgba(232,220,182,1)] hover:text-black'
              }`}
            >
              {isLoading ? 'Activating...' : 'Activate Account'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register">
              <span className="font-bold text-[rgba(75,61,35,1)] hover:text-[rgba(232,220,182,1)]">
                Register here
              </span>
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already activated?{' '}
            <Link href="/login">
              <span className="font-bold text-[rgba(75,61,35,1)] hover:text-[rgba(232,220,182,1)]">
                Sign in here
              </span>
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Need help?</h3>
          <p className="text-sm text-blue-700">
            If you didn't receive an activation code or need assistance, please check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
