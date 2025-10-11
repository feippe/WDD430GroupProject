'use client';

import { useEffect, useState, useCallback } from 'react';

type Review = {
    id: string;
    rating: number;
    comment: string;
    user: { name: string | null; email: string }; // Matches the 'include' in the GET API
    createdAt: string;
};

type ReviewListProps = {
    productId: string;
};

export default function ReviewList({ productId }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            // Use the GET /api/reviews?productId=[id] endpoint
            const response = await fetch(`/api/reviews?productId=${productId}`);
            const data: Review[] = await response.json();
            
            setReviews(data);
            
            // Calculate Average Rating
            if (data.length > 0) {
                const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
                setAverageRating(totalRating / data.length);
            } else {
                setAverageRating(0);
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    if (loading) {
        return <p>Loading reviews...</p>;
    }

    return (
        <div className="mt-10">
            <div className="flex items-center mb-6">
                <span className="text-xl font-semibold mr-2">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500">out of 5 stars</span>
            </div>
            
            {reviews.length === 0 ? (
                <p>Be the first to leave a review!</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-4">
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold">{review.user.name || review.user.email}</p>
                                <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-sm text-yellow-600 mb-2">
                                {/* Simple rating display (e.g., ****) */}
                                {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}