"use client"

import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { IconDotsVertical, IconPlus, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconLayoutColumns } from "@tabler/icons-react"
import { useRouter } from "next/navigation"

export type DataTableColumn = {
  key: string
  header: React.ReactNode
  width?: number
  cell?: (row: any) => React.ReactNode
  align?: "left" | "center" | "right"
  style?: React.CSSProperties
  editable?: boolean
  inputType?: string
}

export type DataTableProps = {
  data: any[]
  columns: DataTableColumn[]
  rowHeight?: number
  headerHeight?: number
  tableClassName?: string
  style?: React.CSSProperties
  emptyText?: React.ReactNode
}

export function DataTable({
  data: initialData,
  columns: initialColumns,
  rowHeight = 56,
  headerHeight = 48,
  tableClassName = "",
  style = {},
  emptyText = "Kayıt bulunamadı.",
}: DataTableProps) {
  // State
  const [data, setData] = React.useState<any[]>(initialData)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)
  const [visibleCols, setVisibleCols] = React.useState(() => initialColumns.map(c => c.key))
  const [modal, setModal] = React.useState<{ type: "add" | "edit", row?: any } | null>(null)
  const [editingRow, setEditingRow] = React.useState<any | null>(null)

  // Derived columns (with visibility)
  const columns = React.useMemo(() => initialColumns.filter(c => visibleCols.includes(c.key)), [initialColumns, visibleCols])

  // Search filter
  const filtered = React.useMemo(() => {
    if (!search) return data
    return data.filter(row =>
      columns.some(col => {
        const val = row[col.key]
        return val && String(val).toLowerCase().includes(search.toLowerCase())
      })
    )
  }, [data, search, columns])

  // Pagination
  const pageCount = Math.ceil(filtered.length / pageSize)
  const paged = React.useMemo(() => filtered.slice(page * pageSize, (page + 1) * pageSize), [filtered, page, pageSize])

  // Virtualization
  const parentRef = React.useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: paged.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: 8,
  })

  // Grid column widths (all columns equal width, always full width)
  const colWidths = React.useMemo(() => {
    if (columns.length === 0) return ""
    return `repeat(${columns.length}, 1fr)`
  }, [columns])

  // Add/Edit modal form state
  const [form, setForm] = React.useState<any>({})
  React.useEffect(() => {
    if (modal?.type === "edit" && modal.row) setForm({ ...modal.row })
    else if (modal?.type === "add") setForm({})
  }, [modal])

  // Handlers
  function handleSave() {
    if (modal?.type === "add") {
      setData(prev => [{ ...form, id: Date.now() }, ...prev])
    } else if (modal?.type === "edit" && modal.row) {
      setData(prev => prev.map(r => r === modal.row ? { ...form } : r))
    }
    setModal(null)
  }
  function handleDelete(row: any) {
    setData(prev => prev.filter(r => r !== row))
  }

  // Render
  const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-2 pt-2">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Ara..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            className="w-48"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1"><IconLayoutColumns className="w-4 h-4" /> Kolonlar</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {initialColumns.map(col => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleCols.includes(col.key)}
                  onCheckedChange={() => setVisibleCols(v => v.includes(col.key) ? v.filter(k => k !== col.key) : [...v, col.key])}
                >
                  {col.header}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setModal({ type: "add" })}><IconPlus className="w-4 h-4" /> Yeni Ekle</Button>
      </div>
      {/* Table */}
      <div
        ref={parentRef}
        style={{ width: "100%", ...style }}
        className={`rounded-xl border border-[#ededed] bg-white w-full overflow-hidden shadow-none ${tableClassName}`}
      >
        <div className="min-w-full">
          {/* Header */}
          <div
            className="sticky top-0 z-20 border-b border-[#ededed] bg-[#f8f8f8]"
            style={{
              height: headerHeight,
              display: "grid",
              gridTemplateColumns: colWidths + " 48px",
              alignItems: "center",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            {columns.map((column, idx) => (
              <div
                key={column.key}
                className={`px-6 py-3 text-xs font-medium uppercase tracking-normal text-[#222] select-none flex items-center h-full`}
                style={{
                  minHeight: headerHeight,
                  ...column.style,
                  borderTopLeftRadius: idx === 0 ? 12 : undefined,
                  borderTopRightRadius: idx === columns.length - 1 ? 12 : undefined,
                  justifyContent: column.align === "center" ? "center" : column.align === "right" ? "flex-end" : "flex-start",
                  textAlign: column.align || "left",
                }}
              >
                {column.header}
              </div>
            ))}
            {/* Empty cell for actions */}
            <div />
          </div>
          {/* Rows */}
          <div style={{ position: "relative", height: rowVirtualizer.getTotalSize() }}>
            {rowVirtualizer.getVirtualItems().length === 0 && (
              <div className="flex items-center justify-center h-60 text-muted-foreground text-sm w-full">
                {emptyText}
              </div>
            )}
            {rowVirtualizer.getVirtualItems().map((row, idx) => {
              const rowData = paged[row.index]
              const isLast = row.index === rowVirtualizer.getVirtualItems().length - 1
              return (
                <div
                  key={row.index}
                  className={`group transition-colors border-b border-[#f1f1f1] flex items-center ${isLast ? "rounded-b-xl" : ""} ${row.index % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"} hover:bg-[#f5f5f5]`}
                  style={{
                    position: "absolute",
                    top: row.start,
                    left: 0,
                    width: "100%",
                    height: row.size,
                    display: "grid",
                    gridTemplateColumns: colWidths + " 48px",
                    alignItems: "center",
                  }}
                >
                  {columns.map((column, idx2) => (
                    <div
                      key={column.key}
                      className={`px-6 py-3 text-sm flex items-center h-full overflow-hidden whitespace-nowrap text-ellipsis`}
                      style={{
                        minHeight: rowHeight,
                        ...column.style,
                        borderBottomLeftRadius: isLast && idx2 === 0 ? 12 : undefined,
                        borderBottomRightRadius: isLast && idx2 === columns.length - 1 ? 12 : undefined,
                        justifyContent: column.align === "center" ? "center" : column.align === "right" ? "flex-end" : "flex-start",
                        textAlign: column.align || "left",
                      }}
                    >
                      {column.cell ? column.cell(rowData) : rowData[column.key]}
                    </div>
                  ))}
                  {/* Row actions */}
                  <div className="flex items-center justify-end pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7"><IconDotsVertical className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router && router.push && router.push(`/invoices/${rowData.id}/view`)}>Görüntüle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModal({ type: "edit", row: rowData })}>Düzenle</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(rowData)} className="text-destructive">Sil</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        <div className="text-muted-foreground text-xs">
          {filtered.length === 0 ? "0" : page * pageSize + 1} - {Math.min((page + 1) * pageSize, filtered.length)} / {filtered.length} kayıt
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="size-7" onClick={() => setPage(0)} disabled={page === 0}><IconChevronsLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="size-7" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><IconChevronLeft className="w-4 h-4" /></Button>
          <span className="text-xs px-2">{page + 1} / {pageCount || 1}</span>
          <Button variant="outline" size="icon" className="size-7" onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}><IconChevronRight className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" className="size-7" onClick={() => setPage(pageCount - 1)} disabled={page >= pageCount - 1}><IconChevronsRight className="w-4 h-4" /></Button>
          <select
            className="ml-2 border rounded px-1 py-0.5 text-xs bg-background"
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(0) }}
          >
            {[10, 20, 30, 40, 50].map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
      </div>
      {/* Add/Edit Modal */}
      <Dialog open={!!modal} onOpenChange={v => !v && setModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modal?.type === "add" ? "Yeni Kayıt Ekle" : "Kaydı Düzenle"}</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-3 py-2" onSubmit={e => { e.preventDefault(); handleSave() }}>
            {initialColumns.filter(col => col.editable !== false).map(col => (
              <div key={col.key} className="flex flex-col gap-1">
                <label className="text-xs font-medium" htmlFor={col.key}>{col.header}</label>
                <Input
                  id={col.key}
                  type={col.inputType || "text"}
                  value={form[col.key] ?? ""}
                  onChange={e => setForm((f: any) => ({ ...f, [col.key]: e.target.value }))}
                  className="h-8"
                />
              </div>
            ))}
            <DialogFooter className="gap-2 mt-2">
              <Button type="submit">Kaydet</Button>
              <DialogClose asChild>
                <Button variant="ghost" type="button">Vazgeç</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}