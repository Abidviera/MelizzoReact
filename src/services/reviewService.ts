import apiClient from './apiClient';
import type { Review } from '../types';

export interface RatingSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface ReviewsResponse {
  items: Review[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
  title?: string;
}

async function getProductReviews(
  productId: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<ReviewsResponse> {
  const response = await apiClient.get<ReviewsResponse>(
    `/reviews/product/${productId}`,
    { params: { page, pageSize } },
  );
  return response.data;
}

async function getRatingSummary(productId: string): Promise<RatingSummary> {
  const response = await apiClient.get<RatingSummary>(
    `/reviews/product/${productId}/summary`,
  );
  return response.data;
}

async function createReview(payload: CreateReviewPayload): Promise<Review> {
  const response = await apiClient.post<Review>('/reviews', payload);
  return response.data;
}

export const ReviewService = {
  getProductReviews,
  getRatingSummary,
  createReview,
};
