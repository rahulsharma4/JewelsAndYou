import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children, user }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setCart([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const cartData = await api.getCart();
      setCart(cartData || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, color = '') => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    setLoading(true);
    setError(null);
    try {
      await api.addToCart(product._id || product.id, quantity, color);
      await loadCart(); // Reload cart to get updated data
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity, color = '') => {
    if (!user) {
      throw new Error('Please login to update cart');
    }

    setLoading(true);
    setError(null);
    try {
      if (quantity <= 0) {
        await api.removeFromCart(productId, color);
      } else {
        await api.updateCartItem(productId, quantity, color);
      }
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      console.error('Error updating cart:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, color = '') => {
    if (!user) {
      throw new Error('Please login to remove from cart');
    }

    setLoading(true);
    setError(null);
    try {
      await api.removeFromCart(productId, color);
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) {
      throw new Error('Please login to clear cart');
    }

    setLoading(true);
    setError(null);
    try {
      await api.clearCart();
      await loadCart(); // Reload cart to get updated data
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cart.some(item => (item.product?._id || item.product?.id) === productId);
  };

  const getCartItemQuantity = (productId) => {
    const item = cart.find(item => (item.product?._id || item.product?.id) === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getCartItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};






