// File: apps/client/src/components/products/ProductCard.jsx

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Rating,
} from "@mui/material";

const ProductCard = ({ product }) => {
  return (
    <Card className="h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      <Link href={`/products/${product.slug}`} passHref>
        <CardMedia
          component="img"
          alt={product.name}
          height="250"
          image={product.imageUrl}
          title={product.name}
          className="object-cover"
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            className="truncate"
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mb-2">
            {product.category}
          </Typography>
          <div className="flex items-center justify-between">
            <Typography variant="h5" color="primary">
              ${product.price}
            </Typography>
            <Rating
              name="read-only"
              value={product.rating}
              precision={0.5}
              readOnly
            />
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
