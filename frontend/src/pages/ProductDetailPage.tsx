import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type{ Product } from '../types';
import { getProductById } from '../services/apiService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORT useAuth

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();
    const { token } = useAuth(); // <-- 2. GET THE TOKEN
    const navigate = useNavigate(); // <-- 3. GET THE NAVIGATE FUNCTION

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!token) {
            // 4. IF NOT LOGGED IN, REDIRECT
            // We pass the current path in the 'state' object so the login page can use it.
            navigate('/login', { state: { from: `/products/${id}` } });
        } else if (product) {
            // 5. IF LOGGED IN, ADD TO CART
            addToCart(product);
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg shadow-lg" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 text-lg mb-6">{product.description}</p>
                    <p className="text-3xl font-light text-blue-600 mb-6">${product.price}</p>
                    {/* 6. UPDATE THE BUTTON'S ONCLICK HANDLER */}
                    <button
                        onClick={handleAddToCart}
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