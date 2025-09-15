// in frontend/src/pages/OrderConfirmationPage.tsx
import { Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
    return (
        <div className="container mx-auto text-center p-8">
            <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
            <p className="text-lg mb-6">Your order has been placed successfully.</p>
            <Link to="/products" className="text-blue-500 hover:underline">
                Continue Shopping
            </Link>
        </div>
    );
};

export default OrderConfirmationPage;