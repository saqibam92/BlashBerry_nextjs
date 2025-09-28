// File: apps/client/src/components/product/ProductReviews.jsx

"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  Rating,
  Button,
  TextField,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { formatDate } from "@/lib/utils";
import api from "@/lib/api"; // We'll use the generic api instance here
import toast from "react-hot-toast";

export default function ProductReviews({
  productSlug,
  reviews,
  initialRating,
  initialNumReviews,
}) {
  const { isAuthenticated, user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(`/api/products/${productSlug}/reviews`, {
        rating,
        comment,
      });
      toast.success("Review submitted successfully!");
      // Here you would ideally refetch reviews or update the state optimistically
      setRating(0);
      setComment("");
      window.location.reload(); // Simple way to refresh data
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Customer Reviews
      </h2>

      {initialNumReviews > 0 && (
        <div className="flex items-center my-4">
          <Rating value={initialRating} precision={0.5} readOnly />
          <p className="ml-2 text-sm text-gray-600">
            Based on {initialNumReviews} reviews
          </p>
        </div>
      )}

      {/* Review Submission Form */}
      <div className="my-10">
        <h3 className="text-lg font-medium">Write a review</h3>
        {isAuthenticated ? (
          <form onSubmit={handleSubmitReview} className="mt-4 space-y-4">
            <div>
              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
              />
            </div>
            <TextField
              label="Your review"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Submit Review"}
            </Button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-gray-600">
            Please{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:underline"
            >
              sign in
            </Link>{" "}
            to write a review.
          </p>
        )}
      </div>

      {/* List of Reviews */}
      <div className="space-y-8 mt-10 border-t pt-10">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="flex gap-4">
              <Avatar>{review.name.charAt(0)}</Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-gray-500">
                    - {formatDate(review.createdAt)}
                  </p>
                </div>
                <Rating value={review.rating} readOnly size="small" />
                <p className="mt-2 text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
