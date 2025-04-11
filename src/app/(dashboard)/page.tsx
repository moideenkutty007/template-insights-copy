"use client"

import { Card } from "@/components/Card"
import { siteConfig } from "@/app/siteConfig"
import Link from "next/link"
import { Clock, Users, UserRound, DollarSign, ArrowRight } from "lucide-react"
import { cx } from "@/lib/utils"

// Sample data for dashboard overview
const dashboardData = {
  teamActivity: {
    totalHours: 1286,
    billablePercentage: 75,
  },
  capacity: {
    teamUtilization: 56.7,
    teamMembers: 6,
    averageTasksPerUser: 1.7,
  },
  employeeEfficiency: {
    avgTaskCompletionRate: 54.8,
    avgBillablePercentage: 75,
  },
  profitability: {
    totalRevenue: 385000,
    totalProfit: 320230,
    profitMargin: 83.2,
  },
}

// Format currency with $ and commas
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

// Format percentage with % symbol
const formatPercentage = (value: number) => {
  return `${value}%`
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Value Added Vault Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of team activity, capacity, efficiency, and profitability
        </p>
      </div>

      {/* Team Activity Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Team Activity</h2>
          <Link 
            href={siteConfig.baseLinks.reports.teamActivity}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
          >
            View Report <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-500" />
                Total Hours
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{dashboardData.teamActivity.totalHours}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">hours logged in the last 60 days</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-500" />
                Billable Percentage
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{formatPercentage(dashboardData.teamActivity.billablePercentage)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">of hours are billable</p>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* Capacity Management Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Capacity Management</h2>
          <Link 
            href={siteConfig.baseLinks.reports.capacity}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
          >
            View Report <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                Team Utilization
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{formatPercentage(dashboardData.capacity.teamUtilization)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">average utilization rate</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                Team Members
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{dashboardData.capacity.teamMembers}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">active team members</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                Tasks Per User
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{dashboardData.capacity.averageTasksPerUser}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">average tasks assigned</p>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* Employee Efficiency Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Employee Efficiency</h2>
          <Link 
            href={siteConfig.baseLinks.reports.employeeEfficiency}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
          >
            View Report <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <UserRound className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-500" />
                Task Completion Rate
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{formatPercentage(dashboardData.employeeEfficiency.avgTaskCompletionRate)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">average task completion rate</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <UserRound className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-500" />
                Billable Percentage
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{formatPercentage(dashboardData.employeeEfficiency.avgBillablePercentage)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">average billable hours percentage</p>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* Profitability Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Project Profitability</h2>
          <Link 
            href={siteConfig.baseLinks.reports.profitability}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-400"
          >
            View Report <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-600 dark:text-green-500" />
                Total Revenue
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{formatCurrency(dashboardData.profitability.totalRevenue)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">total revenue generated</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-600 dark:text-green-500" />
                Total Profit
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{formatCurrency(dashboardData.profitability.totalProfit)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">total profit generated</p>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5 text-green-600 dark:text-green-500" />
                Profit Margin
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <p className="text-3xl font-bold">{formatPercentage(dashboardData.profitability.profitMargin)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">average profit margin</p>
            </Card.Content>
          </Card>
        </div>
      </section>
    </div>
  )
}