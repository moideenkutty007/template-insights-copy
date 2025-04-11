"use client"
import { Table } from "@/components/TableWrapper"
import { cx } from "@/lib/utils"
import { useState } from "react"

export interface Column<T> {
  header: string
  accessorKey: keyof T | string
  cell?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onSort?: (column: string, direction: "asc" | "desc") => void
  className?: string
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  onSort,
  className,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (column: string) => {
    if (onSort) {
      const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc"
      setSortColumn(column)
      setSortDirection(newDirection)
      onSort(column, newDirection)
    }
  }

  return (
    <div className={cx("w-full overflow-hidden", className)}>
      <Table>
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.HeaderCell
                key={column.accessorKey.toString()}
                className={cx(
                  onSort && "cursor-pointer",
                  column.className
                )}
                onClick={onSort ? () => handleSort(column.accessorKey.toString()) : undefined}
              >
                <div className="flex items-center gap-1">
                  {column.header}
                  {sortColumn === column.accessorKey && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} className="h-32 text-center">
                Loading...
              </Table.Cell>
            </Table.Row>
          ) : data.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} className="h-32 text-center">
                {emptyMessage}
              </Table.Cell>
            </Table.Row>
          ) : (
            data.map((item, index) => (
              <Table.Row key={index}>
                {columns.map((column) => (
                  <Table.Cell 
                    key={`${index}-${column.accessorKey.toString()}`}
                    className={column.className}
                  >
                    {column.cell
                      ? column.cell(item)
                      : getNestedValue(item, column.accessorKey.toString())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

// Helper function to get nested values from an object using dot notation
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null
  }, obj)
}