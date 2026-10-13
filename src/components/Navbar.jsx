import React, { useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCartDrawer, syncUserCart, clearCart } from '../redux/cartSlice';
import { useArea } from '../context/AreaContext';
import { useAuth } from '../context/AuthContext';
import { belgaumAreas } from '../data/belgaumProducts';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, logoutUser } = useAuth();
  const cartItems = useSelector((state) => state.cart.items);
  const { selectedArea, setSelectedArea } = useArea();

  useEffect(() => {
    dispatch(syncUserCart(currentUser?.email || null));
  }, [currentUser, dispatch]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  const handleLogout = () => {
    logoutUser();
    dispatch(clearCart());
    navigate('/');
  };

  return (
    <header className="bb-navbar">
      <div className="bb-nav-top">
        <Link to="/" className="bb-brand">
          <span className="bb-brand-accent">Belgaum</span>Bazaar
        </Link>

        <form onSubmit={handleSearchSubmit} className="bb-search-form">
          <input
            type="text"
            name="search"
            placeholder="Search Kunda, Silk Sarees, Electronics in Belagavi..."
            className="bb-search-input"
          />
          <button type="submit" className="bb-search-btn">Search</button>
        </form>

        <div className="bb-area-selector">
          <label>Deliver to:</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            {belgaumAreas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <button
          className="bb-cart-btn"
          onClick={() => dispatch(toggleCartDrawer())}
        >
          🛒 Cart <span className="bb-cart-badge">{totalCartCount}</span>
        </button>
      </div>

      <nav className="bb-nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>Catalog</NavLink>
        <NavLink to="/services" className={({ isActive }) => isActive ? 'active' : ''}>Local Services</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact & Support</NavLink>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              📦 My Orders
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
              👤 My Account ({currentUser.name ? currentUser.name.split(' ')[0] : 'User'})
            </NavLink>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
            Login / Register
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Navbar;