// File: apps/client/src/components/product/ProductGallery.jsx

"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ProductGallery({ images, altText }) {
  const [mainImage, setMainImage] = useState(images[0]);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imgRef.current || !containerRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    imgRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div>
      {/* Main Image Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative aspect-square w-full overflow-hidden rounded-lg cursor-zoom-in group"
      >
        <Image
          ref={imgRef}
          src={mainImage}
          alt={altText}
          fill
          className="object-contain w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-[2.5]" // Scale is 2.5 for ~5x feel
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="mx-auto mt-4 w-full max-w-2xl lg:max-w-none">
        <ul className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-4">
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
