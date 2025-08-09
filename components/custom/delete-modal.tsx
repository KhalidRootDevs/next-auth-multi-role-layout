'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ReactNode, useState } from 'react';

interface DeleteModalProps {
  title?: string;
  description?: ReactNode;
  disableDelete?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  loadingText?: string;
  contentClass?: string;
  children?: ReactNode;
}

export default function DeleteModal({
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  disableDelete = false,
  open,
  onOpenChange,
  onConfirm,
  confirmText = 'Delete',
  loadingText = 'Deleting...',
  contentClass,
  children
}: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-md', contentClass)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-2 text-sm text-muted-foreground">{description}</div>

        {children && <div className="mt-4">{children}</div>}

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={disableDelete || loading}
          >
            {loading ? loadingText : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
