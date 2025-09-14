// in frontend/src/pages/ProductsPage.tsx
import { useEffect, useState } from 'react';
import type { Product } from '../types';
import { getProducts } from '../services/apiService';

const ProductsPage = () => {
  // useState is a React hook to store state. 'products' will hold our array of products.
  // 'setProducts' is the function we use to update it.
  const [products, setProducts] = useState<Product[]>([]);
  // We'll add loading and error states later for a better user experience.

  // useEffect is a hook that runs code after the component renders.
  // The empty dependency array [] means it will only run once, when the component first mounts.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-8">Explore Our Products</h1>
      
      {/* We will create a grid to display the product cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        
        {/* We map over the 'products' array. For each product, we render a card. */}
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg shadow-lg overflow-hidden">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate">{product.name}</h2>
              <p className="text-gray-600 mt-2">${product.price}</p>
              {/* We'll add an "Add to Cart" button here later */}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default ProductsPage;