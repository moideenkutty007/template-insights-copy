"use client"
import { Button } from "@/components/Button"
import useScroll from "@/lib/useScroll"
import { cx } from "@/lib/utils"
import { ReactNode } from "react"
import { RefreshCcw, Download } from "lucide-react"

interface ReportPageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  filters?: ReactNode;
  onResetFilters?: () => void;
  onExportData?: () => void;
}

export default function ReportPageLayout({
  title,
  description,
  children,
  filters,
  onResetFilters,
  onExportData,
}: ReportPageLayoutProps) {
  const scrolled = useScroll(10)

  return (
    <>
      <section
        aria-labelledby="report-title"
        className={cx(
          "sticky top-16 z-50 -my-6 flex flex-col gap-6 bg-white py-6 md:flex-row md:flex-wrap md:items-center md:justify-between lg:top-0 dark:bg-gray-925",
          scrolled &&
            "border-b border-gray-200 transition-all dark:border-gray-900",
        )}
      >
        <div className="space-y-1">
          <h1
            id="report-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-50"
          >
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-end gap-3">
            {filters}
            {onResetFilters && (
              <Button
                variant="light"
                className="h-fit dark:border-gray-800"
                onClick={onResetFilters}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>
          {onExportData && (
            <Button
              variant="outline"
              className="h-fit"
              onClick={onExportData}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </section>
      <section className="my-8">
        {children}
      </section>
    </>
  )
}