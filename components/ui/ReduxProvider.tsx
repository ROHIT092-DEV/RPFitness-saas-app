// src/providers/ReduxProvider.tsx
'use client';

import { fetchMe } from '@/app/store/slices/authSlice';
import { store } from '@/app/store/store';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';


export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  // Optionally fetch current user immediately when provider mounts
  useEffect(() => {
    store.dispatch(fetchMe());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
