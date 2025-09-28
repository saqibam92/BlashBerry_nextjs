import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // Import AuthProvider
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";
import ThemeRegistry from "@/components/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BlashBerry",
  description: "Modern E-commerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeRegistry>
          {/* AuthProvider now wraps the entire application */}
          <AuthProvider>
            <CartProvider>
              <Toaster position="bottom-center" />
              {children}
            </CartProvider>
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
