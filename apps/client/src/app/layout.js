// File: apps/client/src/app/layout.js

import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'BlashBerry',
  description: 'Modern E-commerce Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Toaster position="bottom-center" />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}