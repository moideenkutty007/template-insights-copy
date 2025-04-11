"use client"
import ReportPageLayout from "../_components/ReportPageLayout"
import { FilterDate } from "../_components/FilterDate"
import { FilterUser } from "../_components/FilterUser"
import { DataTable } from "../_components/DataTable"
import { BarChartVariant } from "@/components/BarChartVariant"
import { timeEntries, users, tasks, projects } from "@/data/valueAddedVaultData"
import { useQueryState } from "nuqs"
import { useMemo } from "react"
import { exportToCSV } from "@/lib/exportData"
import { formatters } from "@/lib/utils"
import { DEFAULT_RANGE, RANGE_DAYS } from "../_components/dateRanges"
import { RangeKey } from "../_components/dateRanges"
import { Badge } from "@/components/Badge"

export default function EmployeeEfficiencyPage() {
  const [range] = useQueryState<RangeKey>("range", {
    defaultValue: DEFAULT_RANGE,
    parse: (value): RangeKey =>
      Object.keys(RANGE_DAYS).includes(value)
        ? (value as RangeKey)
        : DEFAULT_RANGE,
  })
  const [selectedUser] = useQueryState("user")
  
  // Reset filters function
  const handleResetFilters = async () => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete('user')
    searchParams.set('range', DEFAULT_RANGE)
    window.location.search = searchParams.toString()
  }
  
  // Export data function
  const handleExportData = () => {
    const exportData = efficiencyData.map(user => {
      return {
        name: user.name,
        totalHours: user.totalHours,
        billableHours: user.billableHours,
        nonBillableHours: user.nonBillableHours,
        billablePercentage: user.billablePercentage,
        costRate: user.costRate,
        totalCost: user.totalCost,
        totalRevenue: user.totalRevenue,
        profitMargin: user.profitMargin,
        taskCompletionRate: user.taskCompletionRate,
        completedTasks: user.completedTasks,
        totalTasks: user.totalTasks
      }
    })
    
    exportToCSV(exportData, `employee-efficiency-report-${new Date().toISOString().split('T')[0]}`)
  }
  
  // Calculate efficiency and profitability data for each user
  const efficiencyData = useMemo(() => {
    const currentDate = new Date()
    const filterDate = new Date(currentDate)
    const daysToSubtract = RANGE_DAYS[range as keyof typeof RANGE_DAYS] || RANGE_DAYS[DEFAULT_RANGE]
    filterDate.setDate(currentDate.getDate() - daysToSubtract)
    
    // Filter users if a specific user is selected
    const filteredUsers = selectedUser 
      ? users.filter(user => user.id === selectedUser)
      : users;
    
    return filteredUsers.map(user => {
      // Get all time entries for this user in the selected date range
      const userTimeEntries = timeEntries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entry.userId === user.id && entryDate >= filterDate
      })
      
      // Calculate total hours logged
      const totalHours = userTimeEntries.reduce((sum, entry) => sum + entry.duration, 0)
      
      // Calculate billable vs non-billable hours
      const billableHours = userTimeEntries
        .filter(entry => entry.billable)
        .reduce((sum, entry) => sum + entry.duration, 0)
      
      const nonBillableHours = totalHours - billableHours
      
      // Calculate billable percentage
      const billablePercentage = totalHours > 0 ? (billableHours / totalHours) * 100 : 0
      
      // Calculate cost (based on user's cost rate)
      const cost = totalHours * (user.costRate || 0)
      
      // Calculate revenue generated
      let revenue = 0
      
      // For each time entry, find the associated project and calculate revenue
      userTimeEntries.forEach(entry => {
        if (entry.billable) {
          const project = projects.find(p => p.id === entry.projectId)
          if (project && project.revenue && project.budget) {
            // Calculate revenue per hour for this project
            const projectRevenuePerHour = project.revenue / project.budget
            revenue += entry.duration * projectRevenuePerHour
          }
        }
      })
      
      // Calculate profit
      const profit = revenue - cost
      
      // Calculate profit margin
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0
      
      // Calculate task completion metrics
      const assignedTasks = tasks.filter(task => 
        task.assigneeIds.includes(user.id)
      )
      
      const completedTasks = assignedTasks.filter(task => 
        task.status === "completed"
      )
      
      const taskCompletionRate = assignedTasks.length > 0 
        ? (completedTasks.length / assignedTasks.length) * 100 
        : 0
      
      return {
        id: user.id,
        name: user.name,
        department: user.department || "N/A",
        position: user.position || "N/A",
        totalHours,
        billableHours,
        nonBillableHours,
        billablePercentage,
        cost,
        revenue,
        profit,
        profitMargin,
        assignedTasksCount: assignedTasks.length,
        completedTasksCount: completedTasks.length,
        taskCompletionRate,
      }
    })
  }, [range, selectedUser])
  
  // Prepare data for profitability chart
  const profitabilityChartData = useMemo(() => {
    return efficiencyData
      .map(user => ({
        key: user.name,
        value: user.profit,
      }))
      .sort((a, b) => b.value - a.value)
  }, [efficiencyData])
  
  // Prepare data for billable percentage chart
  const billablePercentageChartData = useMemo(() => {
    return efficiencyData
      .map(user => ({
        key: user.name,
        value: user.billablePercentage,
      }))
      .sort((a, b) => b.value - a.value)
  }, [efficiencyData])
  
  // Calculate team averages
  const teamAverages = useMemo(() => {
    if (efficiencyData.length === 0) return { 
      billablePercentage: 0, 
      profitMargin: 0,
      taskCompletionRate: 0
    }
    
    const totalBillablePercentage = efficiencyData.reduce((sum, user) => sum + user.billablePercentage, 0)
    const totalProfitMargin = efficiencyData.reduce((sum, user) => sum + user.profitMargin, 0)
    const totalTaskCompletionRate = efficiencyData.reduce((sum, user) => sum + user.taskCompletionRate, 0)
    
    return {
      billablePercentage: totalBillablePercentage / efficiencyData.length,
      profitMargin: totalProfitMargin / efficiencyData.length,
      taskCompletionRate: totalTaskCompletionRate / efficiencyData.length,
    }
  }, [efficiencyData])
  
  return (
    <ReportPageLayout
      title="Employee Efficiency & Profitability"
      description="Measure employee productivity and value generation"
      filters={
        <>
          <FilterDate />
          <FilterUser />
        </>
      }
      onResetFilters={handleResetFilters}
      onExportData={handleExportData}
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg. Billable Percentage
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {formatters.number({ number: teamAverages.billablePercentage, maxFractionDigits: 1 })}%
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg. Profit Margin
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {formatters.number({ number: teamAverages.profitMargin, maxFractionDigits: 1 })}%
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg. Task Completion Rate
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {formatters.number({ number: teamAverages.taskCompletionRate, maxFractionDigits: 1 })}%
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-6 text-lg font-semibold">Profit by Employee</h2>
            <BarChartVariant
              data={profitabilityChartData}
              index="key"
              categories={["value"]}
              colors={["orange"]}
              valueFormatter={(value) => formatters.currency({ number: value, maxFractionDigits: 0 })}
              layout="vertical"
              className="h-64"
            />
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-6 text-lg font-semibold">Billable Percentage by Employee</h2>
            <BarChartVariant
              data={billablePercentageChartData}
              index="key"
              categories={["value"]}
              colors={["blue"]}
              valueFormatter={(value) => `${formatters.number({ number: value, maxFractionDigits: 1 })}%`}
              layout="vertical"
              className="h-64"
            />
          </div>
        </div>
        
        <div>
          <h2 className="mb-4 text-lg font-semibold">Employee Efficiency Details</h2>
          <DataTable
            columns={[
              {
                header: "Employee",
                accessorKey: "name",
              },
              {
                header: "Department",
                accessorKey: "department",
              },
              {
                header: "Billable Hours",
                accessorKey: "billableHours",
                cell: (item) => (
                  <div className="flex items-center gap-2">
                    <span>{formatters.number({ number: item.billableHours })}</span>
                    <Badge variant="success" size="sm">
                      {formatters.number({ number: item.billablePercentage, maxFractionDigits: 1 })}%
                    </Badge>
                  </div>
                ),
                className: "text-right",
              },
              {
                header: "Cost",
                accessorKey: "cost",
                cell: (item) => formatters.currency({ number: item.cost, maxFractionDigits: 0 }),
                className: "text-right",
              },
              {
                header: "Revenue",
                accessorKey: "revenue",
                cell: (item) => formatters.currency({ number: item.revenue, maxFractionDigits: 0 }),
                className: "text-right",
              },
              {
                header: "Profit",
                accessorKey: "profit",
                cell: (item) => (
                  <span className={item.profit >= 0 ? "text-emerald-600" : "text-red-600"}>
                    {formatters.currency({ number: item.profit, maxFractionDigits: 0 })}
                  </span>
                ),
                className: "text-right",
              },
              {
                header: "Margin",
                accessorKey: "profitMargin",
                cell: (item) => (
                  <Badge 
                    variant={item.profitMargin >= 30 ? "success" : item.profitMargin >= 15 ? "warning" : "error"}
                    size="sm"
                  >
                    {formatters.number({ number: item.profitMargin, maxFractionDigits: 1 })}%
                  </Badge>
                ),
                className: "text-center",
              },
              {
                header: "Task Completion",
                accessorKey: "taskCompletionRate",
                cell: (item) => (
                  <div className="flex items-center gap-2">
                    <span>{item.completedTasksCount}/{item.assignedTasksCount}</span>
                    <Badge 
                      variant={item.taskCompletionRate >= 75 ? "success" : item.taskCompletionRate >= 50 ? "warning" : "error"}
                      size="sm"
                    >
                      {formatters.number({ number: item.taskCompletionRate, maxFractionDigits: 1 })}%
                    </Badge>
                  </div>
                ),
              },
            ]}
            data={efficiencyData}
            emptyMessage="No efficiency data available for the selected filters"
          />
        </div>
      </div>
    </ReportPageLayout>
  )
}