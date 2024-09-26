'use client';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { group } from '@/lib/data-conversion';

function splitArray<T>(array: T[], n: number) {
  const result = [];
  const size = Math.ceil(array.length / n);
  for (let i = 0; i < n; i++) {
    result.push(array.slice(i * size, (i + 1) * size));
  }
  return result;
}

interface DataTableProps<
  T extends { id: string; value: unknown },
  K extends keyof T
> {
  data: T[];
  groupKey: K;
  groupName?: string;
  split?: number;
}

export function DataTable<
  T extends { id: string; value: unknown },
  K extends keyof T
>({ data, groupKey, groupName, split = 1 }: DataTableProps<T, K>) {
  const [columns, value] = useMemo(
    () => group(data, groupKey),
    [data, groupKey]
  );
  const col: ColumnDef<any, any>[] = [
    { accessorKey: groupKey, header: groupName },
    ...columns.map((c) => ({
      accessorKey: c,
      header: c
    }))
  ];

  return (
    <>
      {split > 1 ? (
        splitArray(value, split).map((data, i) => (
          <ReactTable key={i} columns={col} data={data} />
        ))
      ) : (
        <ReactTable columns={col} data={value} />
      )}
    </>
  );
}

export function ReactTable<TData extends unknown, TValue>({
  columns,
  data
}: {
  columns: ColumnDef<TData, TValue>[];
  data: any[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
