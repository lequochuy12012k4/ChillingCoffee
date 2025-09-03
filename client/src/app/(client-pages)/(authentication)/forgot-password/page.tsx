'use client';

import Link from 'next/link';
import { useState } from 'react';
import ChillingCoffeeLogo from '@/../public/Navbar/ChillingCoffee_logo.png';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'If the email exists, a reset link has been sent.');
        if (data.resetUrl) setResetUrl(data.resetUrl);
      }
      else setError(data.error || data.message || 'Failed to send reset email');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f7f7] px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
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
          <h1 className="text-2xl font-semibold text-gray-800">Forgot Password</h1>
        </div>
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(75,61,35,1)] sm:text-sm ${
                errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-[rgba(75,61,35,1)] hover:border-[rgba(75,61,35,1)]'
              }`}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-[rgba(75,61,35,1)] text-white rounded-md disabled:opacity-50">
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link href="/login">
              <span className="font-bold text-[rgba(75,61,35,1)] hover:text-[rgba(232,220,182,1)]">Sign in</span>
            </Link>
          </p>
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


