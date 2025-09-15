import { useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

function App() {
    const { token, isLoading: isAuthLoading, logout } = useAuth();
    const { itemCount, clearCart, fetchCart } = useCart();

    useEffect(() => {
        // We wait for auth to finish loading
        if (!isAuthLoading) {
            // If the user is logged in (token exists), we fetch their cart
            if (token) {
                fetchCart();
            }
        }
    }, [token, isAuthLoading, fetchCart]); // Effect runs when these values change

    const handleLogout = () => {
        logout();
        clearCart();
    };

    return (
        <div>
            <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
                <div><Link to="/" className="text-xl font-bold">Looma E-Commerce</Link></div>
                <nav>
                    <Link to="/" className="mr-4 hover:text-gray-300">Home</Link>
                    <Link to="/products" className="mr-4 hover:text-gray-300">Products</Link>
                    <Link to="/cart" className="mr-4 hover:text-gray-300 relative">
                        Cart
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                    {token ? (
                        <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
                    ) : (
                        <Link to="/login" className="hover:text-gray-300">Login</Link>
                    )}
                </nav>
            </header>
            <main className="p-4">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route element={<ProtectedRoute />}>
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                    </Route>
                </Routes>
            </main>
        </div>
    );
}

export default App;