"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { IconDotsVertical, IconPlus, IconLayoutColumns } from "@tabler/icons-react"
import { useState } from "react";

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
  React.useEffect(() => { setData(initialData) }, [initialData])
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(10)
  const [visibleCols, setVisibleCols] = React.useState(() => initialColumns.map(c => c.key));
  React.useEffect(() => {
    setVisibleCols(initialColumns.map(c => c.key));
  }, [initialColumns]);
  const [modal, setModal] = React.useState<{ type: "add" | "edit", row?: any } | null>(null)
  const [form, setForm] = React.useState<any>({})

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
      {/* Masaüstü görünüm */}
      <div className="hidden md:block">
        <div className={`rounded-xl border border-[#ededed] bg-white w-full overflow-hidden shadow-none ${tableClassName}`} style={{ width: "100%", ...style }}>
          <table className="min-w-full">
            <thead>
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-xs font-medium uppercase tracking-normal text-[#222] select-none"
                    style={{
                      minHeight: headerHeight,
                      ...column.style,
                      textAlign: column.align || "left",
                    }}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-muted-foreground text-sm">{emptyText}</td>
                </tr>
              ) : (
                paged.map((row, rowIdx) => (
                  <tr key={row.id || rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"}>
                    {columns.map((column, colIdx) => (
                      <td
                        key={column.key}
                        className="px-6 py-3 text-sm"
                        style={{
                          minHeight: rowHeight,
                          ...column.style,
                          textAlign: column.align || "left",
                        }}
                      >
                        {column.cell ? column.cell(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Mobil görünüm: 4'ten fazla kolon varsa açılır panel */}
      <div className="block md:hidden">
        <div className="min-w-full" style={{ width: "100%", ...style }}>
          {paged.length === 0 ? (
            <div className="flex items-center justify-center h-60 text-muted-foreground text-sm w-full">
              {emptyText}
            </div>
          ) : (
            paged.map((row, rowIdx) => (
              <div key={row.id || rowIdx} className="border-b border-[#ededed] py-2">
                {columns.slice(0, 4).map((column, colIdx) => (
                  <div key={column.key} className="flex justify-between px-4 py-1">
                    <span className="font-medium">{column.header}:</span>
                    <span>{column.cell ? column.cell(row) : row[column.key]}</span>
                  </div>
                ))}
                {columns.length > 4 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2">Diğer Bilgiler</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {columns.slice(4).map((column) => (
                        <DropdownMenuItem key={column.key}>
                          <span className="font-medium">{column.header}:</span>
                          <span className="ml-2">{column.cell ? column.cell(row) : row[column.key]}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-2 gap-4">
        <div className="text-muted-foreground text-xs">
          {filtered.length === 0 ? "0" : page * pageSize + 1} - {Math.min((page + 1) * pageSize, filtered.length)} / {filtered.length} kayıt
        </div>
        <div className="flex items-center gap-1">
          <button className="size-7 border rounded" onClick={() => setPage(0)} disabled={page === 0}>{"<<"}</button>
          <button className="size-7 border rounded" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>{"<"}</button>
          <span className="text-xs px-2">{page + 1} / {pageCount || 1}</span>
          <button className="size-7 border rounded" onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page >= pageCount - 1}>{">"}</button>
          <button className="size-7 border rounded" onClick={() => setPage(pageCount - 1)} disabled={page >= pageCount - 1}>{">>"}</button>
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

export default DataTable;