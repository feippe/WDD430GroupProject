'use client'; 

import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react'; 

type ReviewSectionProps = {
    productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
    const { data: session, status } = useSession(); 
    const [refreshKey, setRefreshKey] = useState(0); 

    const handleReviewSubmitted = () => {
        setRefreshKey(prev => prev + 1);
    };

    const isLoading = status === 'loading';

    return (
        <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h2>

            {/* 1. ReviewList: Siempre visible */}
            <ReviewList productId={productId} key={productId + '-' + refreshKey} />
            
            <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                
                {/* 2. Renderizado Condicional */}
                {isLoading ? (
                    <p>Loading user status...</p>
                ) : session ? (
                    // Si el usuario está logueado, muestra el formulario
                    <ReviewForm 
                        productId={productId} 
                        onReviewSubmitted={handleReviewSubmitted} 
                    />
                ) : (
                    // Si no está logueado, muestra el mensaje para iniciar sesión
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            Please <button 
                                onClick={() => signIn()} 
                                className="font-bold text-indigo-600 hover:text-indigo-800 underline"
                            >
                                sign in
                            </button> to submit a review.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}