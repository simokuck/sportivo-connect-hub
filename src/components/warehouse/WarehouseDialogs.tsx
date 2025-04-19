
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { useWarehouse } from '@/context/WarehouseContext';

// Import form components
import { BaseItemForm } from '@/components/warehouse/BaseItemForm';
import { ItemVariantForm } from '@/components/warehouse/ItemVariantForm';
import { MovementForm } from '@/components/warehouse/MovementForm';
import { AssignmentForm } from '@/components/warehouse/AssignmentForm';
import { ReturnForm } from '@/components/warehouse/ReturnForm';

export function WarehouseDialogs() {
  const {
    dialogType,
    setDialogType,
    selectedItem,
    selectedVariant,
    selectedAssignment,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteTarget,
    setDeleteTarget,
    handleCreateBaseItem,
    handleUpdateBaseItem,
    handleDeleteBaseItem,
    handleCreateVariant,
    handleUpdateVariant, 
    handleDeleteVariant,
    handleAddMovement,
    handleAddAssignment,
    handleMarkReturned,
    players,
    items
  } = useWarehouse();

  return (
    <>
      {/* Base Item Dialog */}
      <Dialog open={dialogType === 'addItem' || dialogType === 'editItem'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'addItem' ? 'Aggiungi articolo' : 'Modifica articolo'}
            </DialogTitle>
          </DialogHeader>
          <BaseItemForm 
            item={dialogType === 'editItem' ? selectedItem || undefined : undefined}
            onSubmit={dialogType === 'addItem' ? handleCreateBaseItem : handleUpdateBaseItem}
            onCancel={() => setDialogType('none')}
          />
        </DialogContent>
      </Dialog>

      {/* Item Variant Dialog */}
      <Dialog open={dialogType === 'addVariant' || dialogType === 'editVariant'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'addVariant' ? 'Aggiungi variante' : 'Modifica variante'}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <ItemVariantForm 
              baseItem={selectedItem}
              variant={dialogType === 'editVariant' ? selectedVariant || undefined : undefined}
              onSubmit={dialogType === 'addVariant' ? handleCreateVariant : handleUpdateVariant}
              onCancel={() => setDialogType('none')}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Movement Dialog */}
      <Dialog open={dialogType === 'addMovement'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Registra movimento</DialogTitle>
          </DialogHeader>
          <MovementForm 
            items={items}
            players={players}
            onSubmit={handleAddMovement}
            onCancel={() => setDialogType('none')}
          />
        </DialogContent>
      </Dialog>

      {/* Assignment Dialog */}
      <Dialog open={dialogType === 'addAssignment'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nuova assegnazione</DialogTitle>
          </DialogHeader>
          <AssignmentForm 
            items={items}
            players={players}
            onSubmit={handleAddAssignment}
            onCancel={() => setDialogType('none')}
          />
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={dialogType === 'returnItem'} onOpenChange={(open) => {
        if (!open) setDialogType('none');
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Registra restituzione</DialogTitle>
          </DialogHeader>
          {selectedAssignment && (
            <ReturnForm 
              assignment={selectedAssignment}
              onSubmit={handleMarkReturned}
              onCancel={() => {
                setDialogType('none');
                setSelectedAssignment(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (deleteTarget) {
            if (deleteTarget.type === 'item') {
              handleDeleteBaseItem(deleteTarget.id);
            } else {
              handleDeleteVariant(deleteTarget.id);
            }
          }
        }}
        title={`Conferma eliminazione ${deleteTarget?.type === 'item' ? 'articolo' : 'variante'}`}
        description={`Sei sicuro di voler eliminare ${deleteTarget?.type === 'item' ? 'questo articolo e tutte le sue varianti' : 'questa variante'}? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
        toastMessage={`${deleteTarget?.type === 'item' ? 'Articolo' : 'Variante'} eliminato`}
        toastDescription={`${deleteTarget?.type === 'item' ? 'L\'articolo' : 'La variante'} è stato rimosso dal magazzino`}
      />
    </>
  );
}
