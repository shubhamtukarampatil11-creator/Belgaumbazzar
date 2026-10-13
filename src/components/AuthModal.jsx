import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal = () => {
  const {
    currentUser,
    isAuthLoading,
    isAuthModalOpen,
    setIsAuthModalOpen,
    closeAuthModal,
    loginUser,
    registerUser,
    pendingAction,
    setPendingAction,
  } = useAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  // Auto-trigger popup on page refresh ONLY if the user is not logged in
  useEffect(() => {
    if (!isAuthLoading && !currentUser) {
      setIsAuthModalOpen(true);
    }
  }, [isAuthLoading, currentUser, setIsAuthModalOpen]);

  if (!isAuthModalOpen || currentUser) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMsg('');
  };

  const handleSuccessAuth = () => {
    closeAuthModal();

    if (pendingAction) {
      if (pendingAction.type === 'ADD_TO_CART') {
        dispatch(addToCart(pendingAction.payload));
      } else if (pendingAction.type === 'CHECKOUT') {
        navigate('/checkout');
      }
      setPendingAction(null);
    } else {
      navigate('/profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (activeTab === 'login') {
        if (!formData.email || !formData.password) {
          setErrorMsg('Please enter both email and password.');
          return;
        }
        await loginUser({ email: formData.email, password: formData.password });
      } else {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
          setErrorMsg('All mandatory fields are required.');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg('Passwords do not match.');
          return;
        }
        await registerUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
      }

      handleSuccessAuth();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={closeAuthModal} aria-label="Close modal">
          ✖
        </button>

        <div className="auth-modal-header">
          <h2>Welcome to BelgaumBazaar</h2>
          <p>Login or create an account for fast local delivery</p>
        </div>

        <div className="auth-modal-tabs">
          <button
            type="button"
            className={activeTab === 'login' ? 'active' : ''}
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={activeTab === 'register' ? 'active' : ''}
            onClick={() => {
              setActiveTab('register');
              setErrorMsg('');
            }}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <p className="error-banner" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.6rem 0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="auth-modal-form">
          {activeTab === 'register' && (
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {activeTab === 'register' && (
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                name="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {activeTab === 'register' && (
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          <button type="submit" className="submit-btn">
            {activeTab === 'login' ? 'Login' : 'Register Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;