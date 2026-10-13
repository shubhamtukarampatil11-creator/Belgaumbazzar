import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { useFetchProducts } from '../hooks/useFetchProducts';
import { useAuth } from '../context/AuthContext';
import './ProductList.css';

const categories = ['All', 'Sweets & Snacks', 'Textiles & Handlooms', 'Electronics', 'Fresh Produce'];

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { currentUser, requireAuth } = useAuth();

  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const { products, loading, error } = useFetchProducts(currentCategory, searchQuery);

  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleClearSearch = () => {
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      const authorized = requireAuth({ type: 'ADD_TO_CART', payload: product });
      if (!authorized) return;
    }
    dispatch(addToCart(product));
  };

  return (
    <div className="catalog-container">
      <aside className="filters-sidebar">
        <h3>Categories</h3>
        <ul>
          {categories.map((cat) => (
            <li
              key={cat}
              className={currentCategory === cat ? 'active' : ''}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
      </aside>

      <main className="catalog-main">
        <h2>
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : `${currentCategory} Products`}
        </h2>

        {loading && <div className="spinner">Searching products...</div>}
        {error && <p className="error-msg">{error}</p>}

        {/* Product Not Available State */}
        {!loading && !error && products.length === 0 && (
          <div className="no-products-box">
            <div className="no-products-icon">🔍</div>
            <h3>Sorry, Product is Not Available!</h3>
            <p>
              We couldn't find any local item matching "<strong>{searchQuery}</strong>".
            </p>
            <p className="sub-text">
              Try searching with different keywords or explore our available Belagavi categories.
            </p>
            <button className="clear-search-btn" onClick={handleClearSearch}>
              View All Available Products
            </button>
          </div>
        )}

        {/* Product Grid State */}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((p) => (
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
        )}
      </main>
    </div>
  );
};

export default ProductList;