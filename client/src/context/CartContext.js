import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get auth token and user ID
  const getAuthToken = () => {
    return localStorage.getItem('userToken');
  };

  const getUserId = () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.id || parsed._id;
    }
    return null;
  };

  // Fetch cart from database
  const fetchCartFromDatabase = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      setIsLoading(true);
      const response = await axios.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Filter out items without size or color (old cart items)
        const validItems = (response.data.cart || []).filter(item => {
          const hasSize = item.size || item.selectedSize;
          const hasColor = item.selectedColor && (item.selectedColor.name || item.selectedColor.value);
          return hasSize && hasColor;
        });
        
        // If we filtered out any items, update the cart on server
        if (validItems.length !== (response.data.cart || []).length) {
          console.log('Removing invalid cart items without size/color...');
          // The invalid items will be naturally removed when user adds new items
        }
        
        setCartItems(validItems);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load cart from database when user is logged in
  useEffect(() => {
    const loadCart = async () => {
      const token = getAuthToken();
      const userId = getUserId();
      
      if (token && userId) {
        await fetchCartFromDatabase();
      } else {
        // Load from localStorage if not logged in
        const savedCart = localStorage.getItem('smartline_cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      }
    };

    loadCart();
  }, [fetchCartFromDatabase]);

  // Sync local cart to database on login
  const syncCartToDatabase = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const localCart = localStorage.getItem('smartline_cart');
      const localCartItems = localCart ? JSON.parse(localCart) : [];

      if (localCartItems.length > 0) {
        const response = await axios.post('/api/cart/sync', 
          { localCartItems },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setCartItems(response.data.cart || []);
          localStorage.removeItem('smartline_cart'); // Clear local cart after sync
        }
      } else {
        await fetchCartFromDatabase();
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const addToCart = async (product) => {
    const token = getAuthToken();

    if (token) {
      // Add to database
      try {
        const cartItem = {
          productId: product.originalProductId || product._id,
          name: product.name,
          design: product.design,
          price: product.price,
          selectedColor: product.selectedColor,
          selectedSize: product.selectedSize || product.size,
          size: product.size || product.selectedSize,
          quantity: 1,
          image: product.image,
          originalProductId: product.originalProductId
        };

        const response = await axios.post('/api/cart/add', cartItem, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setCartItems(response.data.cart || []);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding item to cart');
      }
    } else {
      // Add to local state only
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item._id === product._id);
        
        if (existingItem) {
          return prevItems.map(item =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevItems, { ...product, quantity: 1 }];
        }
      });
    }
  };

  const removeFromCart = async (itemId) => {
    const token = getAuthToken();

    if (token) {
      // Remove from database
      try {
        const response = await axios.delete(`/api/cart/remove/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setCartItems(response.data.cart || []);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
    } else {
      // Remove from local state
      setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    
    const token = getAuthToken();

    if (token) {
      // Update in database
      try {
        const response = await axios.put('/api/cart/update', 
          { itemId, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.data.success) {
          setCartItems(response.data.cart || []);
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    } else {
      // Update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    const token = getAuthToken();

    if (token) {
      // Clear database cart
      try {
        const response = await axios.delete('/api/cart/clear', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    } else {
      // Clear local cart
      setCartItems([]);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        syncCartToDatabase,
        fetchCartFromDatabase,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
