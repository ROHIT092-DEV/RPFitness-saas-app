'use client';

import { RootState } from '@/app/store/store';
import Image from 'next/image';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Home, Phone, Info } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/store/authSlice';

function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  const menus = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/contact', label: 'Contact', icon: Phone },
    { href: '/about', label: 'About', icon: Info },
  ];
  const pathnname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/users/logout', {
      method: 'POST',
      credentials: 'include',
    });
    dispatch(logout());
    router.push('/login');
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex space-x-24">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-[#0ea5a4] tracking-tight">
              RP<span className="text-black">Fitness</span>
            </h1>
          </div>

          <div className=" space-x-8 hidden lg:flex">
            {menus.map(({ href, label, icon: Icon }) => {
              const isActive = pathnname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-4 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-gray-900 font-semibold'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Phone View menu Icon */}

          <div className="lg:hidden fixed bottom-0 left-0 w-full bg-black  shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-around items-center py-3 px-6 z-50 rounded-t-2xl">
            {/* Home */}
            <Link
              href="/"
              className="flex flex-col items-center text-white hover:text-black transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9.75L12 4.5l9 5.25v8.25A2.25 2.25 0 0118.75 20H5.25A2.25 2.25 0 013 18V9.75z"
                />
              </svg>
              <span className="text-xs font-semibold">Home</span>
            </Link>

            {/* Contact (Center Button) */}
            <Link
              href="/contact"
              className="flex flex-col items-center justify-center bg-yellow-500 text-black rounded-full p-4 -mt-8 shadow-lg hover:scale-110 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0L12 12.75 2.25 6.75"
                />
              </svg>
            </Link>

            {/* About */}
            <Link
              href="/about"
              className="flex flex-col items-center text-white hover:text-black transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mb-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-semibold">About</span>
            </Link>
          </div>
        </div>
        <div>
          <AlertDialog>
            <AlertDialogTrigger className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-black cursor-pointer">
              {/* {user ? (
                 {user?.fullName
                .split(' ')
                .map((word) => word[0])
                .join('')}
              ) : (
                'U'
              )} */}

              {user ? (
                <>
                  {user?.fullName
                    .split(' ')
                    .map((word) => word[0])
                    .join('')}
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button>Login</Button>
                  </Link>
                </>
              )}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <Button onClick={handleLogout}>Logout</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default Header;
