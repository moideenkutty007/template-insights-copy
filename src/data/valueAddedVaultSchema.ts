import { z } from "zod"

// User Schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string().email(),
  costRate: z.number().optional(), // Hourly cost rate for profitability calculations
  department: z.string().optional(),
  position: z.string().optional(),
  avatar: z.string().optional(),
  weeklyCapacity: z.number().optional(), // Weekly capacity in hours
})

export type User = z.infer<typeof userSchema>

// Client Schema
export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  industry: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  status: z.enum(["active", "inactive", "prospect"]).optional(),
})

export type Client = z.infer<typeof clientSchema>

// Project Schema
export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  managerId: z.string(),
  startDate: z.string(), // ISO date string
  dueDate: z.string(), // ISO date string
  status: z.enum(["planning", "active", "completed", "onHold", "cancelled"]),
  budget: z.number().optional(), // Total budget amount
  revenue: z.number().optional(), // Expected revenue
  description: z.string().optional(),
})

export type Project = z.infer<typeof projectSchema>

// Task Schema
export const taskSchema = z.object({
  id: z.string(),
  name: z.string(),
  projectId: z.string(),
  assigneeIds: z.array(z.string()), // Can be assigned to multiple users
  dueDate: z.string().optional(), // ISO date string
  status: z.enum(["todo", "inProgress", "review", "completed"]),
  estimatedHours: z.number().optional(), // Estimated effort in hours
  priority: z.enum(["low", "medium", "high"]).optional(),
  description: z.string().optional(),
})

export type Task = z.infer<typeof taskSchema>

// Time Entry Schema
export const timeEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  taskId: z.string().optional(),
  projectId: z.string(),
  date: z.string(), // ISO date string
  duration: z.number(), // Duration in hours
  description: z.string().optional(),
  billable: z.boolean().default(true),
})

export type TimeEntry = z.infer<typeof timeEntrySchema>

// User Roles
export const userRoles = [
  {
    value: "superAdmin",
    label: "Super Admin",
  },
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "manager",
    label: "Manager",
  },
  {
    value: "employee",
    label: "Employee",
  },
]

// Project Statuses
export const projectStatuses = [
  {
    value: "planning",
    label: "Planning",
    variant: "neutral",
  },
  {
    value: "active",
    label: "Active",
    variant: "success",
  },
  {
    value: "completed",
    label: "Completed",
    variant: "info",
  },
  {
    value: "onHold",
    label: "On Hold",
    variant: "warning",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    variant: "error",
  },
]

// Task Statuses
export const taskStatuses = [
  {
    value: "todo",
    label: "To Do",
    variant: "neutral",
  },
  {
    value: "inProgress",
    label: "In Progress",
    variant: "info",
  },
  {
    value: "review",
    label: "Review",
    variant: "warning",
  },
  {
    value: "completed",
    label: "Completed",
    variant: "success",
  },
]