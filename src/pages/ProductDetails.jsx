import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, toggleCartDrawer } from '../redux/cartSlice';
import { belgaumProducts } from '../data/belgaumProducts';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const product = belgaumProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product Not Found</h2>
        <p>The requested Belagavi item does not exist.</p>
        <Link to="/products" className="back-link">← Back to Catalog</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    dispatch(toggleCartDrawer());
  };

  return (
    <div className="product-details-container">
      <div className="details-grid">
        <div className="image-wrapper">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="info-wrapper">
          <span className="category-badge">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="seller-tag">Sold by: <strong>{product.seller}</strong></p>

          <div className="price-box">
            <span className="current-price">₹{product.price}</span>
            <span className="old-price">₹{product.originalPrice}</span>
            <span className="discount-tag">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          </div>

          <p className="delivery-info">⚡ {product.deliveryTime}</p>
          <p className="description">{product.description}</p>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <button className="add-cart-large" onClick={handleAddToCart}>
            Add to BelgaumBazaar Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;