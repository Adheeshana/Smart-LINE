import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('smartline_admin');
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smartline_admin');
    navigate('/login');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
      // Refresh orders
      fetchOrders();
      alert('Order status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating order status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await axios.delete(`/api/orders/${orderId}`);
        fetchOrders();
        setSelectedOrder(null);
        alert('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Error deleting order');
      }
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <h1>
              <span className="brand-smart">Smart</span>
              {' '}
              <span className="brand-l">L</span>
              <span className="brand-ine">INE</span>
              {' '}
              <span className="admin-text">Admin Dashboard</span>
            </h1>
            <div className="header-actions">
              <button onClick={() => navigate('/admin/products')} className="btn btn-products">
                📦 Manage Products
              </button>
              <button onClick={handleLogout} className="btn btn-logout">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{orders.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Orders</h3>
            <p className="stat-number">
              {orders.filter(o => o.status === 'pending' || o.status === 'processing' || o.status === 'delivering').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Delivered</h3>
            <p className="stat-number">
              {orders.filter(o => o.status === 'completed' || o.status === 'delivered').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">
              Rs.{orders.filter(o => o.status === 'completed').reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="filter-section">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="delivering">Delivering</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="orders-section">
          <h2>Orders ({filteredOrders.length})</h2>
          
          {filteredOrders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found.</p>
            </div>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Update Order Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="table-row">
                      <td className="order-number">
                        <span className="order-id">{order.orderNumber}</span>
                      </td>
                      <td className="order-date">
                        {new Date(order.orderDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="customer-name">
                        <strong>{order.customerInfo.fullName}</strong>
                      </td>
                      <td className="customer-phone">{order.customerInfo.phone}</td>
                      <td className="order-address">
                        <div className="address-compact">
                          {order.customerInfo.address}, {order.customerInfo.city}
                          {order.customerInfo.postalCode && `, ${order.customerInfo.postalCode}`}
                        </div>
                      </td>
                      <td className="order-items-details">
                        <div className="items-list">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="item-compact">
                              <span className="item-name">{item.name}</span>
                              {item.color && (
                                <span className="item-attr">
                                  Color: {item.color.name || item.color.value || 'N/A'}
                                </span>
                              )}
                              <span className="item-attr">
                                Size: {item.size || 'Not specified'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="order-total">
                        <strong>Rs.{order.totalAmount.toFixed(2)}</strong>
                      </td>
                      <td className="order-status-update">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`status-dropdown status-${order.status}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="delivering">Delivering</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {selectedOrder.orderNumber}</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            
            <div className="modal-body">
              {/* Customer Info */}
              <div className="detail-section">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> {selectedOrder.customerInfo.fullName}</p>
                <p><strong>Phone:</strong> {selectedOrder.customerInfo.phone}</p>
                <p><strong>Email:</strong> {selectedOrder.customerInfo.email || 'N/A'}</p>
                <p><strong>Address:</strong> {selectedOrder.customerInfo.address}</p>
                <p><strong>City:</strong> {selectedOrder.customerInfo.city}</p>
                <p><strong>Postal Code:</strong> {selectedOrder.customerInfo.postalCode || 'N/A'}</p>
                {selectedOrder.customerInfo.notes && (
                  <p><strong>Notes:</strong> {selectedOrder.customerInfo.notes}</p>
                )}
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="order-item">
                      {item.image && <img src={item.image} alt={item.name} />}
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        {item.color && (
                          <p className="item-color">
                            <span className="color-label">Color:</span>
                            {item.color.hex && (
                              <span 
                                className="color-dot" 
                                style={{ backgroundColor: item.color.hex || item.color.value }}
                              ></span>
                            )}
                            <span>{item.color.name || item.color.value || 'N/A'}</span>
                          </p>
                        )}
                        {item.size && <p className="item-size">Size: {item.size}</p>}
                        <p className="item-price">Rs.{item.price} × {item.quantity}</p>
                      </div>
                      <p className="item-total">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="order-total-section">
                  <strong>Total: Rs.{selectedOrder.totalAmount.toFixed(2)}</strong>
                </div>
              </div>

              {/* Status Update */}
              <div className="detail-section">
                <h3>Update Order Status</h3>
                <select 
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Actions */}
              <div className="modal-actions">
                {selectedOrder.status !== 'delivered' && (
                  <button 
                    className="btn btn-success btn-complete"
                    onClick={() => handleStatusChange(selectedOrder._id, 'delivered')}
                  >
                    ✅ Mark as Complete/Delivered
                  </button>
                )}
                <button 
                  className="btn btn-danger"
                  onClick={() => handleDeleteOrder(selectedOrder._id)}
                >
                  🗑️ Delete Order
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
