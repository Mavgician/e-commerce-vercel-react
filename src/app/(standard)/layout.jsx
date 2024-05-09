'use client'

import { Navigationbar } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { UserAuth } from '@/scripts/AuthContextProvider';
import { Loader } from '@/components/Loader';

export default function Layout({ children }) {
  const user = UserAuth()

  if (user.loading) return <Loader/>

  return (
    <>
      <Navigationbar />
      {children}
      <Footer/>
    </>
  );
}