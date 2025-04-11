"use client"

import React from "react"
import {
  Table as TablePrimitive,
  TableBody,
  TableCell,
  TableHead as TableHeaderPrimitive,
  TableHeaderCell,
  TableRow,
} from "@/components/Table"

const Table = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <TablePrimitive className={className}>{children}</TablePrimitive>
}

const Header = ({ children }: { children: React.ReactNode }) => {
  return <TableHeaderPrimitive>{children}</TableHeaderPrimitive>
}

Table.Header = Header
Table.Body = TableBody
Table.Row = TableRow
Table.Cell = TableCell
Table.HeaderCell = TableHeaderCell

export { Table }