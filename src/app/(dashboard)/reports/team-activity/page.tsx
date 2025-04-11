"use client"
import ReportPageLayout from "../_components/ReportPageLayout"
import { FilterDate } from "../_components/FilterDate"
import { FilterUser } from "../_components/FilterUser"
import { FilterProject } from "../_components/FilterProject"
import { DataTable } from "../_components/DataTable"
import { BarChartVariant } from "@/components/BarChartVariant"
import { timeEntries, users, projects, tasks } from "@/data/valueAddedVaultData"
import { useQueryState } from "nuqs"
import { useMemo } from "react"
import { exportToCSV, exportToJSON } from "@/lib/exportData"
import { formatters } from "@/lib/utils"
import { DEFAULT_RANGE, RANGE_DAYS } from "../_components/dateRanges"
import { RangeKey } from "../_components/dateRanges"

export default function TeamActivityPage() {
  const [range] = useQueryState<RangeKey>("range", {
    defaultValue: DEFAULT_RANGE,
    parse: (value): RangeKey =>
      Object.keys(RANGE_DAYS).includes(value)
        ? (value as RangeKey)
        : DEFAULT_RANGE,
  })
  const [selectedUser] = useQueryState("user")
  const [selectedProject] = useQueryState("project")
  
  // Reset filters function
  const handleResetFilters = async () => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete('user')
    searchParams.delete('project')
    searchParams.set('range', DEFAULT_RANGE)
    window.location.search = searchParams.toString()
  }
  
  // Export data function
  const handleExportData = () => {
    const exportData = filteredTimeEntries.map(entry => {
      const user = users.find(u => u.id === entry.userId)
      const project = projects.find(p => p.id === entry.projectId)
      const task = tasks.find(t => t.id === entry.taskId)
      
      return {
        date: entry.date,
        hours: entry.hours,
        user: user?.name || 'Unknown',
        project: project?.name || 'Unknown',
        task: task?.name || 'Unknown',
        billable: entry.billable ? 'Yes' : 'No',
        notes: entry.notes || ''
      }
    })
    
    exportToCSV(exportData, `team-activity-report-${new Date().toISOString().split('T')[0]}`)
  }
  
  // Filter time entries based on selected filters
  const filteredTimeEntries = useMemo(() => {
    const currentDate = new Date()
    const filterDate = new Date(currentDate)
    const daysToSubtract = RANGE_DAYS[range as keyof typeof RANGE_DAYS] || RANGE_DAYS[DEFAULT_RANGE]
    filterDate.setDate(currentDate.getDate() - daysToSubtract)
    
    return timeEntries.filter(entry => {
      const entryDate = new Date(entry.date)
      return (
        entryDate >= filterDate &&
        (!selectedUser || entry.userId === selectedUser) &&
        (!selectedProject || entry.projectId === selectedProject)
      )
    })
  }, [range, selectedUser, selectedProject])
  
  // Prepare data for the time entries table
  const tableData = useMemo(() => {
    return filteredTimeEntries.map(entry => {
      const user = users.find(u => u.id === entry.userId)
      const project = projects.find(p => p.id === entry.projectId)
      const task = tasks.find(t => t.id === entry.taskId)
      
      return {
        ...entry,
        userName: user?.name || 'Unknown',
        projectName: project?.name || 'Unknown',
        taskName: task?.name || 'Unknown',
      }
    })
  }, [filteredTimeEntries])
  
  // Prepare data for user time chart
  const userTimeChartData = useMemo(() => {
    const userTotals: Record<string, number> = {}
    
    filteredTimeEntries.forEach(entry => {
      const user = users.find(u => u.id === entry.userId)
      if (user) {
        userTotals[user.name] = (userTotals[user.name] || 0) + entry.duration
      }
    })
    
    return Object.entries(userTotals)
      .map(([name, value]) => ({ key: name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredTimeEntries])
  
  // Prepare data for project time chart
  const projectTimeChartData = useMemo(() => {
    const projectTotals: Record<string, number> = {}
    
    filteredTimeEntries.forEach(entry => {
      const project = projects.find(p => p.id === entry.projectId)
      if (project) {
        projectTotals[project.name] = (projectTotals[project.name] || 0) + entry.duration
      }
    })
    
    return Object.entries(projectTotals)
      .map(([name, value]) => ({ key: name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filteredTimeEntries])
  
  // Calculate total hours
  const totalHours = useMemo(() => {
    return filteredTimeEntries.reduce((sum, entry) => sum + entry.duration, 0)
  }, [filteredTimeEntries])
  
  return (
    <ReportPageLayout
      title="Team Activity & Time Tracking"
      description="Track time utilization and team productivity"
      filters={
        <>
          <FilterDate />
          <FilterUser />
          <FilterProject />
        </>
      }
      onResetFilters={handleResetFilters}
      onExportData={handleExportData}
    >
      <div className="space-y-12">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-2 text-lg font-semibold">Time Summary</h2>
          <p className="mb-6 text-3xl font-bold">
            {formatters.number({ number: totalHours })} hours
          </p>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                Hours by Team Member
              </h3>
              <BarChartVariant
                data={userTimeChartData}
                index="key"
                categories={["value"]}
                colors={["blue"]}
                valueFormatter={(value) => `${value} hrs`}
                layout="vertical"
                className="h-64"
              />
            </div>
            
            <div>
              <h3 className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                Hours by Project
              </h3>
              <BarChartVariant
                data={projectTimeChartData}
                index="key"
                categories={["value"]}
                colors={["emerald"]}
                valueFormatter={(value) => `${value} hrs`}
                layout="vertical"
                className="h-64"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="mb-4 text-lg font-semibold">Time Entries</h2>
          <DataTable
            columns={[
              {
                header: "Date",
                accessorKey: "date",
                cell: (item) => new Date(item.date).toLocaleDateString(),
              },
              {
                header: "Team Member",
                accessorKey: "userName",
              },
              {
                header: "Project",
                accessorKey: "projectName",
              },
              {
                header: "Task",
                accessorKey: "taskName",
              },
              {
                header: "Hours",
                accessorKey: "duration",
                cell: (item) => formatters.number({ number: item.duration }),
                className: "text-right",
              },
              {
                header: "Billable",
                accessorKey: "billable",
                cell: (item) => (item.billable ? "Yes" : "No"),
              },
            ]}
            data={tableData}
            emptyMessage="No time entries found for the selected filters"
          />
        </div>
      </div>
    </ReportPageLayout>
  )
}