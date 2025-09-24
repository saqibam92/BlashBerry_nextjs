// File: apps/client/src/components/product/ProductGallery.jsx

"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, altText }) {
  const [mainImage, setMainImage] = useState(images[0]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    e.currentTarget.style.backgroundPosition = `${x}% ${y}%`;
  };

  return (
    <div>
      {/* Main Image with Zoom */}
      <figure
        onMouseMove={handleMouseMove}
        style={{ backgroundImage: `url(${mainImage})` }}
        className="relative aspect-square w-full overflow-hidden rounded-lg bg-cover bg-center cursor-zoom-in"
      >
        <Image
          src={mainImage}
          alt={altText}
          width={800}
          height={800}
          className="h-full w-full object-cover object-center transition-opacity duration-500 opacity-0 hover:opacity-100"
          priority
        />
      </figure>

      {/* Thumbnails */}
      <div className="mx-auto mt-4 w-full max-w-2xl lg:max-w-none">
        <ul className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <li key={index} className="aspect-square">
              <button
                onClick={() => setMainImage(image)}
                className={`flex h-full w-full items-center justify-center rounded-lg border-2 p-1 transition ${
                  mainImage === image
                    ? "border-primary-600"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover object-center rounded-md"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
