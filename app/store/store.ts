import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

// redux-persist's default storage uses window.localStorage which is not available
// during server-side rendering. Provide a noop storage when running on the server.
const createNoopStorage = () => {
  return {
    getItem(key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(key: string, value: string | null): Promise<string | null> {
      return Promise.resolve(value);
    },
    removeItem(key: string): Promise<void> {
      return Promise.resolve();
    },
  } as const;
};

const storageToUse = typeof window !== 'undefined' ? storage : createNoopStorage();

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: 'root',
  storage: storageToUse,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
