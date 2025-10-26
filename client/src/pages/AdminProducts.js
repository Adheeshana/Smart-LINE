import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminProducts.css';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'T-Shirts',
    description: '',
    price: 1290.00,
    stock: 10,
    design: '',
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    colors: [],
    defaultColor: '',
    imageFolder: ''
  });

  const [colorInput, setColorInput] = useState({
    name: '',
    value: '',
    hex: '#000000',
    imageFile: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorInputChange = (e) => {
    const { name, value } = e.target;
    setColorInput(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        e.target.value = '';
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }
      setColorInput(prev => ({
        ...prev,
        imageFile: file
      }));
    }
  };

  const addColor = async () => {
    if (colorInput.name && colorInput.value && colorInput.hex) {
      let imageUrl = '';
      
      // Upload image if file is selected
      if (colorInput.imageFile) {
        const formData = new FormData();
        formData.append('image', colorInput.imageFile);
        
        try {
          const response = await axios.post('/api/products/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          imageUrl = response.data.imageUrl;
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image. Please try again.');
          return;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, { 
          name: colorInput.name,
          value: colorInput.value,
          hex: colorInput.hex,
          imageUrl: imageUrl
        }]
      }));
      setColorInput({ name: '', value: '', hex: '#000000', imageFile: null });
      
      // Reset file input
      const fileInput = document.getElementById('colorImageInput');
      if (fileInput) fileInput.value = '';
    } else {
      alert('Please fill all color fields');
    }
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const openAddModal = () => {
    setEditMode(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      category: 'T-Shirts',
      description: '',
      price: 1290.00,
      stock: 10,
      design: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      colors: [],
      defaultColor: '',
      imageFolder: ''
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      design: product.design || '',
      sizes: product.sizes || ['XS', 'S', 'M', 'L', 'XL', '2XL'],
      colors: product.colors || [],
      defaultColor: product.defaultColor || '',
      imageFolder: product.imageFolder || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.colors.length === 0) {
      alert('Please add at least one color');
      return;
    }

    if (!formData.defaultColor) {
      alert('Please set a default color');
      return;
    }

    try {
      if (editMode) {
        await axios.put(`/api/products/${currentProduct._id}`, formData);
        alert('Product updated successfully!');
      } else {
        await axios.post('/api/products', formData);
        alert('Product added successfully!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        alert('Product deleted successfully!');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="admin-products-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
              ← Back to Dashboard
            </button>
            <h1>Product Management</h1>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            + Add New Product
          </button>
        </div>

        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Design Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Colors</th>
                <th>Sizes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="product-name">{product.name}</td>
                  <td>{product.category}</td>
                  <td>Rs.{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="color-preview">
                      {product.colors && product.colors.slice(0, 5).map((color, idx) => (
                        <span
                          key={idx}
                          className="color-dot-preview"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        ></span>
                      ))}
                      {product.colors && product.colors.length > 5 && (
                        <span className="color-more">+{product.colors.length - 5}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="sizes-preview">
                      {product.sizes && product.sizes.join(', ')}
                    </div>
                  </td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => openEditModal(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Product Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>

              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label>Design Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Tweety T-Shirt"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Sweatshirts">Sweatshirts</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Design Code *</label>
                    <input
                      type="text"
                      name="design"
                      value={formData.design}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., tweety"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Product description"
                  ></textarea>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (Rs.) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image Folder Name</label>
                  <input
                    type="text"
                    name="imageFolder"
                    value={formData.imageFolder}
                    onChange={handleInputChange}
                    placeholder="e.g., Tweety or small stitch"
                  />
                  <small>Folder name in assets/images/products/</small>
                </div>

                {/* Sizes Selection */}
                <div className="form-group">
                  <label>Available Sizes *</label>
                  <div className="size-checkboxes">
                    {allSizes.map(size => (
                      <label key={size} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.sizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                        />
                        <span>{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Colors Management */}
                <div className="form-group">
                  <label>Colors *</label>
                  <div className="color-input-group">
                    <input
                      type="text"
                      name="name"
                      value={colorInput.name}
                      onChange={handleColorInputChange}
                      placeholder="Color Name (e.g., Light Blue)"
                    />
                    <input
                      type="text"
                      name="value"
                      value={colorInput.value}
                      onChange={handleColorInputChange}
                      placeholder="Color Value (e.g., lightblue)"
                    />
                    <input
                      type="color"
                      name="hex"
                      value={colorInput.hex}
                      onChange={handleColorInputChange}
                      title="Pick color"
                    />
                    <input
                      type="file"
                      id="colorImageInput"
                      accept="image/*"
                      onChange={handleColorImageChange}
                      title="Upload color image"
                      className="file-input"
                    />
                    <button type="button" className="btn-add-color" onClick={addColor}>
                      + Add
                    </button>
                  </div>
                  <small className="file-hint">Upload an image for this color variant (max 5MB)</small>

                  {/* Display Added Colors */}
                  <div className="added-colors">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="color-item">
                        {color.imageUrl && (
                          <img 
                            src={`http://localhost:5000${color.imageUrl}`} 
                            alt={color.name} 
                            className="color-image-preview"
                          />
                        )}
                        <span
                          className="color-preview-box"
                          style={{ backgroundColor: color.hex }}
                        ></span>
                        <span className="color-name">{color.name}</span>
                        <span className="color-value">({color.value})</span>
                        <button
                          type="button"
                          className="btn-remove"
                          onClick={() => removeColor(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Default Color Selection */}
                {formData.colors.length > 0 && (
                  <div className="form-group">
                    <label>Default Color *</label>
                    <select
                      name="defaultColor"
                      value={formData.defaultColor}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select default color</option>
                      {formData.colors.map((color, index) => (
                        <option key={index} value={color.value}>
                          {color.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Product' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
