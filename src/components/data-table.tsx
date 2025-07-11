"use client"

import * as React from "react"
import {
  ColumnDef,
  TableOptions,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronDown, ArrowUpDown, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Settings2 } from "lucide-react"

export type DataTableProps<TData, TValue> = {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  // Pagination
  pagination?: {
    pageIndex: number
    pageSize: number
    pageCount?: number
  }
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void
  // Filtering
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
  // Sorting
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  // Column visibility
  columnVisibility?: VisibilityState
  onColumnVisibilityChange?: (visibility: VisibilityState) => void
  // Row selection
  rowSelection?: RowSelectionState
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void
  // Virtualization
  virtualized?: boolean
  tableClassName?: string
  loading?: boolean
  emptyText?: React.ReactNode
  style?: React.CSSProperties
}

export function DataTable<TData, TValue>({
  data,
  columns,
  pagination,
  onPaginationChange,
  globalFilter,
  onGlobalFilterChange,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
  rowSelection,
  onRowSelectionChange,
  virtualized = false,
  tableClassName = "",
  loading = false,
  emptyText = "Kayıt bulunamadı.",
  style = {},
}: DataTableProps<TData, TValue>) {
  const defaultPagination = { pageIndex: 0, pageSize: 10 };
  // Table instance
  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination: pagination
        ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
        : defaultPagination,
    },
    onSortingChange: onSortingChange
      ? (updaterOrValue) => {
        if (typeof updaterOrValue === "function") {
          onSortingChange(updaterOrValue(table.getState().sorting))
        } else {
          onSortingChange(updaterOrValue)
        }
      }
      : undefined,
    onGlobalFilterChange,
    onColumnVisibilityChange: onColumnVisibilityChange
      ? (updaterOrValue) => {
        if (typeof updaterOrValue === "function") {
          onColumnVisibilityChange(updaterOrValue(table.getState().columnVisibility))
        } else {
          onColumnVisibilityChange(updaterOrValue)
        }
      }
      : undefined,
    onRowSelectionChange: onRowSelectionChange
      ? (updaterOrValue) => {
        if (typeof updaterOrValue === "function") {
          onRowSelectionChange(updaterOrValue(table.getState().rowSelection))
        } else {
          onRowSelectionChange(updaterOrValue)
        }
      }
      : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    manualPagination: !!pagination,
    pageCount: pagination?.pageCount,
    manualSorting: !!onSortingChange,
    manualFiltering: !!onGlobalFilterChange,
    ...(onRowSelectionChange && rowSelection ? { enableRowSelection: true } : {}),
  })

  // Virtualization
  const parentRef = React.useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
    enabled: virtualized,
  })
  const virtualRows = virtualized ? rowVirtualizer.getVirtualItems() : undefined

  // Render
  return (
    <div className="w-full flex flex-col gap-2" style={style}>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ara..."
            value={globalFilter ?? ""}
            onChange={e => onGlobalFilterChange?.(e.target.value)}
            className="w-48"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1"><Settings2 className="w-4 h-4" /> Kolonlar</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Kolonları Göster/Gizle</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getAllLeafColumns().map(col => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={() => col.toggleVisibility()}
                  className="capitalize"
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Table */}
      <div className={cn("rounded-xl border bg-background w-full overflow-x-auto", tableClassName)}>
        <div ref={parentRef} style={virtualized ? { maxHeight: 480, overflowY: "auto" } : undefined}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="text-xs font-medium uppercase tracking-normal select-none">
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground text-sm">Yükleniyor...</TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground text-sm">{emptyText}</TableCell>
                </TableRow>
              ) : virtualized ? (
                <>
                  <tr style={{ height: rowVirtualizer.getTotalSize() }}>
                    <td style={{ padding: 0, border: 0 }} colSpan={columns.length}>
                      <div style={{ position: "relative", height: rowVirtualizer.getTotalSize() }}>
                        {virtualRows?.map(virtualRow => {
                          const row = rows[virtualRow.index]
                          return (
                            <div
                              key={row.id}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualRow.start}px)`
                              }}
                            >
                              <TableRow data-index={virtualRow.index}>
                                {row.getVisibleCells().map(cell => (
                                  <TableCell key={cell.id}>{cell.renderValue() as React.ReactNode}</TableCell>
                                ))}
                              </TableRow>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                </>
              ) : (
                rows.map(row => (
                  <TableRow key={row.id} data-state={rowSelection && onRowSelectionChange && row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{cell.renderValue() as React.ReactNode}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* Pagination */}
      {onPaginationChange && (
        <div className="flex items-center justify-between px-4 py-2 gap-4">
          <div className="text-muted-foreground text-xs">
            {rows.length === 0
              ? "0"
              : ((pagination?.pageIndex ?? 0) * (pagination?.pageSize ?? 10) + 1)}
            -
            {Math.min(((pagination?.pageIndex ?? 0) + 1) * (pagination?.pageSize ?? 10), table.getFilteredRowModel().rows.length)}
            / {table.getFilteredRowModel().rows.length} kayıt
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="size-7" onClick={() => onPaginationChange({ pageIndex: 0, pageSize: pagination?.pageSize ?? 10 })} disabled={pagination?.pageIndex === 0}><ChevronsLeft /></Button>
            <Button variant="outline" size="icon" className="size-7" onClick={() => onPaginationChange({ pageIndex: Math.max(0, (pagination?.pageIndex ?? 0) - 1), pageSize: pagination?.pageSize ?? 10 })} disabled={pagination?.pageIndex === 0}><ChevronLeft /></Button>
            <span className="text-xs px-2">{(pagination?.pageIndex ?? 0) + 1} / {(pagination?.pageCount ?? table.getPageCount()) || 1}</span>
            <Button variant="outline" size="icon" className="size-7" onClick={() => onPaginationChange({ pageIndex: Math.min((pagination?.pageCount ?? table.getPageCount()) - 1, (pagination?.pageIndex ?? 0) + 1), pageSize: pagination?.pageSize ?? 10 })} disabled={(pagination?.pageIndex ?? 0) >= ((pagination?.pageCount ?? table.getPageCount()) - 1)}><ChevronRight /></Button>
            <Button variant="outline" size="icon" className="size-7" onClick={() => onPaginationChange({ pageIndex: (pagination?.pageCount ?? table.getPageCount()) - 1, pageSize: pagination?.pageSize ?? 10 })} disabled={(pagination?.pageIndex ?? 0) >= ((pagination?.pageCount ?? table.getPageCount()) - 1)}><ChevronsRight /></Button>
            <select
              className="ml-2 border rounded px-1 py-0.5 text-xs bg-background"
              value={pagination?.pageSize ?? 10}
              onChange={e => onPaginationChange({ pageIndex: 0, pageSize: Number(e.target.value) })}
            >
              {[10, 20, 30, 40, 50].map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable;