import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";

import { Navigationbar } from '@/app/components/NavigationBar';
import { AuthContextProvider } from '@/app/scripts/AuthContextProvider';

export const metadata = {
  title: "ConFlix - Get your tickets!",
  description: "Ticket reseller for concerts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <Navigationbar />
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}