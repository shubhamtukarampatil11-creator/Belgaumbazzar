import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const hashPassword = async (password, salt = 'belgaum_salt_2026') => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    try {
      const activeSession = localStorage.getItem('belgaum_active_session');
      if (activeSession) {
        const parsedUser = JSON.parse(activeSession);
        setCurrentUser(parsedUser);
      }
    } catch (err) {
      console.error('Failed to parse saved session:', err);
      localStorage.removeItem('belgaum_active_session');
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const registerUser = async ({ name, email, phone, password }) => {
    const emailLower = email.toLowerCase().trim();
    const usersDb = JSON.parse(localStorage.getItem('belgaum_users_db') || '{}');

    if (usersDb[emailLower]) {
      throw new Error('An account with this email address already exists.');
    }

    const passwordHash = await hashPassword(password);

    const newUser = {
      name,
      email: emailLower,
      phone,
      passwordHash,
      address: {
        houseStreet: '',
        area: '',
        city: 'Belagavi',
        state: 'Karnataka',
        pincode: '',
        landmark: '',
      },
    };

    usersDb[emailLower] = newUser;
    localStorage.setItem('belgaum_users_db', JSON.stringify(usersDb));

    const sessionUser = { ...newUser };
    delete sessionUser.passwordHash;

    localStorage.setItem('belgaum_active_session', JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
    return sessionUser;
  };

  const loginUser = async ({ email, password }) => {
    const emailLower = email.toLowerCase().trim();
    const usersDb = JSON.parse(localStorage.getItem('belgaum_users_db') || '{}');
    const userRecord = usersDb[emailLower];

    if (!userRecord) {
      throw new Error('No account found with this email address.');
    }

    const computedHash = await hashPassword(password);
    if (userRecord.passwordHash !== computedHash) {
      throw new Error('Incorrect password. Please try again.');
    }

    const sessionUser = { ...userRecord };
    delete sessionUser.passwordHash;

    localStorage.setItem('belgaum_active_session', JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
    return sessionUser;
  };

  const updateUserProfile = (updatedDetails) => {
    if (!currentUser) return;

    const emailLower = currentUser.email.toLowerCase();
    const usersDb = JSON.parse(localStorage.getItem('belgaum_users_db') || '{}');

    const updatedUser = {
      ...currentUser,
      ...updatedDetails,
    };

    if (usersDb[emailLower]) {
      usersDb[emailLower] = {
        ...usersDb[emailLower],
        ...updatedUser,
      };
      localStorage.setItem('belgaum_users_db', JSON.stringify(usersDb));
    }

    localStorage.setItem('belgaum_active_session', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // Add new order
  const saveUserOrder = (orderData) => {
    if (!currentUser) return;
    const emailLower = currentUser.email.toLowerCase();
    const ordersKey = `belgaum_orders_${emailLower}`;
    const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    const newOrder = { ...orderData, status: 'Confirmed' };
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem(ordersKey, JSON.stringify(updatedOrders));
  };

  // Get orders
  const getUserOrders = () => {
    if (!currentUser) return [];
    const emailLower = currentUser.email.toLowerCase();
    const ordersKey = `belgaum_orders_${emailLower}`;
    return JSON.parse(localStorage.getItem(ordersKey) || '[]');
  };

  // Cancel an order
  const cancelUserOrder = (orderId) => {
    if (!currentUser) return;
    const emailLower = currentUser.email.toLowerCase();
    const ordersKey = `belgaum_orders_${emailLower}`;
    const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');

    const updatedOrders = existingOrders.map((order) => {
      if (order.orderId === orderId) {
        return { ...order, status: 'Cancelled' };
      }
      return order;
    });

    localStorage.setItem(ordersKey, JSON.stringify(updatedOrders));
  };

  const logoutUser = () => {
    localStorage.removeItem('belgaum_active_session');
    setCurrentUser(null);
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const requireAuth = (action = null) => {
    if (currentUser) return true;
    if (action) setPendingAction(action);
    setIsAuthModalOpen(true);
    return false;
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthLoading,
        isAuthModalOpen,
        pendingAction,
        setPendingAction,
        registerUser,
        loginUser,
        updateUserProfile,
        saveUserOrder,
        getUserOrders,
        cancelUserOrder,
        logoutUser,
        requireAuth,
        closeAuthModal,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);