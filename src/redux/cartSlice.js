import { createSlice } from '@reduxjs/toolkit';

const getCartStorageKey = (userEmail) => {
  return userEmail ? `belgaum_cart_${userEmail.toLowerCase()}` : 'belgaum_cart_guest';
};

const loadCartForUser = (userEmail) => {
  try {
    const key = getCartStorageKey(userEmail);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    return [];
  }
};

const saveCartForUser = (userEmail, cartItems) => {
  try {
    const key = getCartStorageKey(userEmail);
    localStorage.setItem(key, JSON.stringify(cartItems));
  } catch (err) {
    console.error('Failed to persist cart:', err);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    currentUserEmail: null,
    isCartOpen: false,
  },
  reducers: {
    syncUserCart: (state, action) => {
      const userEmail = action.payload;
      state.currentUserEmail = userEmail;
      state.items = loadCartForUser(userEmail);
    },
    addToCart: (state, action) => {
      const itemToAdd = action.payload;
      const existing = state.items.find((i) => i.id === itemToAdd.id);

      if (existing) {
        existing.quantity += itemToAdd.quantity || 1;
      } else {
        state.items.push({ ...itemToAdd, quantity: itemToAdd.quantity || 1 });
      }

      saveCartForUser(state.currentUserEmail, state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCartForUser(state.currentUserEmail, state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCartForUser(state.currentUserEmail, state.items);
    },
    clearCart: (state) => {
      state.items = [];
      if (state.currentUserEmail) {
        localStorage.removeItem(getCartStorageKey(state.currentUserEmail));
      }
    },
    toggleCartDrawer: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  syncUserCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCartDrawer,
} = cartSlice.actions;

export default cartSlice.reducer;