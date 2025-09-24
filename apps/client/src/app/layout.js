// File: apps/client/src/app/layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // Import AuthProvider
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BlashBerry",
  description: "Modern E-commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* AuthProvider wraps everything */}
        <AuthProvider>
          <CartProvider>
            <Toaster position="bottom-center" />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
