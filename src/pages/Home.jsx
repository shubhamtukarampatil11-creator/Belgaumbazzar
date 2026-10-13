import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { belgaumProducts } from '../data/belgaumProducts';
import { useArea } from '../context/AreaContext';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedArea } = useArea();
  const { currentUser, requireAuth } = useAuth();

  const popularProducts = belgaumProducts.filter((p) => p.isPopular);

  const handleAddToCart = (product) => {
    // Check if user is logged in first
    if (!currentUser) {
      const authorized = requireAuth({ type: 'ADD_TO_CART', payload: product });
      if (!authorized) return;
    }
    dispatch(addToCart(product));
  };

  return (
    <div className="home-container">
      <section className="hero-banner">
        <div className="hero-content">
          <span className="location-pill">📍 Serving {selectedArea}, Belagavi</span>
          <h1>Belagavi's Premium Local Marketplace</h1>
          <p>
            Get authentic Camp Kunda, Shahapur Silk Sarees, and daily essential electronics delivered straight to your home.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn-primary">Explore All Products</Link>
            <Link to="/services" className="btn-secondary">View Local Services</Link>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h2>Popular in Belagavi Right Now</h2>
        <div className="products-grid">
          {popularProducts.map((p) => (
            <div key={p.id} className="product-card">
              <img src={p.image} alt={p.name} />
              <div className="card-body">
                <h4>{p.name}</h4>
                <p className="seller">{p.seller}</p>
                <p className="price">₹{p.price}</p>
                <div className="card-actions">
                  <Link to={`/product/${p.id}`} className="details-btn">Details</Link>
                  <button
                    className="add-btn"
                    onClick={() => handleAddToCart(p)}
                  >
                    Add +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;