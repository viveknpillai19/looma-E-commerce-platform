// in frontend/src/services/apiService.ts
import axios from 'axios';
import type { Product } from '../types';
import type{ LoginCredentials, AuthResponse, RegistrationData } from '../types';


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

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (data: RegistrationData): Promise<any> => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
};