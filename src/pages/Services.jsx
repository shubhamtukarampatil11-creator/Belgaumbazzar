import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Services.css';

const Services = () => {
  return (
    <div className="services-container">
      <header className="services-header">
        <h1>BelgaumBazaar Local Services</h1>
        <p>Commerce services for Belagavi residents and local business owners</p>
      </header>

      <nav className="nested-services-nav">
        <NavLink to="express-delivery" className={({ isActive }) => isActive ? 'nested-active' : ''}>
          🚀 Same-Day Express
        </NavLink>
        <NavLink to="bulk-orders" className={({ isActive }) => isActive ? 'nested-active' : ''}>
          📦 Bulk Festival Orders
        </NavLink>
        <NavLink to="local-sellers" className={({ isActive }) => isActive ? 'nested-active' : ''}>
          🏪 Register as Belagavi Seller
        </NavLink>
      </nav>

      <div className="nested-content-card">
        {/* Child nested routes render here */}
        <Outlet />
      </div>
    </div>
  );
};

export default Services;

// Child Components for Nested Routes
export const ExpressDelivery = () => (
  <div className="service-detail-box">
    <h3>Same-Day Express Delivery in Belagavi</h3>
    <p>Get your favorite Kunda, sweets, and urgent electronics delivered within 2-4 hours across Tilakwadi, Camp, Shahapur, and Vadgaon.</p>
  </div>
);

export const BulkOrders = () => (
  <div className="service-detail-box">
    <h3>Bulk & Festival Gift Orders</h3>
    <p>Ordering sweets or handloom sarees in bulk for weddings or Diwali? We offer wholesale rates directly from authentic sellers.</p>
  </div>
);

export const LocalSellers = () => (
  <div className="service-detail-box">
    <h3>Belagavi Merchant Partner Program</h3>
    <p>Own a shop in Shahapur, Maruti Galli, or Camp? List your products on BelgaumBazaar and reach thousands of local customers.</p>
  </div>
);