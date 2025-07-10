"use client"

import { useEffect, useState } from "react"
import { Bell, Plus, TrendingUp, Users, CreditCard, Calendar, FileText, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { apiService, type Activity } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    employees: 0,
    payroll: "",
    pendingLeaves: 0,
    complianceScore: 0,
  })
  const [activities, setActivities] = useState<Activity[]>([])

  const pendingTasks = [
    { task: "Review 3 leave requests", priority: "high", count: 3, action: () => router.push("/leave") },
    { task: "Process monthly payroll", priority: "medium", count: 1, action: () => router.push("/payroll") },
    { task: "Update employee contracts", priority: "low", count: 7, action: () => router.push("/employees") },
    { task: "Generate compliance report", priority: "high", count: 1, action: () => router.push("/compliance") },
  ]

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        const [statsData, activitiesData] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getDashboardActivities(),
        ])

        setStats(statsData)
        setActivities(activitiesData)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsData = [
    {
      title: "Employee Records",
      value: stats.employees.toString(),
      change: "+12%",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      action: () => router.push("/employees"),
    },
    {
      title: "Monthly Payroll",
      value: stats.payroll,
      change: "+8%",
      icon: CreditCard,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      action: () => router.push("/payroll"),
    },
    {
      title: "Pending Leaves",
      value: stats.pendingLeaves.toString(),
      change: "-5%",
      icon: Calendar,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      action: () => router.push("/leave"),
    },
    {
      title: "Compliance Score",
      value: `${stats.complianceScore}%`,
      change: "+2%",
      icon: FileText,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      action: () => router.push("/compliance"),
    },
  ]

  const handleQuickAction = (action: string, route?: string) => {
    if (route) {
      router.push(route)
    } else {
      toast({
        title: "Action Triggered",
        description: `${action} action initiated`,
      })
    }
  }

  const handleAddEmployee = () => {
    // Navigate to employee records page with add parameter
    router.push("/employees?action=add")
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 bg-black/50 backdrop-blur-sm px-4">
        <SidebarTrigger className="text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-400">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              onClick={handleAddEmployee}
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-400 hover:text-white cursor-pointer" />
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5">8</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size={40} className="text-red-500" />
          </div>
        ) : (
          <>
            {/* Hero Stats - Fixed Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statsData.map((stat, index) => (
                <Card
                  key={index}
                  className="glassmorphism border-gray-800 hover:border-gray-700 transition-all duration-300 cursor-pointer"
                  onClick={stat.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-gray-400 text-sm truncate">{stat.title}</p>
                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        <div className="flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                          <span className="text-green-400 text-sm">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Grid - Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card className="glassmorphism border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                  <CardDescription className="text-gray-400">Frequently used HR tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white justify-start"
                    onClick={handleAddEmployee}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Add Employee Record
                  </Button>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white justify-start"
                    onClick={() => handleQuickAction("Run Payroll", "/payroll")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Run Payroll
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start"
                    onClick={() => handleQuickAction("Approve Leaves", "/leave")}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Approve Leaves
                  </Button>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white justify-start"
                    onClick={() => handleQuickAction("Generate Report", "/reports")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="glassmorphism border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Latest employee actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/30 cursor-pointer transition-colors"
                      onClick={() => {
                        if (activity.action.includes("employee") || activity.action.includes("profile")) {
                          router.push("/employees")
                        }
                      }}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-gray-700 text-white text-xs">{activity.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">
                          <span className="font-medium">{activity.name}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Pending Tasks */}
              <Card className="glassmorphism border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    Pending Tasks
                  </CardTitle>
                  <CardDescription className="text-gray-400">Items requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingTasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gray-800/30 border border-gray-700 hover:bg-gray-800/50 cursor-pointer transition-colors"
                      onClick={task.action}
                    >
                      <div className="space-y-2">
                        <p className="text-sm text-white">{task.task}</p>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-gray-400">({task.count})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glassmorphism border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Department Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Engineering</span>
                      <span className="text-white">45 employees</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sales</span>
                      <span className="text-white">32 employees</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Marketing</span>
                      <span className="text-white">18 employees</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glassmorphism border-gray-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg">Payroll Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">₦2.4M</div>
                    <p className="text-gray-400">This month's payroll</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Processed</span>
                      <span className="text-green-400">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleQuickAction("Complete Payroll Run", "/payroll")}
                  >
                    Complete Payroll Run
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
