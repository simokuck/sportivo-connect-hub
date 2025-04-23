
import React, { createContext, useContext } from 'react';
import { useWarehouseData } from '@/hooks/useWarehouseData';
import { WarehouseContextType } from './warehouse/types';

// Create the context with a default undefined value
const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// Export the provider component
export const WarehouseProvider = ({ children }: { children: React.ReactNode }) => {
  // Use our hook to get all data and operations
  const warehouseData = useWarehouseData();
  
  return (
    <WarehouseContext.Provider value={warehouseData}>
      {children}
    </WarehouseContext.Provider>
  );
};

// Export a custom hook to use the context
export const useWarehouse = (): WarehouseContextType => {
  const context = useContext(WarehouseContext);
  
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  
  return context;
};
