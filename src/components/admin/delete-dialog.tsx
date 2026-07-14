"use client";

import { ConfirmDialog } from "./confirm-dialog";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
  loading?: boolean;
}

export function DeleteDialog({ open, onClose, onConfirm, itemName, loading }: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete item"
      message={itemName
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : "Are you sure you want to delete this item? This action cannot be undone."
      }
      confirmLabel="Delete"
      variant="destructive"
      loading={loading}
    />
  );
}
