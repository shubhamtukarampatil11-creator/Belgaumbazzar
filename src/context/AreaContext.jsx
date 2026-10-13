import React, { createContext, useState, useContext } from 'react';

const AreaContext = createContext();

export const AreaProvider = ({ children }) => {
  const [selectedArea, setSelectedArea] = useState('Camp & Sadashiv Nagar');

  return (
    <AreaContext.Provider value={{ selectedArea, setSelectedArea }}>
      {children}
    </AreaContext.Provider>
  );
};

export const useArea = () => useContext(AreaContext);