"use client"

import React from "react"
import {
  Select,
  SelectContent,
  SelectItem as SelectItemPrimitive,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

const SelectItem = ({ value, children }: SelectItemProps) => {
  return <SelectItemPrimitive value={value}>{children}</SelectItemPrimitive>
}

interface SelectWrapperProps {
  label?: string
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

const SelectWrapper = ({
  label,
  value,
  onValueChange,
  children,
  className,
}: SelectWrapperProps) => {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  )
}

SelectWrapper.Item = SelectItem

export { SelectWrapper as Select }