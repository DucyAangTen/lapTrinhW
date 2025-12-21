import React, { createContext, useState, useContext } from 'react';

// Create a context for advanced features
const AdvancedFeaturesContext = createContext();

// Create a provider component
export const AdvancedFeaturesProvider = ({ children }) => {
  const [advancedFeatures, setAdvancedFeatures] = useState(false);

  return (
    <AdvancedFeaturesContext.Provider value={{ advancedFeatures, setAdvancedFeatures }}>
      {children}
    </AdvancedFeaturesContext.Provider>
  );
};

// Custom hook to use the advanced features context
export const useAdvancedFeatures = () => {
  return useContext(AdvancedFeaturesContext);
};
