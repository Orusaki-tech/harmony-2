"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Download, Users, DollarSign, TrendingUp, BarChart3, Activity } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ReportData {
  employeeGrowth: Array<{ month: string; employees: number; hires: number; departures: number }>
  departmentDistribution: Array<{ name: string; value: number; color: string }>
  payrollTrends: Array<{ month: string; total: number; average: number }>
  leaveAnalytics: Array<{ type: string; count: number; approved: number; pending: number }>
  performanceMetrics: Array<{ metric: string; current: number; target: number; trend: string }>
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("last-12-months")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  useEffect(() => {
    const fetchReportData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setReportData({
        employeeGrowth: [
          { month: "Jan", employees: 45, hires: 3, departures: 1 },
          { month: "Feb", employees: 48, hires: 4, departures: 1 },
          { month: "Mar", employees: 52, hires: 5, departures: 1 },
          { month: "Apr", employees: 55, hires: 4, departures: 1 },
          { month: "May", employees: 58, hires: 4, departures: 1 },
          { month: "Jun", employees: 62, hires: 5, departures: 1 },
          { month: "Jul", employees: 65, hires: 4, departures: 1 },
          { month: "Aug", employees: 68, hires: 4, departures: 1 },
          { month: "Sep", employees: 71, hires: 4, departures: 1 },
          { month: "Oct", employees: 74, hires: 4, departures: 1 },
          { month: "Nov", employees: 76, hires: 3, departures: 1 },
          { month: "Dec", employees: 78, hires: 3, departures: 1 },
        ],
        departmentDistribution: [
          { name: "Engineering", value: 32, color: "#ef4444" },
          { name: "Sales", value: 18, color: "#f97316" },
          { name: "Marketing", value: 12, color: "#eab308" },
          { name: "HR", value: 8, color: "#22c55e" },
          { name: "Finance", value: 6, color: "#3b82f6" },
          { name: "Operations", value: 2, color: "#8b5cf6" },
        ],
        payrollTrends: [
          { month: "Jan", total: 2250000, average: 50000 },
          { month: "Feb", total: 2400000, average: 50000 },
          { month: "Mar", total: 2600000, average: 50000 },
          { month: "Apr", total: 2750000, average: 50000 },
          { month: "May", total: 2900000, average: 50000 },
          { month: "Jun", total: 3100000, average: 50000 },
          { month: "Jul", total: 3250000, average: 50000 },
          { month: "Aug", total: 3400000, average: 50000 },
          { month: "Sep", total: 3550000, average: 50000 },
          { month: "Oct", total: 3700000, average: 50000 },
          { month: "Nov", total: 3800000, average: 50000 },
          { month: "Dec", total: 3900000, average: 50000 },
        ],
        leaveAnalytics: [
          { type: "Annual Leave", count: 45, approved: 38, pending: 7 },
          { type: "Sick Leave", count: 23, approved: 20, pending: 3 },
          { type: "Maternity", count: 8, approved: 6, pending: 2 },
          { type: "Emergency", count: 12, approved: 10, pending: 2 },
          { type: "Study Leave", count: 5, approved: 3, pending: 2 },
        ],
        performanceMetrics: [
          { metric: "Employee Satisfaction", current: 85, target: 90, trend: "up" },
          { metric: "Retention Rate", current: 92, target: 95, trend: "up" },
          { metric: "Time to Hire", current: 18, target: 15, trend: "down" },
          { metric: "Training Completion", current: 78, target: 85, trend: "up" },
          { metric: "Absenteeism Rate", current: 3.2, target: 2.5, trend: "down" },
        ],
      })

      setLoading(false)
    }

    fetchReportData()
  }, [selectedPeriod, selectedDepartment])

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Reports & Analytics</h2>
        </div>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Reports & Analytics</h2>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-12-months">Last 12 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">78</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">KES 3.9M</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Retention Rate</CardTitle>
            <Activity className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">92%</div>
            <p className="text-xs text-green-400 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg. Salary</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">KES 50K</div>
            <p className="text-xs text-gray-400">Across all departments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-900/50 border-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="employees">Employee Analytics</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Reports</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Employee Growth Trend</CardTitle>
                <CardDescription className="text-gray-400">Monthly employee count and hiring trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportData?.employeeGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="employees" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Department Distribution</CardTitle>
                <CardDescription className="text-gray-400">Employee distribution across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData?.departmentDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {reportData?.departmentDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Hiring vs Departures</CardTitle>
                <CardDescription className="text-gray-400">Monthly hiring and departure trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData?.employeeGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="hires" fill="#22c55e" name="Hires" />
                    <Bar dataKey="departures" fill="#ef4444" name="Departures" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Leave Analytics</CardTitle>
                <CardDescription className="text-gray-400">Leave requests by type and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData?.leaveAnalytics.map((leave, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-800 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-white">{leave.type}</h4>
                        <p className="text-sm text-gray-400">Total: {leave.count} requests</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {leave.approved} approved
                        </Badge>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          {leave.pending} pending
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Payroll Trends</CardTitle>
              <CardDescription className="text-gray-400">
                Monthly payroll totals and average salary trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reportData?.payrollTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "total" ? `KES ${(value / 1000000).toFixed(1)}M` : `KES ${(value / 1000).toFixed(0)}K`,
                      name === "total" ? "Total Payroll" : "Average Salary",
                    ]}
                  />
                  <Line type="monotone" dataKey="total" stroke="#ef4444" strokeWidth={2} name="total" />
                  <Line type="monotone" dataKey="average" stroke="#3b82f6" strokeWidth={2} name="average" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
              <CardDescription className="text-gray-400">Key HR performance indicators and targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportData?.performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">{metric.metric}</h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          {metric.current}
                          {metric.metric.includes("Rate") ||
                          metric.metric.includes("Satisfaction") ||
                          metric.metric.includes("Completion")
                            ? "%"
                            : metric.metric.includes("Time")
                              ? " days"
                              : "%"}
                        </span>
                        <Badge
                          className={
                            metric.trend === "up"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                          }
                        >
                          {metric.trend === "up" ? "↗" : "↘"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${metric.trend === "up" ? "bg-green-500" : "bg-red-500"}`}
                          style={{ width: `${(metric.current / metric.target) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        Target: {metric.target}
                        {metric.metric.includes("Rate") ||
                        metric.metric.includes("Satisfaction") ||
                        metric.metric.includes("Completion")
                          ? "%"
                          : metric.metric.includes("Time")
                            ? " days"
                            : "%"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
