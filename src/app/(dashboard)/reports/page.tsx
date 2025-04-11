import { Card } from "@/components/Card"
import ReportPageLayout from "./_components/ReportPageLayout"
import Link from "next/link"
import { BarChart, Clock, Users, DollarSign } from "lucide-react"

export default function Page() {
  const reports = [
    {
      title: "Team Activity & Time Tracking",
      description: "Track time utilization and team productivity",
      href: "/reports/team-activity",
      icon: <Clock className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Capacity Management",
      description: "Identify overwork/under-utilization and balance workload",
      href: "/reports/capacity",
      icon: <Users className="h-6 w-6 text-emerald-500" />,
    },
    {
      title: "Employee Efficiency & Profitability",
      description: "Measure employee productivity and value generation",
      href: "/reports/employee-efficiency",
      icon: <BarChart className="h-6 w-6 text-orange-500" />,
    },
    {
      title: "Client vs Project Profitability",
      description: "Evaluate client relationships and project performance",
      href: "/reports/profitability",
      icon: <DollarSign className="h-6 w-6 text-purple-500" />,
    },
  ]

  return (
    <>
      <ReportPageLayout
        title="Reports"
        description="Access detailed insights into team activity, capacity, efficiency, and profitability"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reports.map((report) => (
            <Link href={report.href} key={report.href}>
              <Card className="h-full transition-all hover:border-blue-500 hover:shadow-md">
                <Card.Header className="flex flex-row items-center justify-between pb-2">
                  <Card.Title>{report.title}</Card.Title>
                  {report.icon}
                </Card.Header>
                <Card.Content>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.description}
                  </p>
                </Card.Content>
              </Card>
            </Link>
          ))}
        </div>
      </ReportPageLayout>
    </>
  )
}
