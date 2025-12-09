import React, { createContext, useContext, useState } from 'react';

interface ZenContextType {
  isZenMode: boolean;
  toggleZenMode: () => void;
}

const ZenContext = createContext<ZenContextType | undefined>(undefined);

export const ZenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isZenMode, setIsZenMode] = useState(false);

  const toggleZenMode = () => setIsZenMode(prev => !prev);

  return (
    <ZenContext.Provider value={{ isZenMode, toggleZenMode }}>
      {children}
    </ZenContext.Provider>
  );
};

export const useZen = () => {
  const context = useContext(ZenContext);
  if (!context) {
    throw new Error('useZen must be used within a ZenProvider');
  }
  return context;
};