'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { useRouter } from 'next/navigation';
import { logout } from '../store/authSlice';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
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

  if (!user)
    return (
      <div className="text-center mt-10">
        Requesting you to Login First for Awasome Experience with Us
        <Link href="/login">Click here to Visit Login Page</Link>
      </div>
    );

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto p-6 bg-gray-700 min-h-screen rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-white ">
          Welcome Back {user.fullName}{' '}
        </h2>
        <p className="text-gray-100">Your Email: {user.email}</p>
        <p className="text-gray-100">You are : {user.role} user</p>
        <div className="flex space-x-4">
          <Button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white py-2 rounded"
          >
            Logout
          </Button>

          <Button className="mt-4 bg-blue-600 text-white py-2 rounded">
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
