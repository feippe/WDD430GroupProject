'use client';

import { useState } from 'react';

export default function AddProductForm() {
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Send data to the POST /api/products endpoint
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // sellerId is securely pulled from the session token on the backend
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', description: '', price: '', category: '' }); // Clear form
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Item</h2>
      
      {/* Form Fields */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 p-2 rounded-md" />
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" id="description" rows={3} value={formData.description} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 p-2 rounded-md" />
      </div>
      
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 p-2 rounded-md" step="0.01" />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 p-2 rounded-md" />
      </div>

      {/* Status Messages */}
      {status === 'success' && <p className="text-green-600 mb-4">✅ Product created successfully!</p>}
      {status === 'error' && <p className="text-red-600 mb-4">❌ Error creating product. Please try again.</p>}

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={status === 'loading'}
        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition duration-150 ${
          status === 'loading' 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {status === 'loading' ? 'Saving...' : 'Create Product'}
      </button>
    </form>
  );
}