"use client"
import React from "react"
import { cx } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Logo } from "@/components/ui/Logo"
import useScroll from "@/lib/useScroll"
import { Button } from "@/components/Button"

interface Step {
  name: string
  href: string
}

const steps: Step[] = [
  { name: "Product selection", href: "/onboarding/product" },
  { name: "Employees", href: "/onboarding/employees" },
  { name: "Infrastructure", href: "/onboarding/infrastructure" },
]

interface StepProgressProps {
  steps: Step[]
}

const StepProgress = ({ steps }: StepProgressProps) => {
  const pathname = usePathname()
  const currentStepIndex = steps.findIndex((step) =>
    pathname.startsWith(step.href),
  )

  return (
    <div className="mx-auto flex w-24 flex-nowrap gap-1 md:w-fit">
      {steps.map((step, index) => (
        <div
          key={step.name}
          className={cx(
            "h-1 w-12 rounded-full",
            index <= currentStepIndex
              ? "bg-blue-500"
              : "bg-gray-300 dark:bg-gray-700",
          )}
        />
      ))}
    </div>
  )
}

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  const scrolled = useScroll(15)

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 isolate z-50 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 transition-all md:grid md:grid-cols-[200px_auto_200px] md:px-6 dark:border-gray-800 dark:bg-gray-900",
          scrolled ? "h-12" : "h-20",
        )}
      >
        <Logo className="hidden w-7 text-blue-500 md:block dark:text-blue-500" />
        <div aria-hidden="true">
          <StepProgress steps={steps} />
        </div>
        <Button variant="ghost" className="ml-auto w-fit" asChild>
          <a href="/reports">Skip to dashboard</a>
        </Button>
      </header>
      <div className="mx-auto mb-20 mt-28 max-w-lg">{children}</div>
    </>
  )
}

export default Layout
