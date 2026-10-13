import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  toggleCartDrawer,
  removeFromCart,
  updateQuantity,
} from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, requireAuth } = useAuth();
  const { items, isCartOpen } = useSelector((state) => state.cart);

  if (!isCartOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleProceedToCheckout = () => {
    dispatch(toggleCartDrawer());
    if (!currentUser) {
      requireAuth({ type: 'CHECKOUT' });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-overlay" onClick={() => dispatch(toggleCartDrawer())}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>BelgaumBazaar Cart ({items.length})</h3>
          <button
            className="close-btn"
            onClick={() => dispatch(toggleCartDrawer())}
          >
            ✖
          </button>
        </div>

        {/* Display connected logged-in user profile snippet */}
        {currentUser && (
          <div style={{ padding: '0.75rem 1.25rem', background: '#e0f2fe', color: '#0369a1', fontSize: '0.85rem', fontWeight: '600' }}>
            👤 Shopping as: {currentUser.name} ({currentUser.email})
          </div>
        )}

        <div className="cart-body">
          {items.length === 0 ? (
            <p className="empty-msg">Your cart is empty. Explore local products!</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="cart-details">
                  <h4>{item.name}</h4>
                  <p className="cart-price">₹{item.price}</p>
                  <div className="qty-controls">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({ id: item.id, quantity: item.quantity - 1 })
                        )
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({ id: item.id, quantity: item.quantity + 1 })
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="subtotal-row">
              <span>Subtotal:</span>
              <strong>₹{subtotal}</strong>
            </div>
            <button className="checkout-btn" onClick={handleProceedToCheckout}>
              Proceed to Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;