'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function Modal({
  title,
  contentClass,
  triggerClass,
  children,
  trigger,
  open,
  onOpenChange
}: {
  title: string;
  contentClass?: string;
  triggerClass?: string;
  children: ReactNode;
  trigger: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className={cn('mb-5', triggerClass)}>{trigger}</div>
      <DialogContent className={cn('max-w-xl', contentClass)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
