import { Navigationbar } from '@/components/NavigationBar';

export default function Layout({ children }) {
  return (
    <>
      <Navigationbar />
      {children}
    </>
  );
}