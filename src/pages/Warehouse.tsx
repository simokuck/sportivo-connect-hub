
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarehouseProvider, useWarehouse } from '@/context/WarehouseContext';
import { useSearchParams } from 'react-router-dom';

// Import components
import { WarehouseDashboard } from '@/components/warehouse/WarehouseDashboard';
import { CatalogView } from '@/components/warehouse/CatalogView';
import { InventoryMovements } from '@/components/warehouse/InventoryMovements';
import { ItemAssignments } from '@/components/warehouse/ItemAssignments';
import { WarehouseDialogs } from '@/components/warehouse/WarehouseDialogs';

const WarehouseContent = () => {
  const { 
    activeTab, 
    setActiveTab, 
    movements, 
    assignments, 
    players, 
    setDialogType, 
    setSelectedAssignment,
    lowStockItems,
    recentAssignments,
    items
  } = useWarehouse();
  
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Handle tab changes from URL parameters
    const viewParam = searchParams.get('view');
    if (viewParam && ['dashboard', 'catalog', 'movements', 'assignments'].includes(viewParam)) {
      setActiveTab(viewParam);
    }
    
    // Handle filters if needed
    const filterParam = searchParams.get('filter');
    if (filterParam === 'low-stock') {
      // Add logic to filter items
    }
  }, [searchParams, setActiveTab]);

  return (
    <div className="container mx-auto p-2 sm:p-4 space-y-6 content-wrapper">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">Magazzino</h1>
      </div>

      <Tabs defaultValue="dashboard" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="catalog">Catalogo</TabsTrigger>
          <TabsTrigger value="movements">Movimenti</TabsTrigger>
          <TabsTrigger value="assignments">Assegnazioni</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 p-1">
          <WarehouseDashboard 
            lowStockItems={lowStockItems}
            recentAssignments={recentAssignments}
          />
        </TabsContent>

        <TabsContent value="catalog" className="p-1">
          <CatalogView />
        </TabsContent>

        <TabsContent value="movements" className="p-1">
          <InventoryMovements 
            movements={movements}
            onAddMovement={() => setDialogType('addMovement')}
          />
        </TabsContent>
        
        <TabsContent value="assignments" className="p-1">
          <ItemAssignments 
            assignments={assignments}
            players={players}
            onAddAssignment={() => setDialogType('addAssignment')}
            onMarkReturned={(assignment) => {
              setSelectedAssignment(assignment);
              setDialogType('returnItem');
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs for all actions */}
      <WarehouseDialogs />
    </div>
  );
};

const Warehouse = () => {
  return (
    <WarehouseProvider>
      <WarehouseContent />
    </WarehouseProvider>
  );
};

export default Warehouse;
