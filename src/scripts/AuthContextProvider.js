'use client'

import { useAuthState } from 'react-firebase-hooks/auth';
import { useContext, createContext } from 'react';

import { auth } from '@/scripts/firebase';

// Defines the context for entire application
const AuthContext = createContext()

// Defines the context provider with user data, loading state, and error state for entire application.
export const AuthContextProvider = ({ children }) => {
  const [user, loading, error] = useAuthState(auth)

  return <AuthContext.Provider value={{user, loading, error}}>{children}</AuthContext.Provider>
}

// Exported function that returns the context provided by context provider.
export const UserAuth = () => useContext(AuthContext)