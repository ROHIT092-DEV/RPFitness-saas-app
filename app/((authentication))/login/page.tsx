'use client';

import React, { useState } from 'react';

import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/app/store/store';
import { setUser, setTokens } from '@/app/store/authSlice';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // no toast provider used — inline errors only

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(process.env.NEXT_PUBLIC_API_URL);
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Using explicit backend URL requested by user
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Try to parse body safely, even on non-JSON responses
      const tryParseJson = async (res: Response) => {
        try {
          return await res.json();
        } catch (_) {
          return null;
        }
      };

      if (!response.ok) {
        const errorData = await tryParseJson(response);
        const message = (errorData && (errorData.message || errorData.error)) || `${response.status} ${response.statusText}` || 'Login failed';
        setError(message);
        return;
      }

      const data = (await tryParseJson(response)) || {};
      // API returns { user, accessToken, refreshToken }
      const user = data.user;
      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      if (user) {
        dispatch(setUser(user)); // Save user to Redux
      }
      if (accessToken && refreshToken) {
        dispatch(setTokens({ accessToken, refreshToken }));
        // persist tokens for logout call from other components
        try {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        } catch (e) {
          // ignore storage errors in SSR contexts
        }
      }

      // login successful — navigate to home
      router.push('/');
    } catch (err) {
      console.error('login failed', err);
      const message = (err as Error).message || 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left side - text + form */}
      <div className="flex flex-col justify-center p-8 lg:p-16 bg-[#061729]">
        <div className="max-w-lg w-full mx-auto">
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-300 mb-6">
            Login to continue your fitness journey
          </p>

          <form onSubmit={handleSubmit} aria-busy={loading}>
            <div className="flex flex-col items-start mb-4">
              <label htmlFor="email" className="text-sm text-gray-200 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0ea5a4]"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="flex flex-col items-start mb-4">
              <label htmlFor="password" className="text-sm text-gray-200 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0ea5a4]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full lg:w-auto px-6 py-2 rounded-md bg-[#0ea5a4] text-white font-medium shadow-sm hover:opacity-95 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && (
              <div className="mt-3 text-sm text-red-400" role="alert">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right side - image */}
      <div className="relative w-full h-72 lg:h-screen">
        <Image
          src="https://images.unsplash.com/photo-1539794830467-1f1755804d13?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZpdG5lc3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=1200"
          alt="Fitness login"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
