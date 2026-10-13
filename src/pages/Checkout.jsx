import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../redux/cartSlice';
import { useAuth } from '../context/AuthContext';
import { belgaumAreas } from '../data/belgaumProducts';
import './Checkout.css';

// Random delivery time generator helper
const getRandomDeliveryTime = () => {
  const deliveryOptions = [
    'Arriving within 30 Minutes (Express Delivery)',
    'Arriving within 1 Hour',
    'Arriving within 2 to 4 Hours',
    'Arriving Today by 8:00 PM',
    'Arriving Tomorrow within 1 Day',
  ];
  return deliveryOptions[Math.floor(Math.random() * deliveryOptions.length)];
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, updateUserProfile, saveUserOrder, requireAuth } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    houseStreet: '',
    area: belgaumAreas[0],
    city: 'Belagavi',
    state: 'Karnataka',
    pincode: '',
    landmark: '',
    paymentMethod: 'cod',
    upiId: '',
    saveToProfile: true,
  });

  const [errors, setErrors] = useState({});
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        houseStreet: currentUser.address?.houseStreet || '',
        area: currentUser.address?.area || belgaumAreas[0],
        city: currentUser.address?.city || 'Belagavi',
        state: currentUser.address?.state || 'Karnataka',
        pincode: currentUser.address?.pincode || '',
        landmark: currentUser.address?.landmark || '',
      }));
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="checkout-empty" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h2>Authentication Required</h2>
        <p>Please log in to proceed to checkout.</p>
        <button
          onClick={() => requireAuth({ type: 'CHECKOUT' })}
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Log In to Checkout
        </button>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: val }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateCheckout = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Valid 10-digit phone number is required';
    }
    if (!formData.houseStreet.trim()) errs.houseStreet = 'House/street address is required';
    if (!formData.area) errs.area = 'Locality area is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Indian PIN code must be exactly 6 digits';
    }
    if (formData.paymentMethod === 'upi' && !formData.upiId.trim()) {
      errs.upiId = 'Please enter your UPI ID (e.g., name@upi)';
    }
    return errs;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const valErrors = validateCheckout();

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    if (formData.saveToProfile) {
      updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          houseStreet: formData.houseStreet,
          area: formData.area,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
      });
    }

    const orderDetails = {
      orderId: 'BB-' + Math.floor(100000 + Math.random() * 900000),
      items: [...cartItems],
      totalAmount: subtotal,
      customerName: formData.name,
      deliveryAddress: `${formData.houseStreet}, ${formData.area}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : `Online UPI (${formData.upiId})`,
      estimatedDelivery: getRandomDeliveryTime(),
      placedAt: new Date().toLocaleString(),
    };

    // Save order in AuthContext/localStorage
    saveUserOrder(orderDetails);

    setCompletedOrder(orderDetails);
    dispatch(clearCart());
  };

  if (completedOrder) {
    return (
      <div className="checkout-success" style={{ maxWidth: '600px', margin: '3rem auto', padding: '2.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#166534', marginBottom: '0.5rem' }}> Order Confirmed!</h2>
        <p style={{ color: '#0284c7', fontWeight: '700', fontSize: '1rem', marginBottom: '1rem' }}>
          🚀 Estimated Delivery: {completedOrder.estimatedDelivery}
        </p>

        <div className="order-details-box" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', textAlign: 'left', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p><strong>Order ID:</strong> {completedOrder.orderId}</p>
          <p><strong>Customer:</strong> {completedOrder.customerName}</p>
          <p><strong>Delivering to:</strong> {completedOrder.deliveryAddress}</p>
          <p><strong>Payment Mode:</strong> {completedOrder.paymentMethod}</p>
          <p><strong>Total Amount:</strong> ₹{completedOrder.totalAmount}</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => navigate('/orders')} className="place-order-btn" style={{ flex: 1 }}>
            View My Orders
          </button>
          <button onClick={() => navigate('/')} className="place-order-btn" style={{ flex: 1, backgroundColor: '#334155' }}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
        <h2>Your Cart is Empty</h2>
        <button
          onClick={() => navigate('/products')}
          style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout & Delivery Details</h2>

      <div className="checkout-grid">
        <form onSubmit={handlePlaceOrder} className="checkout-form">
          <h3>1. Customer Details</h3>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <h3>2. Delivery Address (Belagavi)</h3>
          <div className="form-group">
            <label>House / Flat No. & Street *</label>
            <input type="text" name="houseStreet" value={formData.houseStreet} onChange={handleChange} />
            {errors.houseStreet && <span className="error">{errors.houseStreet}</span>}
          </div>

          <div className="form-group">
            <label>Locality / Area *</label>
            <select name="area" value={formData.area} onChange={handleChange}>
              {belgaumAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>PIN Code (6 digits) *</label>
            <input type="text" name="pincode" placeholder="590001" value={formData.pincode} onChange={handleChange} />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
          </div>

          <h3>3. Payment Mode</h3>
          <div className="payment-options" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleChange}
              />
              💵 Cash on Delivery (COD)
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={formData.paymentMethod === 'upi'}
                onChange={handleChange}
              />
              💳 Online Pay (UPI / GPay / PhonePe / Card)
            </label>

            {formData.paymentMethod === 'upi' && (
              <div className="form-group" style={{ marginTop: '0.5rem', paddingLeft: '1.75rem' }}>
                <label>Enter VPA / UPI ID *</label>
                <input
                  type="text"
                  name="upiId"
                  placeholder="e.g. mobile@upi or name@okaxis"
                  value={formData.upiId}
                  onChange={handleChange}
                />
                {errors.upiId && <span className="error">{errors.upiId}</span>}
              </div>
            )}
          </div>

          <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>
            <input
              type="checkbox"
              name="saveToProfile"
              checked={formData.saveToProfile}
              onChange={handleChange}
            />
            Save this address to my profile
          </label>

          <button type="submit" className="place-order-btn">
            Place Demo Order (₹{subtotal})
          </button>
        </form>

        <div className="order-summary-card">
          <h3>Summary ({cartItems.length} items)</h3>
          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <strong>₹{item.price * item.quantity}</strong>
            </div>
          ))}
          <hr style={{ margin: '1rem 0', borderColor: '#f1f5f9' }} />
          <div className="summary-total">
            <span>Total Payable:</span>
            <strong>₹{subtotal}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;