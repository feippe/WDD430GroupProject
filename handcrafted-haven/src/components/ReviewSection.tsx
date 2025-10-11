'use client';

import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { useState } from 'react';
import Link from 'next/link'; // Importamos Link

type ReviewSectionProps = {
    productId: string;
    isLoggedIn: boolean; // Recibimos el estado de la sesión como prop
}

export default function ReviewSection({ productId, isLoggedIn }: ReviewSectionProps) {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleReviewSubmitted = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Customer Reviews</h2>

            {/* ReviewList siempre es visible */}
            <ReviewList productId={productId} key={productId + '-' + refreshKey} />
            
            <div className="mt-8 border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
                
                {/* Ahora usamos la prop 'isLoggedIn' para el renderizado condicional */}
                {isLoggedIn ? (
                    // Si el usuario está logueado, muestra el formulario
                    <ReviewForm 
                        productId={productId} 
                        onReviewSubmitted={handleReviewSubmitted} 
                    />
                ) : (
                    // Si no está logueado, muestra el mensaje con un Link a la página de login
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            Please{' '}
                            <Link 
                                href="/login" 
                                className="font-bold text-indigo-600 hover:text-indigo-800 underline"
                            >
                                sign in
                            </Link>
                            {' '}to submit a review.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}