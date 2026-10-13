import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Orders.css';

const Orders = () => {
  const { currentUser, getUserOrders, cancelUserOrder } = useAuth();
  const navigate = useNavigate();
  const [refreshToggle, setRefreshToggle] = useState(false);

  if (!currentUser) {
    return (
      <div className="orders-container">
        <div className="empty-orders">
          <h3>Please Log In</h3>
          <p>Log in to view your BelgaumBazaar order history.</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  const orders = getUserOrders();

  const handleCancel = (orderId) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel order ${orderId}?`
    );
    if (confirmCancel) {
      cancelUserOrder(orderId);
      setRefreshToggle((prev) => !prev); // Force component re-render
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h2>My Orders</h2>
        <div className="empty-orders">
          <h3>No Orders Found</h3>
          <p>You haven't placed any orders on BelgaumBazaar yet.</p>
          <button onClick={() => navigate('/products')}>Explore Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>My Orders ({orders.length})</h2>

      <div className="orders-list">
        {orders.map((order) => {
          const isCancelled = order.status === 'Cancelled';

          return (
            <div
              key={order.orderId}
              className={`order-card ${isCancelled ? 'order-card-cancelled' : ''}`}
            >
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order ID: {order.orderId}</span>
                  <span className="order-date"> • Placed on {order.placedAt}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span
                    className={`order-status-badge ${
                      isCancelled ? 'status-cancelled' : 'status-confirmed'
                    }`}
                  >
                    {isCancelled ? '❌ Cancelled' : '✅ Order Confirmed'}
                  </span>
                  {!isCancelled && (
                    <span className="delivery-time-badge">
                      🚀 {order.estimatedDelivery}
                    </span>
                  )}
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-items-list">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item-row">
                      <img src={item.image} alt={item.name} className="order-item-img" />
                      <div className="order-item-details">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-qty">Qty: {item.quantity}</div>
                      </div>
                      <div className="order-item-price">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-card-footer">
                  <div className="order-address">
                    <strong>Delivery Address:</strong>
                    <br />
                    {order.deliveryAddress}
                  </div>

                  <div className="order-summary-meta">
                    <div>Payment Mode: <strong>{order.paymentMethod}</strong></div>
                    <div className="order-total-price">Total: ₹{order.totalAmount}</div>

                    {!isCancelled && (
                      <button
                        className="cancel-order-btn"
                        onClick={() => handleCancel(order.orderId)}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;