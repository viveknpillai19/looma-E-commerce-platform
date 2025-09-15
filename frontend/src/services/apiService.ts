// in frontend/src/services/apiService.ts
import axios from 'axios';
import type { Product, LoginCredentials, AuthResponse, RegistrationData, CartItem } from '../types';

const API_URL = 'http://localhost:8080/api/v1';

// Create a new Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// THIS IS THE INTERCEPTOR
// It runs before every request made with this 'api' instance.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // If a token exists, add the 'Authorization: Bearer <token>' header
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


// All our functions will now use the 'api' instance instead of the global 'axios'
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (data: RegistrationData): Promise<any> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getCart = async (): Promise<CartItem[]> => {
  const response = await api.get('/cart');
  return response.data;
};

export const addItemToCart = async (productId: string, quantity: number): Promise<void> => {
  await api.post(`/cart/items`, null, { params: { productId, quantity } });
};

export const updateCartItemQuantity = async (productId: string, quantity: number): Promise<void> => {
  await api.put(`/cart/items/${productId}`, { quantity });
};

export const removeCartItem = async (productId: string): Promise<void> => {
  await api.delete(`/cart/items/${productId}`);
};