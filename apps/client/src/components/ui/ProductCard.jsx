// File: apps/client/src/components/ui/ProductCard.jsx

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

const ProductCard = ({ product }) => {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{formatPrice(product.price)}</p>
    </Link>
  );
};

export default ProductCard;