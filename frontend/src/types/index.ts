export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrl: string;
  attributes: { [key: string]: any };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}