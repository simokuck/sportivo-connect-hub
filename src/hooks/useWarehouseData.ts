
import { useCategories } from './warehouse/useCategories';
import { useSuppliers } from './warehouse/useSuppliers';
import { useItems } from './warehouse/useItems';
import { useMovements } from './warehouse/useMovements';
import { useAssignments } from './warehouse/useAssignments';

export function useWarehouseData() {
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  const { 
    items, 
    createBaseItem,
    updateBaseItem,
    deleteBaseItem,
    createVariant,
    updateVariant,
    deleteVariant,
    lowStockItems
  } = useItems();
  const { movements, addMovement } = useMovements();
  const { assignments, addAssignment, markAssignmentReturned } = useAssignments();
  
  return {
    // Queries
    items,
    movements,
    assignments,
    categories,
    suppliers,
    
    // Mutations
    createBaseItem,
    updateBaseItem,
    deleteBaseItem,
    createVariant,
    updateVariant,
    deleteVariant,
    addMovement,
    addAssignment,
    markAssignmentReturned,
    
    // Derived data
    lowStockItems
  };
}
