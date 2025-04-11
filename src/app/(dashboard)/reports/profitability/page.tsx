"use client"
import ReportPageLayout from "../_components/ReportPageLayout"
import { FilterDate } from "../_components/FilterDate"
import { FilterClient } from "../_components/FilterClient"
import { FilterProject } from "../_components/FilterProject"
import { DataTable } from "../_components/DataTable"
import { BarChartVariant } from "@/components/BarChartVariant"
import { timeEntries, users, projects, clients } from "@/data/valueAddedVaultData"
import { useQueryState } from "nuqs"
import { useMemo } from "react"
import { exportToCSV } from "@/lib/exportData"
import { formatters } from "@/lib/utils"
import { DEFAULT_RANGE, RANGE_DAYS } from "../_components/dateRanges"
import { RangeKey } from "../_components/dateRanges"
import { Badge } from "@/components/Badge"
import { TabNavigation } from "@/components/TabNavigationNew"

export default function ProfitabilityPage() {
  const [range] = useQueryState<RangeKey>("range", {
    defaultValue: DEFAULT_RANGE,
    parse: (value): RangeKey =>
      Object.keys(RANGE_DAYS).includes(value)
        ? (value as RangeKey)
        : DEFAULT_RANGE,
  })
  const [selectedClient] = useQueryState("client")
  const [selectedProject] = useQueryState("project")
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "clients",
  })
  
  // Reset filters function
  const handleResetFilters = async () => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.delete('client')
    searchParams.delete('project')
    searchParams.set('range', DEFAULT_RANGE)
    searchParams.set('tab', 'clients')
    window.location.search = searchParams.toString()
  }
  
  // Export data function
  const handleExportData = () => {
    // Export data based on active tab
    if (activeTab === 'clients') {
      const exportData = clientProfitabilityData.map(client => {
        return {
          name: client.name,
          totalProjects: client.totalProjects,
          totalHours: client.totalHours,
          totalBudget: client.totalBudget,
          totalCost: client.totalCost,
          totalRevenue: client.totalRevenue,
          profit: client.profit,
          profitMargin: client.profitMargin,
          roi: client.roi
        }
      })
      
      exportToCSV(exportData, `client-profitability-report-${new Date().toISOString().split('T')[0]}`)
    } else {
      const exportData = projectProfitabilityData.map(project => {
        return {
          name: project.name,
          client: project.clientName,
          status: project.status,
          totalHours: project.totalHours,
          budget: project.budget,
          totalCost: project.totalCost,
          revenue: project.revenue,
          profit: project.profit,
          profitMargin: project.profitMargin,
          budgetUtilization: project.budgetUtilization
        }
      })
      
      exportToCSV(exportData, `project-profitability-report-${new Date().toISOString().split('T')[0]}`)
    }
  }
  
  // Calculate client profitability data
  const clientProfitabilityData = useMemo(() => {
    const currentDate = new Date()
    const filterDate = new Date(currentDate)
    const daysToSubtract = RANGE_DAYS[range as keyof typeof RANGE_DAYS] || RANGE_DAYS[DEFAULT_RANGE]
    filterDate.setDate(currentDate.getDate() - daysToSubtract)
    
    // Filter clients if a specific client is selected
    const filteredClients = selectedClient 
      ? clients.filter(client => client.id === selectedClient)
      : clients;
    
    return filteredClients.map(client => {
      // Get all projects for this client
      const clientProjects = projects.filter(project => project.clientId === client.id)
      
      // Calculate total budget and revenue for all client projects
      const totalBudget = clientProjects.reduce((sum, project) => sum + (project.budget || 0), 0)
      const totalRevenue = clientProjects.reduce((sum, project) => sum + (project.revenue || 0), 0)
      
      // Get all time entries for this client's projects in the selected date range
      let totalHours = 0
      let totalCost = 0
      
      clientProjects.forEach(project => {
        const projectTimeEntries = timeEntries.filter(entry => {
          const entryDate = new Date(entry.date)
          return entry.projectId === project.id && entryDate >= filterDate
        })
        
        // Calculate hours and cost
        projectTimeEntries.forEach(entry => {
          totalHours += entry.duration
          
          // Find user cost rate
          const user = users.find(u => u.id === entry.userId)
          if (user && user.costRate) {
            totalCost += entry.duration * user.costRate
          }
        })
      })
      
      // Calculate profit and margin
      const profit = totalRevenue - totalCost
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0
      
      // Calculate ROI
      const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
      
      return {
        id: client.id,
        name: client.name,
        industry: client.industry || "N/A",
        projectCount: clientProjects.length,
        totalHours,
        totalCost,
        totalBudget,
        totalRevenue,
        profit,
        profitMargin,
        roi,
      }
    })
  }, [range, selectedClient])
  
  // Calculate project profitability data
  const projectProfitabilityData = useMemo(() => {
    const currentDate = new Date()
    const filterDate = new Date(currentDate)
    const daysToSubtract = RANGE_DAYS[range as keyof typeof RANGE_DAYS] || RANGE_DAYS[DEFAULT_RANGE]
    filterDate.setDate(currentDate.getDate() - daysToSubtract)
    
    // Filter projects based on selected client and project
    let filteredProjects = projects
    
    if (selectedClient) {
      filteredProjects = filteredProjects.filter(project => project.clientId === selectedClient)
    }
    
    if (selectedProject) {
      filteredProjects = filteredProjects.filter(project => project.id === selectedProject)
    }
    
    return filteredProjects.map(project => {
      // Find client
      const client = clients.find(c => c.id === project.clientId)
      
      // Get all time entries for this project in the selected date range
      const projectTimeEntries = timeEntries.filter(entry => {
        const entryDate = new Date(entry.date)
        return entry.projectId === project.id && entryDate >= filterDate
      })
      
      // Calculate hours and cost
      let totalHours = 0
      let totalCost = 0
      
      projectTimeEntries.forEach(entry => {
        totalHours += entry.duration
        
        // Find user cost rate
        const user = users.find(u => u.id === entry.userId)
        if (user && user.costRate) {
          totalCost += entry.duration * user.costRate
        }
      })
      
      // Calculate budget utilization
      const budgetUtilization = project.budget ? (totalCost / project.budget) * 100 : 0
      
      // Calculate profit and margin
      const profit = (project.revenue || 0) - totalCost
      const profitMargin = project.revenue ? (profit / project.revenue) * 100 : 0
      
      // Calculate ROI
      const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0
      
      return {
        id: project.id,
        name: project.name,
        clientName: client?.name || "Unknown",
        status: project.status,
        totalHours,
        totalCost,
        budget: project.budget || 0,
        revenue: project.revenue || 0,
        budgetUtilization,
        profit,
        profitMargin,
        roi,
      }
    })
  }, [range, selectedClient, selectedProject])
  
  // Prepare data for client profitability chart
  const clientProfitabilityChartData = useMemo(() => {
    return clientProfitabilityData
      .map(client => ({
        key: client.name,
        value: client.profit,
      }))
      .sort((a, b) => b.value - a.value)
  }, [clientProfitabilityData])
  
  // Prepare data for project profitability chart
  const projectProfitabilityChartData = useMemo(() => {
    return projectProfitabilityData
      .map(project => ({
        key: project.name,
        value: project.profit,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Show top 10 projects
  }, [projectProfitabilityData])
  
  // Calculate overall profitability
  const overallProfitability = useMemo(() => {
    const totalRevenue = clientProfitabilityData.reduce((sum, client) => sum + client.totalRevenue, 0)
    const totalCost = clientProfitabilityData.reduce((sum, client) => sum + client.totalCost, 0)
    const totalProfit = totalRevenue - totalCost
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    const roi = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0
    
    return {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      roi,
    }
  }, [clientProfitabilityData])
  
  return (
    <ReportPageLayout
      title="Client vs Project Profitability"
      description="Evaluate client relationships and project performance"
      filters={
        <>
          <FilterDate />
          <FilterClient />
          <FilterProject />
        </>
      }
      onResetFilters={handleResetFilters}
      onExportData={handleExportData}
    >
      <div className="space-y-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Revenue
            </h3>
            <p className="mt-2 text-3xl font-bold">
              {formatters.currency({ number: overallProfitability.totalRevenue, maxFractionDigits: 0 })}
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Profit
            </h3>
            <p className={`mt-2 text-3xl font-bold ${overallProfitability.totalProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatters.currency({ number: overallProfitability.totalProfit, maxFractionDigits: 0 })}
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Profit Margin
            </h3>
            <p className={`mt-2 text-3xl font-bold ${overallProfitability.profitMargin >= 20 ? "text-emerald-600" : overallProfitability.profitMargin >= 10 ? "text-amber-600" : "text-red-600"}`}>
              {new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(overallProfitability.profitMargin)}%
            </p>
          </div>
        </div>
        
        <div>
          <TabNavigation
            value={activeTab || "clients"}
            onValueChange={(value) => setActiveTab(value)}
            items={[
              {
                value: "clients",
                label: "Clients",
              },
              {
                value: "projects",
                label: "Projects",
              },
            ]}
          />
          
          <div className="mt-6">
            {activeTab === "clients" ? (
              <div className="space-y-8">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="mb-6 text-lg font-semibold">Client Profitability</h2>
                  <BarChartVariant
                    data={clientProfitabilityChartData}
                    index="key"
                    categories={["value"]}
                    colors={["purple"]}
                    valueFormatter={(value) => formatters.currency({ number: value, maxFractionDigits: 0 })}
                    layout="vertical"
                    className="h-64"
                  />
                </div>
                
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Client Profitability Details</h2>
                  <DataTable
                    columns={[
                      {
                        header: "Client",
                        accessorKey: "name",
                      },
                      {
                        header: "Industry",
                        accessorKey: "industry",
                      },
                      {
                        header: "Projects",
                        accessorKey: "projectCount",
                        className: "text-center",
                      },
                      {
                        header: "Hours",
                        accessorKey: "totalHours",
                        cell: (item) => formatters.number({ number: item.totalHours }),
                        className: "text-right",
                      },
                      {
                        header: "Cost",
                        accessorKey: "totalCost",
                        cell: (item) => formatters.currency({ number: item.totalCost, maxFractionDigits: 0 }),
                        className: "text-right",
                      },
                      {
                        header: "Revenue",
                        accessorKey: "totalRevenue",
                        cell: (item) => formatters.currency({ number: item.totalRevenue, maxFractionDigits: 0 }),
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
                        header: "ROI",
                        accessorKey: "roi",
                        cell: (item) => (
                          <Badge 
                            variant={item.roi >= 50 ? "success" : item.roi >= 20 ? "warning" : "error"}
                            size="sm"
                          >
                            {formatters.number({ number: item.roi, maxFractionDigits: 1 })}%
                          </Badge>
                        ),
                        className: "text-center",
                      },
                    ]}
                    data={clientProfitabilityData}
                    emptyMessage="No client profitability data available for the selected filters"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h2 className="mb-6 text-lg font-semibold">Top 10 Project Profitability</h2>
                  <BarChartVariant
                    data={projectProfitabilityChartData}
                    index="key"
                    categories={["value"]}
                    colors={["indigo"]}
                    valueFormatter={(value) => formatters.currency({ number: value, maxFractionDigits: 0 })}
                    layout="vertical"
                    className="h-64"
                  />
                </div>
                
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Project Profitability Details</h2>
                  <DataTable
                    columns={[
                      {
                        header: "Project",
                        accessorKey: "name",
                      },
                      {
                        header: "Client",
                        accessorKey: "clientName",
                      },
                      {
                        header: "Status",
                        accessorKey: "status",
                        cell: (item) => (
                          <Badge 
                            variant={
                              item.status === "completed" ? "success" : 
                              item.status === "active" ? "info" :
                              item.status === "planning" ? "neutral" :
                              item.status === "onHold" ? "warning" : "error"
                            }
                            size="sm"
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        ),
                      },
                      {
                        header: "Hours",
                        accessorKey: "totalHours",
                        cell: (item) => formatters.number({ number: item.totalHours }),
                        className: "text-right",
                      },
                      {
                        header: "Cost",
                        accessorKey: "totalCost",
                        cell: (item) => formatters.currency({ number: item.totalCost, maxFractionDigits: 0 }),
                        className: "text-right",
                      },
                      {
                        header: "Budget",
                        accessorKey: "budget",
                        cell: (item) => formatters.currency({ number: item.budget, maxFractionDigits: 0 }),
                        className: "text-right",
                      },
                      {
                        header: "Budget Used",
                        accessorKey: "budgetUtilization",
                        cell: (item) => (
                          <Badge 
                            variant={item.budgetUtilization <= 90 ? "success" : item.budgetUtilization <= 110 ? "warning" : "error"}
                            size="sm"
                          >
                            {formatters.number({ number: item.budgetUtilization, maxFractionDigits: 1 })}%
                          </Badge>
                        ),
                        className: "text-center",
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
                    ]}
                    data={projectProfitabilityData}
                    emptyMessage="No project profitability data available for the selected filters"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReportPageLayout>
  )
}