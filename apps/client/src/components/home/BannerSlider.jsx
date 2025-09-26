// apps/client/src/components/home/BannerSlider.jsx

"use client";
import Link from "next/link";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useState } from "react";

export default function BannerSlider({ banners }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const SliderContent = () => (
    <Box
      sx={{
        width: "100%",
        height: { xs: "30vh", md: "60vh" },
        borderRadius: 2,
        backgroundImage: `url(${currentBanner.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "center", p: 2 }}
      >
        {currentBanner.title}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ position: "relative", mb: 4 }}>
      {currentBanner.link ? (
        <Link href={currentBanner.link} passHref>
          <SliderContent />
        </Link>
      ) : (
        <SliderContent />
      )}

      <IconButton
        onClick={goToPrevious}
        sx={{
          position: "absolute",
          top: "50%",
          left: 16,
          transform: "translateY(-50%)",
          color: "white",
          bgcolor: "rgba(0,0,0,0.5)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
        }}
      >
        <ArrowBackIos />
      </IconButton>
      <IconButton
        onClick={goToNext}
        sx={{
          position: "absolute",
          top: "50%",
          right: 16,
          transform: "translateY(-50%)",
          color: "white",
          bgcolor: "rgba(0,0,0,0.5)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
        }}
      >
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
}
