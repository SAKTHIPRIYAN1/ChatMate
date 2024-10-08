import React, { useState, createContext, useContext } from 'react';

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false); // Set loading state

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};
