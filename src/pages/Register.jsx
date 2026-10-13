import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { belgaumAreas } from '../data/belgaumProducts';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: belgaumAreas[0],
    password: '',
    confirmPassword: '',
  });

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
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.password || formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
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
      // 1. Register user using AuthContext
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // 2. Redirect directly to User Profile Page
      navigate('/profile');
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join BelgaumBazaar for faster local deliveries</p>
        </div>

        {authError && (
          <div className="error-banner" style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="name@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="text"
              name="phone"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Belagavi Area</label>
            <select name="area" value={formData.area} onChange={handleChange}>
              {belgaumAreas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="submit-btn">Create BelgaumBazaar Account</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;