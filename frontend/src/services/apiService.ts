// in frontend/src/services/apiService.ts
import axios from 'axios';
import type { Product } from '../types';

// The base URL of our Spring Boot backend
const API_URL = 'http://localhost:8080/api/v1';

export const getProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};