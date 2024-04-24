import { Navigationbar } from '@/components/Navigation';

import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";

export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}