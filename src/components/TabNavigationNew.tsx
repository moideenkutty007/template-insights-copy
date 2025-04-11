"use client"

import React from "react"
import { cx } from "@/lib/utils"

interface TabItem {
  value: string
  label: string
}

interface TabNavigationProps {
  value: string
  onValueChange: (value: string) => void
  items: TabItem[]
  className?: string
}

export function TabNavigation({
  value,
  onValueChange,
  items,
  className,
}: TabNavigationProps) {
  return (
    <div className={cx("border-b border-gray-200 dark:border-gray-800", className)}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={() => onValueChange(item.value)}
            className={cx(
              "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
              value === item.value
                ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300"
            )}
            aria-current={value === item.value ? "page" : undefined}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}