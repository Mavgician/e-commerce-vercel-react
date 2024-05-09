import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";

import { AuthContextProvider } from '@/scripts/AuthContextProvider';

export const metadata = {
  title: 'ConFlix - Get your tickets!',
  description: 'Ticket reseller for concerts',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}