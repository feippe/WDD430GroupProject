'use client';

import { useState } from 'react';

type ReviewFormProps = {
    productId: string;
    // Callback function to refresh the list of reviews after a successful submission
    onReviewSubmitted: () => void; 
};

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, rating, comment }),
                credentials: 'include'
            });

            if (response.ok) {
                setStatus('success');
                setRating(5); // Reset form
                setComment('');
                onReviewSubmitted(); // Refresh the parent component/list
            } else if (response.status === 401) {
                alert("You must be logged in to submit a review.");
                setStatus('idle');
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to submit review.");
                setStatus('error');
            }
        } catch (error) {
            console.error('Review submission error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating Input */}
                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                    <input 
                        type="number" 
                        id="rating" 
                        value={rating} 
                        onChange={(e) => setRating(parseInt(e.target.value))} 
                        min="1" 
                        max="5" 
                        required 
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md max-w-xs" 
                    />
                </div>

                {/* Comment Input */}
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea 
                        id="comment" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        rows={3} 
                        required 
                        className="mt-1 block w-full border border-gray-300 p-2 rounded-md"
                    />
                </div>

                {status === 'success' && <p className="text-green-600">✅ Review submitted successfully!</p>}
                {status === 'error' && <p className="text-red-600">❌ Submission failed. Check if you're logged in or if you already reviewed this.</p>}

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className={`px-4 py-2 rounded-md text-white font-semibold ${
                        status === 'loading' ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {status === 'loading' ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
}