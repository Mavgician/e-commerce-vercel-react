'use client'

import { Loader } from '@/components/Loader';
import { UserAuth } from '@/scripts/AuthContextProvider';

export default function Layout({ children }) {
  const user = UserAuth()

  if (user.loading) return <Loader/>

  return (
    <>
      {children}
    </>
  );
}