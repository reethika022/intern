import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Card } from "../ui/Card";
import { EmptyState } from "./EmptyState";

export function DataTable({ data = [], columns = [] }) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  if (!data.length) return <EmptyState />;

  return (
    <Card className="overflow-hidden">
      <div className="table-scroll w-full overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-slate-950/70 text-xs uppercase tracking-wide text-pulse-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border-b border-pulse-border px-4 py-3 font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-slate-800/45">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-b border-pulse-border px-4 py-3 text-slate-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
