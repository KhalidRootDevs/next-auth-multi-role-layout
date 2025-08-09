'use client';

import type { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search: boolean;
}

export function DataTableToolbar<TData>({
  table,
  search
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>(
    searchParams.get('search') || ''
  );

  // Function to update the URL with new query parameters
  const updateURLParams = (params: URLSearchParams) => {
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Update the URL whenever any of the filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm) params.set('search', searchTerm);
    else params.delete('search');

    updateURLParams(params);
  }, [searchTerm, searchParams, router]);

  const isFiltered = table.getState().columnFilters.length > 0 || searchTerm;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {search && (
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-10 max-w-sm"
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
