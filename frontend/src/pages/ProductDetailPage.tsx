// in frontend/src/pages/ProductDetailPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '../types';
import { getProductById } from '../services/apiService';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  // useParams is a hook from react-router-dom that gives us access to URL parameters.
  // We're telling it to expect a parameter named 'id'.
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart()

  useEffect(() => {
    // If there's no id in the URL, we do nothing.
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        // We'll handle the 'not found' case more gracefully later
      }
    };

    fetchProduct();
  }, [id]); // This effect re-runs whenever the 'id' parameter changes.

  // Display a loading message while the product is being fetched
  if (!product) {
    return <div>Loading...</div>;
  }

  // Once loaded, display the product details
  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg shadow-lg"/>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>
          <p className="text-3xl font-light text-blue-600 mb-6">${product.price}</p>
                    <button 
            onClick={() => addToCart(product)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;