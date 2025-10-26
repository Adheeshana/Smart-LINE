import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';
import logo from '../assets/images/smartline-logo.png';

const Navbar = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = () => {
      const userToken = localStorage.getItem('userToken');
      setIsLoggedIn(!!userToken);
    };

    checkLoginStatus();
    
    // Listen for storage changes (for logout in other tabs)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [location]); // Re-check when location changes (after login/register)

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Smart LINE Logo" className="logo" />
            <h1>
              <span className="brand-smart">Smart</span>
              {' '}
              <span className="brand-l">L</span>
              <span className="brand-ine">INE</span>
            </h1>
          </Link>
          <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            {isLoggedIn && (
              <li>
                <Link to="/cart" className="cart-link">
                  Cart
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </li>
            )}
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
