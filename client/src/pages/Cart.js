import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      alert('Please login to access your cart');
      navigate('/login');
    }
    
    // Debug: Log cart items to see their structure
    console.log('Cart Items:', cartItems);
  }, [navigate, cartItems]);

  const handleInputChange = (e) => {
    setCheckoutForm({
      ...checkoutForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const calculateTotal = () => {
    return getCartTotal().toFixed(2);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    // Validate all items have size and color
    const invalidItems = cartItems.filter(item => {
      const hasSize = item.size || item.selectedSize;
      const hasColor = item.selectedColor && (item.selectedColor.name || item.selectedColor.value);
      return !hasSize || !hasColor;
    });

    if (invalidItems.length > 0) {
      alert('⚠️ Some items in your cart are missing size or color information. Please remove them and add again from products page.');
      return;
    }

    // Get user info from localStorage
    const userToken = localStorage.getItem('userToken');
    let userId = null;
    let userName = null;
    
    if (userToken) {
      try {
        const payload = JSON.parse(atob(userToken.split('.')[1]));
        userId = payload.id;
        userName = payload.name || payload.username;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    // Prepare order details for database
    const orderData = {
      userId: userId,
      userName: userName || checkoutForm.fullName,
      customerInfo: checkoutForm,
      items: cartItems.map(item => ({
        productId: item.originalProductId || item.productId || item._id.split('-')[0],
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size || item.selectedSize,
        color: item.selectedColor
      })),
      totalAmount: parseFloat(calculateTotal())
    };

    try {
      // Save order to database
      const response = await axios.post('/api/orders', orderData);
      console.log('Order saved:', response.data);
      
      alert('Order placed successfully! We will contact you soon.');
      
      // Send to WhatsApp
      const whatsappMessage = `
🛍️ *New Order from Smart LINE*

📋 Order Number: ${response.data.order.orderNumber}
👤 Name: ${checkoutForm.fullName}
📞 Phone: ${checkoutForm.phone}
📧 Email: ${checkoutForm.email || 'N/A'}
📍 Address: ${checkoutForm.address}, ${checkoutForm.city}${checkoutForm.postalCode ? ', ' + checkoutForm.postalCode : ''}

🛒 *Order Items:*
${cartItems.map(item => {
  const colorInfo = item.selectedColor ? `Color: ${item.selectedColor.name || item.selectedColor.value}` : '';
  const sizeInfo = item.size || item.selectedSize ? `Size: ${item.size || item.selectedSize}` : '';
  const details = [colorInfo, sizeInfo].filter(d => d).join(', ');
  return `• ${item.name}${details ? ` (${details})` : ''}\n  Qty: ${item.quantity} × Rs.${item.price} = Rs.${(item.price * item.quantity).toFixed(2)}`;
}).join('\n\n')}

💰 *Total Amount: Rs.${calculateTotal()}*
      `.trim();
      
      const whatsappUrl = `https://wa.me/94703282929?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
      
      // Clear cart after successful order
      clearCart();
      
      // Reset form
      setCheckoutForm({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
      });
    } catch (error) {
      console.error('Order Error:', error);
      alert('Error placing order. Please try again or contact us via WhatsApp.');
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        
        <div className="cart-layout">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items to your cart!</p>
                <a href="/products" className="btn btn-primary">Browse Products</a>
              </div>
            ) : (
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      {item.selectedColor && (
                        <p className="cart-item-color">
                          <span className="color-label">Color:</span>
                          <span 
                            className="color-dot" 
                            style={{ backgroundColor: item.selectedColor.hex || item.selectedColor.value }}
                          ></span>
                          <span>{item.selectedColor.name || item.selectedColor.value}</span>
                        </p>
                      )}
                      <p className="cart-item-size">
                        Size: {item.size || item.selectedSize || 'Not specified'}
                      </p>
                      <p className="cart-item-price">Rs.{item.price}</p>
                    </div>
                    <div className="cart-item-quantity">
                      <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-item-total">
                      Rs.{(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button className="remove-btn" onClick={() => handleRemoveItem(item._id)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Form Section */}
          <div className="checkout-section">
            <h2>Checkout Details</h2>
            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={checkoutForm.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={checkoutForm.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+94 70 xxx xxxx"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={checkoutForm.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                  name="address"
                  value={checkoutForm.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Street address, house number, etc."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={checkoutForm.city}
                    onChange={handleInputChange}
                    required
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={checkoutForm.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal code"
                  />
                </div>
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>Rs.{calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>Rs.{calculateTotal()}</span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-checkout">
                Place Order via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
