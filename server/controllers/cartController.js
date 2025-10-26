const Cart = require('../models/Cart');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID comes from auth middleware
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    
    res.status(200).json({
      success: true,
      cart: cart.items
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, name, design, price, selectedColor, size, selectedSize, quantity, image, originalProductId } = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
    
    // Check if item already exists in cart (same product, color, and size)
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && 
              JSON.stringify(item.selectedColor) === JSON.stringify(selectedColor) &&
              (item.size === size || item.selectedSize === selectedSize)
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity || 1;
    } else {
      // Add new item
      cart.items.push({
        productId,
        name,
        design,
        price,
        selectedColor,
        size: size || selectedSize,
        selectedSize: selectedSize || size,
        quantity: quantity || 1,
        image,
        originalProductId
      });
    }
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: cart.items
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const item = cart.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    item.quantity = quantity;
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart: cart.items
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: cart.items
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.items = [];
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: cart.items
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};

// Sync local cart with database (for login)
exports.syncCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { localCartItems } = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = await Cart.create({ userId, items: localCartItems || [] });
    } else if (localCartItems && localCartItems.length > 0) {
      // Merge local cart items with database cart
      localCartItems.forEach(localItem => {
        const existingItemIndex = cart.items.findIndex(
          item => item.productId.toString() === localItem.productId && 
                  JSON.stringify(item.selectedColor) === JSON.stringify(localItem.selectedColor) &&
                  (item.size === localItem.size || item.selectedSize === localItem.selectedSize)
        );
        
        if (existingItemIndex > -1) {
          // Update quantity if item exists
          cart.items[existingItemIndex].quantity += localItem.quantity;
        } else {
          // Add new item
          cart.items.push(localItem);
        }
      });
      
      await cart.save();
    }
    
    res.status(200).json({
      success: true,
      cart: cart.items
    });
  } catch (error) {
    console.error('Error syncing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing cart',
      error: error.message
    });
  }
};
