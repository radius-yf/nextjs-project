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

function translate<T extends { id: string; value: unknown }, K extends keyof T>(
  data: T[],
  key: K,
  keyName: string | undefined
): [any[], any[]] {
  return [
    [
      { accessorKey: 'key', header: keyName || key },
      ...Array.from(new Set(data.map((d) => d.id))).map((item) => ({
        accessorKey: item,
        header: item
      }))
    ],
    Object.entries(Object.groupBy(data, (d) => d[key] as string)).map(
      ([key, val]) => ({
        key,
        ...val?.reduce((acc, item) => ({ ...acc, [item.id]: item.value }), {})
      })
    )
  ];
}

interface DataTableProps<
  T extends { id: string; value: unknown },
  K extends keyof T
> {
  data: T[];
  groupKey: K;
  groupName?: string;
}

export function DataTable<
  T extends { id: string; value: unknown },
  K extends keyof T
>({ data, groupKey, groupName }: DataTableProps<T, K>) {
  const [columns, value] = useMemo(
    () => translate(data, groupKey, groupName),
    [data, groupKey, groupName]
  );

  return <ReactTable columns={columns} data={value} />;
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
    <Table className="relative">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-inherit">
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
                <TableCell key={cell.id} className="px-2">
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
