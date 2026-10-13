import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setAuthError('');
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validate();

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    try {
      // 1. Authenticate user using AuthContext
      await loginUser({
        email: formData.email,
        password: formData.password,
      });

      // 2. Redirect directly to User Profile Page after successful login
      navigate('/profile');
    } catch (err) {
      setAuthError(err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your BelgaumBazaar account</p>
        </div>

        {authError && (
          <div className="error-banner" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder=" name@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <button type="submit" className="submit-btn">Login</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;