import React, { createContext, useState, useContext,type ReactNode, useCallback, useMemo } from 'react';
import type{ CartItem, Product } from '../types';
import * as apiService from '../services/apiService';

interface ICartContext {
    cartItems: CartItem[];
    isLoading: boolean;
    itemCount: number;
    cartTotal: number;
    fetchCart: () => Promise<void>;
    addToCart: (product: Product) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
}

const CartContext = createContext<ICartContext | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const itemCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);
    const cartTotal = useMemo(() => cartItems.reduce((total, item) => total + item.price * item.quantity, 0), [cartItems]);

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await apiService.getCart();
            setCartItems(data);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setCartItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addToCart = async (product: Product) => {
        try {
            await apiService.addItemToCart(product.id, 1);
            await fetchCart();
        } catch (error) { console.error("Failed to add item", error); }
    };

    const removeFromCart = async (productId: string) => {
        try {
            await apiService.removeCartItem(productId);
            await fetchCart();
        } catch (error) { console.error("Failed to remove item", error); }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }
        try {
            await apiService.updateCartItemQuantity(productId, quantity);
            await fetchCart();
        } catch (error) { console.error("Failed to update quantity", error); }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, isLoading, itemCount, cartTotal, fetchCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};