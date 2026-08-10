import type { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchPlaceholder?: string
  searchColumn?: string
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  searchColumn,
  children,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={
              searchColumn
                ? (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""
                : table.getState().globalFilter ?? ""
            }
            onChange={(e) => {
              if (searchColumn) {
                table.getColumn(searchColumn)?.setFilterValue(e.target.value)
              } else {
                table.setGlobalFilter(e.target.value)
              }
            }}
            className="h-9 pl-9"
          />
        </div>
        {children}
      </div>
    </div>
  )
}
