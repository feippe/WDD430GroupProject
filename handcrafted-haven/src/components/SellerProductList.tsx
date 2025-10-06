'use client';
import { useState } from 'react';

type Product = {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string; 
    createdAt: Date;
};

type SellerProductListProps = {
    products: Product[];
};

export default function SellerProductList({ products: initialProducts }: SellerProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Product>>({});

    // Handler for the DELETE operation
    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.status === 204) {
                // If successful (No Content), remove from local state
                setProducts(products.filter(p => p.id !== productId));
                alert('Product deleted successfully!');
            } else {
                alert('Failed to delete product. Check ownership and session.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('An error occurred during deletion.');
        }
    };

    // Handler for initiating the EDIT mode
    const handleEditClick = (product: Product) => {
        setIsEditing(product.id);
        setEditFormData({ name: product.name, price: product.price, description: product.description, category: product.category });
    };

    // Handler for saving the UPDATE operation
    const handleSaveEdit = async (productId: string) => {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editFormData),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                // Update the product list state
                setProducts(products.map(p => p.id === productId ? { ...p, ...updatedProduct } : p));
                setIsEditing(null);
                alert('Product updated successfully!');
            } else {
                alert('Failed to update product. Check permissions.');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('An error occurred during update.');
        }
    };

    // If no products exist
    if (products.length === 0) {
        return <p>You have no listings yet. Use the form to add your first handcrafted item!</p>;
    }

    // Render the list
    return (
        <div className="space-y-4">
            {products.map((product) => (
                <div key={product.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col">
                    {isEditing === product.id ? (
                        // EDIT MODE
                        <div className="space-y-2">
                            <input 
                                type="text" 
                                value={editFormData.name} 
                                onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full border p-1"
                            />
                            <textarea 
                                value={editFormData.description} 
                                onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full border p-1"
                            />
                            <input 
                                type="number" 
                                value={editFormData.price || ''} 
                                onChange={(e) => setEditFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                className="w-full border p-1"
                            />
                            <div className="flex space-x-2 mt-2">
                                <button 
                                    onClick={() => handleSaveEdit(product.id)}
                                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                >
                                    Save
                                </button>
                                <button 
                                    onClick={() => setIsEditing(null)}
                                    className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        // VIEW MODE
                        <>
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-gray-600">${product.price.toFixed(2)} - {product.category}</p>
                            <p className="text-sm italic truncate max-w-full">{product.description}</p>
                            <div className="flex space-x-2 mt-3">
                                <button 
                                    onClick={() => handleEditClick(product)}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}