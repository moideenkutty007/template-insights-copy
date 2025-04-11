// Tremor Raw Card [v0.0.1]

import { Slot } from "@radix-ui/react-slot"
import React from "react"

import { cx } from "@/lib/utils"

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, asChild, ...props }, forwardedRef) => {
    const Component = asChild ? Slot : "div"
    return (
      <Component
        ref={forwardedRef}
        className={cx(
          // base
          "relative w-full rounded-lg border p-6 text-left shadow-sm",
          // background color
          "bg-white dark:bg-[#090E1A]",
          // border color
          "border-gray-200 dark:border-gray-900",
          className,
        )}
        tremor-id="tremor-raw"
        {...props}
      />
    )
  },
)

Card.displayName = "Card"

// Card Header Component
interface CardHeaderProps extends React.ComponentPropsWithoutRef<"div"> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cx("flex flex-col space-y-1.5 pb-4", className)}
        {...props}
      />
    )
  }
)
CardHeader.displayName = "CardHeader"

// Card Title Component
interface CardTitleProps extends React.ComponentPropsWithoutRef<"h3"> {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cx(
          "text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-50",
          className
        )}
        {...props}
      />
    )
  }
)
CardTitle.displayName = "CardTitle"

// Card Content Component
interface CardContentProps extends React.ComponentPropsWithoutRef<"div"> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cx("pt-0", className)} {...props} />
    )
  }
)
CardContent.displayName = "CardContent"

// Attach subcomponents to Card
Card.Header = CardHeader
Card.Title = CardTitle
Card.Content = CardContent

export { Card, type CardProps }
