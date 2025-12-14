import React from 'react';
import './Home.css';
import Snowfall from '../components/Snowfall';
import qualityImg from '../assets/images/quality.png';
import deliveryImg from '../assets/images/delivery.png';
import paymentImg from '../assets/images/payment.png';
import returnsImg from '../assets/images/return.png';

const Home = () => {
  return (
    <div className="home">
      <Snowfall />
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Smart Line</h1>
            <p className="hero-description">
              Your Premium Online Fashion Destination - Discover the Latest Trends in Clothing
            </p>
            <div className="contact-info">
              <a href="https://wa.me/94703282929" target="_blank" rel="noopener noreferrer" className="phone-number">
                📞 0703282929
              </a>
            </div>
            <div className="hero-buttons">
              <a href="/products" className="btn btn-primary">Shop Now</a>
              <a href="/register" className="btn btn-secondary">Sign Up</a>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2> Smart Line වෙත සාදයෙන් පිලිගන්නවා</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <img src={qualityImg} alt="Premium Quality" />
              </div>
              <h3>Premium Quality</h3>
              <p>High-quality clothing made from the finest materials</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src={deliveryImg} alt="Fast Delivery" />
              </div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to your doorstep</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src={paymentImg} alt="Secure Payment" />
              </div>
              <h3>Secure Payment</h3>
              <p>Safe and secure payment options for your peace of mind</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <img src={returnsImg} alt="Easy Returns" />
              </div>
              <h3>Easy Returns</h3>
              <p>Hassle-free returns and exchange within 30 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
