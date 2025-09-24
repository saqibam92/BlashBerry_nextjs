// File: apps/client/src/components/layout/Header.jsx

'use client';
import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

const Header = () => {
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 text-2xl font-bold text-primary-600">
            BlashBerry
          </Link>
        </div>
        <div className="flex gap-x-8">
            <Link href="/products" className="text-sm font-semibold leading-6 text-gray-900">Shop</Link>
            <Link href="#" className="text-sm font-semibold leading-6 text-gray-900">New Arrivals</Link>
            <Link href="#" className="text-sm font-semibold leading-6 text-gray-900">Sales</Link>
        </div>
        <div className="flex flex-1 justify-end items-center gap-x-6">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-primary-600" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href="/auth/login">
            <User className="h-6 w-6 text-gray-600 hover:text-primary-600" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;