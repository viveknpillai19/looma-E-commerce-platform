import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isLoading } = useCart();

  const isCheckoutDisabled = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return true;
    return cartItems.some(item => item.quantity > item.stockQuantity);
  }, [cartItems]);

  if (isLoading) {
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
        
        <div className="bg-gray-100 p-6 rounded-lg">
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
            disabled={isCheckoutDisabled}
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;