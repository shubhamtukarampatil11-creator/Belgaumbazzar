import { useState, useEffect } from 'react';
import { belgaumProducts } from '../data/belgaumProducts';

export const useFetchProducts = (category = '', searchQuery = '') => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        // Simulate REST API latency
        await new Promise((resolve) => setTimeout(resolve, 300));

        let filtered = [...belgaumProducts];

        if (category && category !== 'All') {
          filtered = filtered.filter((p) => p.category === category);
        }

        if (searchQuery.trim() !== '') {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.seller.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProducts(filtered);
      } catch (err) {
        setError('Failed to fetch products from BelgaumBazaar API.');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [category, searchQuery]);

  return { products, loading, error };
};