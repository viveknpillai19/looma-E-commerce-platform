import { Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <div>
      <header className="p-4 bg-gray-800 text-white">
        <h1 className="text-xl">Looma E-Commerce</h1>
        <nav>
          <Link to="/" className="mr-4">Home</Link>
          <Link to="/products" className="mr-4 hover:text-gray-300">Products</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
        </nav>
      </header>
      <main className="p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;