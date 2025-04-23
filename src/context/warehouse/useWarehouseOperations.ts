
import { useState } from 'react';
import { useWarehouseData } from '@/hooks/useWarehouseData';
import { useNotifications } from '@/context/NotificationContext';
import { BaseItem, ItemVariant, ItemAssignment, Player } from '@/types/warehouse';
import { DialogType, DeleteTarget } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export function useWarehouseOperations() {
  const { showNotification } = useNotifications();
  
  // Get data from the useWarehouseData hook
  const { 
    items, 
    movements, 
    assignments,
    createBaseItem,
    updateBaseItem,
    deleteBaseItem,
    createVariant,
    updateVariant,
    deleteVariant,
    addMovement,
    addAssignment,
    markAssignmentReturned,
    lowStockItems
  } = useWarehouseData();
  
  // Get players data
  const { data: players = [] } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('last_name');
      
      if (error) throw error;
      
      return (data || []).map(player => ({
        id: player.id,
        first_name: player.first_name,
        last_name: player.last_name,
        email: player.email || '',
        position: player.position,
        strong_foot: player.strong_foot,
        avatar_url: player.avatar_url,
        name: `${player.first_name} ${player.last_name}`,
        firstName: player.first_name,
        lastName: player.last_name,
        avatar: player.avatar_url
      })) as Player[];
    }
  });
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedItem, setSelectedItem] = useState<BaseItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<ItemAssignment | null>(null);
  const [showVariants, setShowVariants] = useState(false);
  
  // Dialog management
  const [dialogType, setDialogType] = useState<DialogType>('none');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  // Handle create base item
  const handleCreateBaseItem = async (data: any) => {
    await createBaseItem.mutateAsync(data);
    setDialogType('none');
    showNotification('success', 'Articolo creato', {
      description: "Il nuovo articolo è stato aggiunto al magazzino",
    });
  };
  
  // Handle update base item
  const handleUpdateBaseItem = async (data: any) => {
    await updateBaseItem.mutateAsync(data);
    setDialogType('none');
    showNotification('success', 'Articolo aggiornato', {
      description: "Le modifiche all'articolo sono state salvate",
    });
  };
  
  // Handle delete base item
  const handleDeleteBaseItem = async (itemId: string) => {
    await deleteBaseItem.mutateAsync(itemId);
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
    showNotification('success', 'Articolo eliminato', {
      description: "L'articolo e tutte le sue varianti sono stati eliminati",
    });
  };
  
  // Handle create variant
  const handleCreateVariant = async (data: any) => {
    if (!selectedItem) return;
    
    // Check if variant with same size and color already exists
    const isDuplicate = items.find(item => item.id === selectedItem.id)?.variants.some(
      v => v.size === data.size && v.color === data.color
    );
    
    if (isDuplicate) {
      showNotification('error', 'Errore', {
        description: "Esiste già una variante con questa taglia e colore"
      });
      return;
    }
    
    await createVariant.mutateAsync({
      ...data,
      baseItemId: selectedItem.id
    });
    
    setDialogType('none');
  };
  
  // Handle update variant
  const handleUpdateVariant = async (data: any) => {
    if (!selectedItem || !selectedVariant) return;
    
    // Check for duplicate size and color, excluding the current variant
    const isDuplicate = items.find(item => item.id === selectedItem.id)?.variants.some(
      v => v.id !== selectedVariant.id && v.size === data.size && v.color === data.color
    );
    
    if (isDuplicate) {
      showNotification('error', 'Errore', {
        description: "Esiste già una variante con questa taglia e colore"
      });
      return;
    }
    
    await updateVariant.mutateAsync({
      id: selectedVariant.id,
      ...data
    });
    
    setDialogType('none');
  };
  
  // Handle delete variant
  const handleDeleteVariant = async (variantId: string) => {
    await deleteVariant.mutateAsync(variantId);
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };
  
  // Handle new movement
  const handleAddMovement = async (data: any) => {
    await addMovement.mutateAsync(data);
    setDialogType('none');
  };
  
  // Handle new assignment
  const handleAddAssignment = async (data: any) => {
    await addAssignment.mutateAsync(data);
    setDialogType('none');
  };
  
  // Handle mark assignment as returned
  const handleMarkReturned = async (data: any) => {
    if (!selectedAssignment) return;
    
    await markAssignmentReturned.mutateAsync({
      id: selectedAssignment.id,
      returnedCondition: data.returnedCondition
    });
    
    setDialogType('none');
    setSelectedAssignment(null);
  };

  const onEditItem = (item: any) => {
    setSelectedItem(item);
    setDialogType('editItem');
  };

  return {
    // States
    items,
    movements,
    assignments,
    players,
    activeTab,
    setActiveTab,
    selectedItem,
    setSelectedItem,
    selectedVariant,
    setSelectedVariant,
    selectedAssignment,
    setSelectedAssignment,
    showVariants,
    setShowVariants,
    dialogType,
    setDialogType,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteTarget,
    setDeleteTarget,

    // Operations
    handleCreateBaseItem,
    handleUpdateBaseItem,
    handleDeleteBaseItem,
    handleCreateVariant,
    handleUpdateVariant,
    handleDeleteVariant,
    handleAddMovement,
    handleAddAssignment,
    handleMarkReturned,
    onEditItem,

    // Dashboard data
    lowStockItems,
    recentAssignments: assignments
      .sort((a, b) => new Date(b.assignDate).getTime() - new Date(a.assignDate).getTime())
      .slice(0, 5)
  };
}
