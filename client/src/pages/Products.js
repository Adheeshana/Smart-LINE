import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Products.css';

// Import Tweety design images for all colors
import tweetyBlack from '../assets/images/products/Tweety-black.jpeg';
import tweetyBlue from '../assets/images/products/Tweety-blue.jpeg';
import tweetyLightBlue from '../assets/images/products/Tweety-light blue.jpeg';
import tweetyLightPink from '../assets/images/products/Tweety-light pink.jpeg';
import tweetyLightGreen from '../assets/images/products/Tweety-lightgreen.jpeg';
import tweetyLightPurple from '../assets/images/products/Tweety-lightpurple.jpeg';
import tweetyPink from '../assets/images/products/Tweety-pink.jpeg';
import tweetyRed from '../assets/images/products/Tweety-red.jpeg';
import tweetyWhite from '../assets/images/products/Tweety-white.jpeg';
import tweetyYellow from '../assets/images/products/Tweety-yellow.jpeg';

// Import Daisy Duck design images for all colors
import daisyBlue from '../assets/images/products/Daisy Duck-blue.jpeg';
import daisyLightPurple from '../assets/images/products/Daisy Duck-lightperple.jpeg';
import daisyLightPink from '../assets/images/products/Daisy Duck-lightpink.jpeg';
import daisyPink from '../assets/images/products/Daisy Duck-pink.jpeg';
import daisyRed from '../assets/images/products/Daisy Duck-red.jpeg';
import daisyYellow from '../assets/images/products/Daisy Duck-yellow.jpeg';

// Import Kittens design images for all colors
import kittensLightBlueGreen from '../assets/images/products/kittens-lightblue&green.jpeg';
import kittensLightBlue from '../assets/images/products/kittens-lightblue.jpeg';
import kittensLightGreen from '../assets/images/products/kittens-lightgreen.jpeg';
import kittensLightPurple from '../assets/images/products/kittens-lightperple.jpeg';
import kittensPink from '../assets/images/products/kittens-pink.jpeg';
import kittensRed from '../assets/images/products/kittens-red.jpeg';
import kittensWhiteCream from '../assets/images/products/kittens-whitecream.jpeg';
import kittensYellow from '../assets/images/products/kittens-yellow.jpeg';

// Import Panda design images for all colors
import pandaBlack from '../assets/images/products/panda-black.jpeg';
import pandaBlue from '../assets/images/products/panda-blue.jpeg';
import pandaRed from '../assets/images/products/panda-red.jpeg';
import pandaYellow from '../assets/images/products/panda-yellow.jpeg';

// Import Stitch design images for all colors
import stitchBabyRose from '../assets/images/products/stitch-babyrose.jpeg';
import stitchBlack from '../assets/images/products/stitch-black.jpeg';
import stitchBlue from '../assets/images/products/stitch-blue.jpeg';
import stitchGreen from '../assets/images/products/stitch-green.jpeg';
import stitchLightBlue from '../assets/images/products/stitch-lightblue.jpeg';
import stitchLightGreen from '../assets/images/products/stitch-lightgreen.jpeg';
import stitchLightPurple from '../assets/images/products/stitch-lightperple.jpeg';
import stitchMaroon from '../assets/images/products/stitch-Maroon.jpeg';
import stitchNavyBlue from '../assets/images/products/stitch-navyblue (2).jpeg';
import stitchPink from '../assets/images/products/stitch-pink.jpeg';
import stitchRed from '../assets/images/products/stitch-red.jpeg';
import stitchWhite from '../assets/images/products/stitch-white.jpeg';
import stitchYellow from '../assets/images/products/stitch-yellow.jpeg';

