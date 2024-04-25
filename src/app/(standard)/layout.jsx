import { Navigationbar } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

import 'bootstrap/dist/css/bootstrap.min.css';

import "@/styles/globals.css";

export default function Layout({ children }) {
  return (
    <>
      <Navigationbar />
      {children}
      <Footer/>
    </>
  );
}