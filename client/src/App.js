import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import { CartProvider } from './context/CartContext';

// Configure axios with backend URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes with Navbar */}
            <Route path="/" element={<><Navbar /><Home /></>} />
            <Route path="/products" element={<><Navbar /><Products /></>} />
            <Route path="/cart" element={<><Navbar /><Cart /></>} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            <Route path="/register" element={<><Navbar /><Register /></>} />
            
            {/* Admin Routes without Navbar */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