// Import Small Stitch design images for all colors
import smallStitchBabyRoseWhite from '../assets/images/products/small stitch-babyrosewhite.jpeg';
import smallStitchBlack from '../assets/images/products/small stitch-black.jpeg';
import smallStitchBlue from '../assets/images/products/small stitch-blue.jpeg';
import smallStitchDarkBlue from '../assets/images/products/small stitch-darkblue.jpeg';
import smallStitchGreenAndBlue from '../assets/images/products/small stitch-greenandblue.jpeg';
import smallStitchLightBlue from '../assets/images/products/small stitch-lightblue.jpeg';
import smallStitchLightGreen from '../assets/images/products/small stitch-lightgreen.jpeg';
import smallStitchLightPurple from '../assets/images/products/small stitch-lightperple.jpeg';
import smallStitchLightPink from '../assets/images/products/small stitch-lightpink.jpeg';
import smallStitchPink from '../assets/images/products/small stitch-pink.jpeg';
import smallStitchRed from '../assets/images/products/small stitch-red.jpeg';
import smallStitchWhite from '../assets/images/products/small stitch-white.jpeg';
import smallStitchYellow from '../assets/images/products/small stitch-yellow.jpeg';

// Import size chart
import sizeChart from '../assets/images/sizes.png';

// Product catalog with all color variations
const sampleProducts = [
  {
    _id: 'smallstitch-1',
    name: 'Small Stitch T-Shirt',
    category: 'T-Shirts',
    description: 'Cute small Stitch character t-shirt in colorful options',
    price: 1290.00,
    stock: 50,
    design: 'smallstitch',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      {
        name: 'Baby Rose White',
        value: 'babyrosewhite',
        hex: '#FFE4E1',
        image: smallStitchBabyRoseWhite
      },
      {
        name: 'Black',
        value: 'black',
        hex: '#000000',
        image: smallStitchBlack
      },
      {
        name: 'Blue',
        value: 'blue',
        hex: '#0000FF',
        image: smallStitchBlue
      },
      {
        name: 'Dark Blue',
        value: 'darkblue',
        hex: '#00008B',
        image: smallStitchDarkBlue
      },
      {
        name: 'Green & Blue',
        value: 'greenandblue',
        hex: '#87CEEB',
        image: smallStitchGreenAndBlue
      },
      {
        name: 'Light Blue',
        value: 'lightblue',
        hex: '#ADD8E6',
        image: smallStitchLightBlue
      },
      {
        name: 'Light Green',
        value: 'lightgreen',
        hex: '#90EE90',
        image: smallStitchLightGreen
      },
      {
        name: 'Light Purple',
        value: 'lightpurple',
        hex: '#DDA0DD',
        image: smallStitchLightPurple
      },
      {
        name: 'Light Pink',
        value: 'lightpink',
        hex: '#FFB6C1',
        image: smallStitchLightPink
      },
      {
        name: 'Pink',
        value: 'pink',
        hex: '#FFC0CB',
        image: smallStitchPink
      },
      {
        name: 'Red',
        value: 'red',
        hex: '#FF0000',
        image: smallStitchRed
      },
      {
        name: 'White',
        value: 'white',
        hex: '#FFFFFF',
        image: smallStitchWhite
      },
      {
        name: 'Yellow',
        value: 'yellow',
        hex: '#FFD700',
        image: smallStitchYellow
      }
    ],
    defaultColor: 'blue',
    image: smallStitchBlue
  },
  {
    _id: 'tweety-1',
    name: 'Tweety T-Shirt',
    category: 'T-Shirts',
    description: 'Cute Tweety character t-shirt available in multiple colors',
    price: 1290.00,
    stock: 50,
    design: 'tweety',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      {
        name: 'Black',
        value: 'black',
        hex: '#000000',
        image: tweetyBlack
      },
      {
        name: 'Blue',
        value: 'blue',
        hex: '#0000FF',
        image: tweetyBlue
      },
      {
        name: 'Light Blue',
        value: 'lightblue',
        hex: '#87CEEB',
        image: tweetyLightBlue
      },
      {
        name: 'Light Pink',
        value: 'lightpink',
        hex: '#FFB6C1',
        image: tweetyLightPink
      },
      {
        name: 'Light Green',
        value: 'lightgreen',
        hex: '#90EE90',
        image: tweetyLightGreen
      },
      {
        name: 'Light Purple',
        value: 'lightpurple',
        hex: '#DDA0DD',
        image: tweetyLightPurple
      },
      {
        name: 'Pink',
        value: 'pink',
        hex: '#FFC0CB',
        image: tweetyPink
      },
      {
        name: 'Red',
        value: 'red',
        hex: '#FF0000',
        image: tweetyRed
      },
      {
        name: 'White',
        value: 'white',
        hex: '#FFFFFF',
        image: tweetyWhite
      },
      {
        name: 'Yellow',
        value: 'yellow',
        hex: '#FFD700',
        image: tweetyYellow
      }
    ],
    defaultColor: 'black',
    image: tweetyBlack
  },
  {
    _id: 'daisy-1',
    name: 'Daisy Duck T-Shirt',
    category: 'T-Shirts',
    description: 'Adorable Daisy Duck character t-shirt in vibrant colors',
    price: 1290.00,
    stock: 50,
    design: 'daisy',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      {
        name: 'Blue',
        value: 'blue',
        hex: '#0000FF',
        image: daisyBlue
      },
      {
        name: 'Light Purple',
        value: 'lightpurple',
        hex: '#DDA0DD',
        image: daisyLightPurple
      },
      {
        name: 'Light Pink',
        value: 'lightpink',
        hex: '#FFB6C1',
        image: daisyLightPink
      },
      {
        name: 'Pink',
        value: 'pink',
        hex: '#FFC0CB',
        image: daisyPink
      },
      {
        name: 'Red',
        value: 'red',
        hex: '#FF0000',
        image: daisyRed
      },
      {
        name: 'Yellow',
        value: 'yellow',
        hex: '#FFD700',
        image: daisyYellow
      }
    ],
    defaultColor: 'blue',
    image: daisyBlue
  },
  {
    _id: 'kittens-1',
    name: 'Kittens T-Shirt',
    category: 'T-Shirts',
    description: 'Cute kittens character t-shirt in lovely colors',
    price: 1290.00,
    stock: 50,
    design: 'kittens',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      {
        name: 'Light Blue & Green',
        value: 'lightbluegreen',
        hex: '#87CEEB',
        image: kittensLightBlueGreen
      },
      {
        name: 'Light Blue',
        value: 'lightblue',
        hex: '#ADD8E6',
        image: kittensLightBlue
      },
      {
        name: 'Light Green',
        value: 'lightgreen',
        hex: '#90EE90',
        image: kittensLightGreen
      },
      {
        name: 'Light Purple',
        value: 'lightpurple',
        hex: '#DDA0DD',
        image: kittensLightPurple
      },
      {
        name: 'Pink',
        value: 'pink',
        hex: '#FFC0CB',
        image: kittensPink
      },
      {
        name: 'Red',
        value: 'red',
        hex: '#FF0000',
        image: kittensRed
      },
      {
        name: 'White Cream',
        value: 'whitecream',
        hex: '#FFFDD0',
        image: kittensWhiteCream
      },
      {
        name: 'Yellow',
        value: 'yellow',
        hex: '#FFD700',
        image: kittensYellow
      }
    ],
    defaultColor: 'lightbluegreen',
    image: kittensLightBlueGreen
  },
  {
    _id: 'panda-1',
    name: 'Panda T-Shirt',
    category: 'T-Shirts',
    description: 'Adorable panda character t-shirt in classic colors',
    price: 1290.00,
    stock: 50,
    design: 'panda',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      {
        name: 'Black',
        value: 'black',
        hex: '#000000',
        image: pandaBlack
      },
      {
        name: 'Blue',
        value: 'blue',
        hex: '#0000FF',
        image: pandaBlue
      },
      {
        name: 'Red',
        value: 'red',
        hex: '#FF0000',
        image: pandaRed
      },
      {
        name: 'Yellow',
        value: 'yellow',
        hex: '#FFD700',
        image: pandaYellow
      }
    ],
    defaultColor: 'black',
    image: pandaBlack
  },
  {
    _id: 'stitch-1',
    name: 'Stitch T-Shirt',
    category: 'T-Shirts',
    description: 'Adorable Stitch character t-shirt in vibrant color options',
    price: 1290.00,
    stock: 50,
    design: 'stitch',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [
      {
        name: 'Baby Rose',
        value: 'babyrose',
        hex: '#FFB6C1',
        image: stitchBabyRose
      },
      {
        name: 'Black',
        value: 'black',
        hex: '#000000',
        image: stitchBlack
      },
      {
        name: 'Blue',
        value: 'blue',
        hex: '#0000FF',
        image: stitchBlue
      },
      {
        name: 'Green',
        value: 'green',
        hex: '#008000',
        image: stitchGreen
      },
      {
        name: 'Light Blue',
        value: 'lightblue',
        hex: '#ADD8E6',
        image: stitchLightBlue
      },
      {
        name: 'Light Green',
        value: 'lightgreen',
        hex: '#90EE90',
        image: stitchLightGreen
      },
      {
        name: 'Light Purple',
        value: 'lightpurple',
        hex: '#DDA0DD',
        image: stitchLightPurple
      },
      {
        name: 'Maroon',
        value: 'maroon',
        hex: '#800000',
        image: stitchMaroon
      },
      {
        name: 'Navy Blue',
        value: 'navyblue',
        hex: '#000080',
        image: stitchNavyBlue
      },
      {
        name: 'Pink',
        value: 'pink',
        hex: '#FFC0CB',
        image: stitchPink
      },
      {
        name: 'Red',
        value: 'red',
        hex: '#FF0000',
        image: stitchRed
      },
      {
        name: 'White',
        value: 'white',
        hex: '#FFFFFF',
        image: stitchWhite
      },
      {
        name: 'Yellow',
        value: 'yellow',
        hex: '#FFD700',
        image: stitchYellow
      }
    ],
    defaultColor: 'blue',
    image: stitchBlue
  }
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState({}); // Store selected size for each product
  const [selectedProductColors, setSelectedProductColors] = useState({}); // Store selected color for each product
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // Initialize default colors for products with color options
    const initialColors = {};
    sampleProducts.forEach(product => {
      if (product.colors && product.colors.length > 0) {
        initialColors[product._id] = product.defaultColor || product.colors[0].value;
      }
    });
    setSelectedProductColors(initialColors);
    // eslint-disable-next-line
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      console.log('API Response:', response.data);
      if (response.data && response.data.length > 0) {
        // Merge database products with local images
        const mergedProducts = response.data.map(dbProduct => {
          // Find matching sample product by design name
          const sampleProduct = sampleProducts.find(
            sp => sp.design === dbProduct.design || 
                  sp.name.toLowerCase() === dbProduct.name.toLowerCase()
          );
          
          if (sampleProduct) {
            // Merge colors: add local images to database colors
            const mergedColors = dbProduct.colors.map(dbColor => {
              const sampleColor = sampleProduct.colors?.find(
                sc => sc.value === dbColor.value || sc.name === dbColor.name
              );
              return {
                ...dbColor,
                image: sampleColor?.image || null,
                imageUrl: dbColor.imageUrl || null
              };
            });
            
            return {
              ...dbProduct,
              colors: mergedColors,
              image: sampleProduct.image || dbProduct.image
            };
          }
          
          return dbProduct;
        });
        
        setProducts(mergedProducts);
      } else {
        // If API returns empty, use sample products
        console.log('API returned empty, using sample products');
        setProducts(sampleProducts);
      }
      setLoading(false);
    } catch (err) {
      // If API fails, use sample products
      console.log('Using sample products - API error:', err.message);
      setProducts(sampleProducts);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  // Get current product image based on selected color
  const getProductImage = (product) => {
    if (product.colors && product.colors.length > 0) {
      const selectedColor = selectedProductColors[product._id];
      const colorOption = product.colors.find(c => c.value === selectedColor);
      
      // If color has imageUrl from backend, use that
      if (colorOption && colorOption.imageUrl) {
        return `http://localhost:5000${colorOption.imageUrl}`;
      }
      
      // Otherwise, try to use local imported image
      if (colorOption && colorOption.image) {
        return colorOption.image;
      }
      
      // Fallback to first color's image
      if (product.colors[0].imageUrl) {
        return `http://localhost:5000${product.colors[0].imageUrl}`;
      }
      if (product.colors[0].image) {
        return product.colors[0].image;
      }
    }
    
    // Fallback to product's main image
    if (product.image) {
      // If it's a full URL, use it directly
      if (product.image.startsWith('http')) {
        return product.image;
      }
      // If it's a path, prepend the backend URL
      if (product.image.startsWith('/')) {
        return `http://localhost:5000${product.image}`;
      }
    }
    
    return 'https://via.placeholder.com/300';
  };

  // Handle color selection for a product
  const handleColorSelect = (productId, colorValue) => {
    setSelectedProductColors(prev => ({
      ...prev,
      [productId]: colorValue
    }));
  };

  console.log('Products:', products);

  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleAddToCart = (product) => {
    const selectedSize = selectedSizes[product._id];
    const selectedColorValue = selectedProductColors[product._id];
    
    // Validate size selection
    if (!selectedSize) {
      alert('⚠️ Please select a size before adding to cart');
      return;
    }

    // Validate color selection
    if (!selectedColorValue) {
      alert('⚠️ Please select a color before adding to cart');
      return;
    }

    // Get the selected color object for complete information
    let selectedColorObject = null;
    if (product.colors && product.colors.length > 0) {
      selectedColorObject = product.colors.find(c => c.value === selectedColorValue);
    }

    if (!selectedColorObject) {
      alert('⚠️ Please select a valid color before adding to cart');
      return;
    }

    // Add product with selected size and color
    const productWithOptions = {
      ...product,
      size: selectedSize,
      selectedSize: selectedSize,
      selectedColor: selectedColorObject,
      image: getProductImage(product),
      originalProductId: product._id, // Store original product ID for stock management
      _id: `${product._id}-${selectedColorValue}-${selectedSize}` // Unique ID for each variant
    };
    
    addToCart(productWithOptions);
    
    // Show success notification
    const colorInfo = `Color: ${selectedColorObject.name}, Size: ${selectedSize}`;
    const confirmGo = window.confirm(`✅ ${product.name} (${colorInfo}) added to cart!\n\nGo to cart now?`);
    if (confirmGo) {
      navigate('/cart');
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Our Products</h1>
        
        {/* Size Chart Button - Centered */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button 
            className="size-chart-button" 
            onClick={() => setShowSizeChart(true)}
            title="View Size Chart"
          >
            📏 Size Guide
          </button>
        </div>

        {/* Size Chart Modal */}
        {showSizeChart && (
          <div className="size-chart-modal" onClick={() => setShowSizeChart(false)}>
            <div className="size-chart-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowSizeChart(false)}>×</button>
              <img src={sizeChart} alt="Size Chart" />
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products available.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img 
                    src={getProductImage(product) || 'https://via.placeholder.com/300'} 
                    alt={product.name} 
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-description">{product.description}</p>
                  
                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="color-selection-dots">
                      <label>Select Color:</label>
                      <div className="color-dots">
                        {product.colors.map((color) => (
                          <button
                            key={color.value}
                            className={`color-dot ${selectedProductColors[product._id] === color.value ? 'selected' : ''}`}
                            style={{ 
                              backgroundColor: color.hex,
                              border: color.value === 'white' ? '2px solid #ddd' : '2px solid transparent'
                            }}
                            onClick={() => handleColorSelect(product._id, color.value)}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="size-selection">
                      <label>Select Size:</label>
                      <div className="size-options">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            className={`size-button ${selectedSizes[product._id] === size ? 'selected' : ''}`}
                            onClick={() => handleSizeSelect(product._id, size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="product-footer">
                    <span className="product-price">Rs.{product.price}</span>
                    <span className={`product-stock ${
                      product.stock === 0 ? 'out-of-stock' : 
                      product.stock <= 5 ? 'low-stock' : 
                      'in-stock'
                    }`}>
                      {product.stock === 0 ? 'Out of Stock' : 
                       product.stock <= 5 ? `Only ${product.stock} Left!` : 
                       `In Stock (${product.stock})`}
                    </span>
                  </div>
                  <button 
                    className="btn btn-primary" 
                    disabled={product.stock === 0}
                    onClick={() => handleAddToCart(product)}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
