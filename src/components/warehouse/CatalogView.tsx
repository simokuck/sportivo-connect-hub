
import React from 'react';
import { useWarehouse } from '@/context/WarehouseContext';
import { ItemVariantsList } from './ItemVariantsList';
import { BaseItemsList } from './BaseItemsList';

export function CatalogView() {
  const {
    items,
    selectedItem,
    showVariants,
    setSelectedItem,
    setShowVariants,
    setDialogType,
    setSelectedVariant,
    setDeleteTarget,
    setIsDeleteModalOpen,
    onEditItem
  } = useWarehouse();

  return (
    <>
      {showVariants && selectedItem ? (
        <ItemVariantsList
          variants={items.find(item => item.id === selectedItem.id)?.variants || []}
          onEdit={(variant) => {
            setSelectedVariant(variant);
            setDialogType('editVariant');
          }}
          onDelete={(variant) => {
            setDeleteTarget({ id: variant.id, type: 'variant' });
            setIsDeleteModalOpen(true);
          }}
          onAddVariant={() => {
            setDialogType('addVariant');
          }}
        />
      ) : (
        <BaseItemsList
          items={items}
          onSelectItem={(item) => {
            setSelectedItem(item);
            setShowVariants(true);
          }}
          onEditItem={onEditItem}
          onDeleteItem={(item) => {
            setSelectedItem(item);
            setDeleteTarget({ id: item.id, type: 'item' });
            setIsDeleteModalOpen(true);
          }}
          onAddItem={() => setDialogType('addItem')}
        />
      )}
    </>
  );
}
