import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer'; // 👈 1. Import Footer

// Main Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Services, { ExpressDelivery, BulkOrders, LocalSellers } from './pages/Services';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';

const App = () => {
  return (
    <BrowserRouter>
      <AuthModal />
      <Navbar />
      <CartDrawer />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/services" element={<Services />}>
            <Route index element={<Navigate to="express-delivery" replace />} />
            <Route path="express-delivery" element={<ExpressDelivery />} />
            <Route path="bulk-orders" element={<BulkOrders />} />
            <Route path="local-sellers" element={<LocalSellers />} />
          </Route>

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* 👈 2. Add Footer at the bottom */}
      <Footer />
    </BrowserRouter>
  );
};

export default App;