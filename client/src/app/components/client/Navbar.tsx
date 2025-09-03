'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ChillingCoffeeLogo from '@/../public/Navbar/ChillingCoffee_logo.png';
import AccountLogo from '@/../public/Navbar/user.png'; // Adjust the path as necessary
import { useAuth } from '@/app/contexts/AuthContext';
import { useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const { data: session } = useSession();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const sessionUserName = session?.user?.name || (session?.user as any)?.email;
  const displayName = user?.name || user?.email || sessionUserName || 'Account';
  const isLoggedIn = Boolean(user) || Boolean(session?.user);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center relative">
          <Link href="/" className="flex items-center space-x-4" onClick={closeMenu}>
            <Image
              src={ChillingCoffeeLogo}
              alt="ChillingCoffee Logo"
              width={70}
              height={70}
              priority 
            />
            <span className="hidden sm:block text-2xl font-bold text-gray-800">
              ChillingCoffee
            </span>
          </Link>

          {/* Center: ChillingCoffee for mobile */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 md:hidden">
            <span className="text-lg font-bold text-gray-800">ChillingCoffee</span>
          </div>

          {/* Right: Menu and account */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-[rgba(232,220,182,1)] font-medium">Products</Link>
            <Link href="/feedback" className="text-gray-600 hover:text-[rgba(232,220,182,1)] font-medium">Feedback</Link>
            <Link href="/charity" className="text-gray-600 hover:text-[rgba(232,220,182,1)] font-medium">Charity</Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Image
                    src={AccountLogo}
                    alt="User Icon"
                    width={32}
                    height={32}
                  />
                  <span className="text-sm font-medium text-gray-700">{displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-[rgba(75,61,35,1)] font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="ml-4">
                <Image
                  src={AccountLogo}
                  alt="User Icon"
                  width={32}
                  height={32}
                />
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 focus:outline-none ml-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden absolute left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out ${
          menuOpen ? 'top-full opacity-100' : '-top-96 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-5 py-6">
          <Link href="/products" className="text-gray-700 text-lg" onClick={closeMenu}>Products</Link>
          <Link href="/feedback" className="text-gray-700 text-lg" onClick={closeMenu}>Feedback</Link>
          <Link href="/gift-cards" className="text-gray-700 text-lg" onClick={closeMenu}>Gift Cards</Link>
          <hr className="w-3/4 my-2" />
          
          {isLoggedIn ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="flex items-center space-x-2 text-lg text-green-700">
                <Image
                  src={AccountLogo}
                  alt="User Icon"
                  width={28}
                  height={28}
                />
                <span>{displayName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-lg text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center space-x-2 text-lg text-green-700" onClick={closeMenu}>
               <Image
                  src={AccountLogo}
                  alt="User Icon"
                  width={28}
                  height={28}
               />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;