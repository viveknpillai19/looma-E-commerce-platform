import { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import * as apiService from '../services/apiService';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isLoading: isCartLoading, fetchCart } = useCart();
  const [error, setError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  const isCheckoutDisabled = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return true;
    return cartItems.some(item => item.quantity > item.stockQuantity);
  }, [cartItems]);

  const handleCheckout = async () => {
    setError('');
    setIsPlacingOrder(true);
    try {
      await apiService.createOrder();
      await fetchCart(); // This will fetch an empty cart, clearing the UI
      navigate('/order-confirmation');
    } catch (err: any) {
      console.error("Failed to create order:", err);
      // Display the specific error message from the backend if it exists
      setError(err.response?.data?.message || 'There was a problem placing your order.');
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  if (isCartLoading) {
    return <div>Loading Cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link to="/products" className="text-blue-500 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center border-b py-4">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded mr-4" />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                {item.quantity > item.stockQuantity && (
                  <span className="text-red-500 bg-red-100 text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block">
                    Out of Stock ({item.stockQuantity} left)
                  </span>
                )}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 hover:text-red-700 text-sm mt-1"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                  className="w-16 text-center border rounded mx-2"
                />
              </div>
              <div className="font-semibold w-20 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg self-start">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={isCheckoutDisabled || isPlacingOrder}
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isPlacingOrder ? 'Placing Order...' : 'Proceed to Checkout'}
          </button>
          {isCheckoutDisabled && !isPlacingOrder && (
            <p className="text-red-500 text-center text-sm mt-2">
              Please remove out-of-stock items to continue.
            </p>
          )}
          {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default CartPage;