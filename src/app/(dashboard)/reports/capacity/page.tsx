"use client"
import ReportPageLayout from "../_components/ReportPageLayout"
import { FilterDate } from "../_components/FilterDate"
import { FilterUser } from "../_components/FilterUser"
import { DataTable } from "../_components/DataTable"
import { ProgressBar } from "@/components/ProgressBar"
import { BarChartVariant } from "@/components/BarChartVariant"
import { timeEntries, users, tasks } from "@/data/valueAddedVaultData"
import { useQueryState } from "nuqs"
import { useMemo } from "react"
import { exportToCSV } from "@/lib/exportData"
import { formatters } from "@/lib/utils"
import { DEFAULT_RANGE, RANGE_DAYS } from "../_components/dateRanges"
import { RangeKey } from "../_components/dateRanges"

export default function CapacityManagementPage() {
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
    const exportData = capacityData.map(user => {
      return {
        name: user.name,
        totalHours: user.totalHours,
        capacity: user.capacity,
        utilization: user.utilization,
        overUtilized: user.utilization > 100 ? 'Yes' : 'No',
        assignedTasks: user.assignedTasks,
        completedTasks: user.completedTasks,
        pendingTasks: user.pendingTasks
      }
    })
    
    exportToCSV(exportData, `capacity-management-report-${new Date().toISOString().split('T')[0]}`)
  }
  
  // Calculate capacity data for each user
  const capacityData = useMemo(() => {
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
      const hoursLogged = userTimeEntries.reduce((sum, entry) => sum + entry.duration, 0)
      
      // Calculate total capacity for the period
      // Count working days (excluding weekends) in the selected range
      let workingDays = 0
      for (let i = 0; i < daysToSubtract; i++) {
        const date = new Date(currentDate)
        date.setDate(currentDate.getDate() - i)
        // Skip weekends (0 = Sunday, 6 = Saturday)
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          workingDays++
        }
      }
      
      // Calculate capacity based on working days and weekly capacity
      const dailyCapacity = (user.weeklyCapacity || 40) / 5 // Default to 40 hours/week if not specified
      const totalCapacity = dailyCapacity * workingDays
      
      // Calculate utilization percentage
      const utilizationPercentage = totalCapacity > 0 ? (hoursLogged / totalCapacity) * 100 : 0
      
      // Get assigned tasks
      const assignedTasks = tasks.filter(task => 
        task.assigneeIds.includes(user.id) && 
        task.status !== "completed"
      )
      
      // Calculate estimated remaining hours
      const estimatedRemainingHours = assignedTasks.reduce((sum, task) => {
        // If the task has estimated hours, add them to the sum
        if (task.estimatedHours) {
          // For tasks in progress, estimate 50% of hours remaining
          const multiplier = task.status === "inProgress" ? 0.5 : 1
          return sum + (task.estimatedHours * multiplier)
        }
        return sum
      }, 0)
      
      return {
        id: user.id,
        name: user.name,
        department: user.department || "N/A",
        position: user.position || "N/A",
        hoursLogged,
        totalCapacity,
        utilizationPercentage,
        assignedTasksCount: assignedTasks.length,
        estimatedRemainingHours,
      }
    })
  }, [range, selectedUser])
  
  // Prepare data for utilization chart
  const utilizationChartData = useMemo(() => {
    return capacityData
      .map(user => ({
        key: user.name,
        value: Math.min(user.utilizationPercentage, 100), // Cap at 100% for visualization
      }))
      .sort((a, b) => b.value - a.value)
  }, [capacityData])
  
  // Calculate team averages
  const teamAverages = useMemo(() => {
    if (capacityData.length === 0) return { utilization: 0, tasksPerUser: 0 }
    
    const totalUtilization = capacityData.reduce((sum, user) => sum + user.utilizationPercentage, 0)
    const totalTasks = capacityData.reduce((sum, user) => sum + user.assignedTasksCount, 0)
    
    return {
      utilization: totalUtilization / capacityData.length,
      tasksPerUser: totalTasks / capacityData.length,
    }
  }, [capacityData])
  
  return (
    <ReportPageLayout
      title="Capacity Management"
      description="Identify overwork/under-utilization and balance workload"
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
              Team Average Utilization
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {formatters.number({ number: teamAverages.utilization, maxFractionDigits: 1 })}%
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Average Tasks Per User
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {formatters.number({ number: teamAverages.tasksPerUser, maxFractionDigits: 1 })}
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Team Members
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {capacityData.length}
            </p>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-6 text-lg font-semibold">Team Utilization</h2>
          <BarChartVariant
            data={utilizationChartData}
            index="key"
            categories={["value"]}
            colors={["emerald"]}
            valueFormatter={(value) => `${formatters.number({ number: value, maxFractionDigits: 1 })}%`}
            layout="vertical"
            className="h-64"
          />
        </div>
        
        <div>
          <h2 className="mb-4 text-lg font-semibold">Capacity Details</h2>
          <DataTable
            columns={[
              {
                header: "Team Member",
                accessorKey: "name",
              },
              {
                header: "Department",
                accessorKey: "department",
              },
              {
                header: "Hours Logged",
                accessorKey: "hoursLogged",
                cell: (item) => formatters.number({ number: item.hoursLogged }),
                className: "text-right",
              },
              {
                header: "Capacity",
                accessorKey: "totalCapacity",
                cell: (item) => formatters.number({ number: item.totalCapacity }),
                className: "text-right",
              },
              {
                header: "Utilization",
                accessorKey: "utilizationPercentage",
                cell: (item) => (
                  <div className="flex items-center gap-2">
                    <ProgressBar
                      value={item.utilizationPercentage}
                      maxValue={100}
                      className="w-24"
                      showAnimation={false}
                      color={
                        item.utilizationPercentage > 90
                          ? "red"
                          : item.utilizationPercentage > 75
                          ? "amber"
                          : "emerald"
                      }
                    />
                    <span>
                      {formatters.number({
                        number: item.utilizationPercentage,
                        maxFractionDigits: 1,
                      })}
                      %
                    </span>
                  </div>
                ),
              },
              {
                header: "Assigned Tasks",
                accessorKey: "assignedTasksCount",
                className: "text-center",
              },
              {
                header: "Est. Remaining Hours",
                accessorKey: "estimatedRemainingHours",
                cell: (item) => formatters.number({ number: item.estimatedRemainingHours }),
                className: "text-right",
              },
            ]}
            data={capacityData}
            emptyMessage="No capacity data available for the selected filters"
          />
        </div>
      </div>
    </ReportPageLayout>
  )
}