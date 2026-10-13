import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { belgaumAreas } from '../data/belgaumProducts';
import './Profile.css';

const Profile = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    houseStreet: '',
    area: belgaumAreas[0],
    city: 'Belagavi',
    state: 'Karnataka',
    pincode: '',
    landmark: '',
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        houseStreet: currentUser.address?.houseStreet || '',
        area: currentUser.address?.area || belgaumAreas[0],
        city: currentUser.address?.city || 'Belagavi',
        state: currentUser.address?.state || 'Karnataka',
        pincode: currentUser.address?.pincode || '',
        landmark: currentUser.address?.landmark || '',
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="profile-restricted">
        <h2>Access Restricted</h2>
        <p>Please log in to view and manage your account details.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      errs.phone = 'Valid 10-digit phone number is required';
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = 'Indian PIN code must be exactly 6 digits';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();

    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

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

    setIsEditing(false);
    setSuccessMsg('Profile and address updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <h2>My Profile & Address Book</h2>
            <p className="user-email">{currentUser.email}</p>
          </div>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {successMsg && <div className="success-banner">{successMsg}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <section className="profile-section">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h3>Default Delivery Address</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>House / Flat No. & Street Address</label>
                <input
                  type="text"
                  name="houseStreet"
                  placeholder="e.g. Flat 302, Sai Residency, College Road"
                  value={formData.houseStreet}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Area / Locality</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  {belgaumAreas.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="e.g. Near KLE Hospital"
                  value={formData.landmark}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={formData.city} disabled />
              </div>

              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={formData.state} disabled />
              </div>

              <div className="form-group">
                <label>PIN Code (6 digits)</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="590001"
                  value={formData.pincode}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {errors.pincode && <span className="error">{errors.pincode}</span>}
              </div>
            </div>
          </section>

          {isEditing && (
            <div className="form-actions">
              <button type="submit" className="save-btn">Save Changes</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;