import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bb-footer">
      <div className="footer-container">
        {/* Column 1: About */}
        <div className="footer-col">
          <h4>ABOUT</h4>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/services">Local Services</Link></li>
            <li><Link to="/products">Catalog</Link></li>
          </ul>
        </div>

        {/* Column 2: Help */}
        <div className="footer-col">
          <h4>HELP</h4>
          <ul>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/profile">My Account</Link></li>
            <li><Link to="/contact">Support & FAQs</Link></li>
          </ul>
        </div>

        {/* Column 3: Consumer Policy */}
        <div className="footer-col">
          <h4>POLICY</h4>
          <ul>
            <li><a href="#terms">Terms Of Use</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#returns">Cancellation & Returns</a></li>
          </ul>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Column 4: Contact & Address Details */}
        <div className="footer-col address-col">
          <h4>LOCATION & CONTACT</h4>
          <p className="address-text">
            <strong>BelgaumBazaar Local Office:</strong><br />
            College Road, Camp & Sadashiv Nagar,<br />
            Belagavi, Karnataka - 590001, India
          </p>
          <p className="contact-text">
            <strong>Mobile / Telephone:</strong> +91 98765 43210<br />
            <strong>Email:</strong> support@belgaumbazaar.com
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} BelgaumBazaar — Belagavi's Premium Local Marketplace</p>
      </div>
    </footer>
  );
};

export default Footer;