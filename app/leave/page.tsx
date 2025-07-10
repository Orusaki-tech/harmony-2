"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Clock, CheckCircle, XCircle, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { apiService, type LeaveRequest } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function Leave() {
  const [loading, setLoading] = useState(true)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
  })

  const leaveStats = [
    {
      title: "Pending Requests",
      value: "15",
      change: "+3 today",
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      title: "Approved This Month",
      value: "42",
      change: "+12%",
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Total Leave Days",
      value: "156",
      change: "This month",
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Rejected Requests",
      value: "3",
      change: "-50%",
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
  ]

  const leaveBalances = [
    {
      employee: "John Doe",
      annual: { used: 8, total: 21, remaining: 13 },
      sick: { used: 2, total: 10, remaining: 8 },
      personal: { used: 1, total: 5, remaining: 4 },
      avatar: "JD",
    },
    {
      employee: "Sarah Wilson",
      annual: { used: 12, total: 21, remaining: 9 },
      sick: { used: 5, total: 10, remaining: 5 },
      personal: { used: 2, total: 5, remaining: 3 },
      avatar: "SW",
    },
    {
      employee: "Mike Johnson",
      annual: { used: 6, total: 21, remaining: 15 },
      sick: { used: 1, total: 10, remaining: 9 },
      personal: { used: 0, total: 5, remaining: 5 },
      avatar: "MJ",
    },
  ]

  useEffect(() => {
    async function fetchLeaveRequests() {
      try {
        setLoading(true)
        const data = await apiService.getLeaveRequests()
        setLeaveRequests(data)
      } catch (error) {
        console.error("Failed to fetch leave requests:", error)
        toast({
          title: "Error",
          description: "Failed to load leave requests. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveRequests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const updatedRequest = await apiService.approveLeaveRequest(id)

      // Update the leave request in the list
      setLeaveRequests(leaveRequests.map((request) => (request.id === id ? updatedRequest : request)))

      toast({
        title: "Success",
        description: "Leave request approved successfully",
      })
    } catch (error) {
      console.error("Failed to approve leave request:", error)
      toast({
        title: "Error",
        description: "Failed to approve leave request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      const updatedRequest = await apiService.rejectLeaveRequest(id)

      // Update the leave request in the list
      setLeaveRequests(leaveRequests.map((request) => (request.id === id ? updatedRequest : request)))

      toast({
        title: "Success",
        description: "Leave request rejected successfully",
      })
    } catch (error) {
      console.error("Failed to reject leave request:", error)
      toast({
        title: "Error",
        description: "Failed to reject leave request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.type || !formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const newLeaveRequest = await apiService.submitLeaveRequest(formData)

      // Add the new leave request to the list
      setLeaveRequests([newLeaveRequest, ...leaveRequests])

      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      })

      // Reset form and close dialog
      setFormData({
        type: "",
        startDate: "",
        endDate: "",
        reason: "",
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Failed to submit leave request:", error)
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10 px-6">
        <SidebarTrigger className="text-white hover:bg-gray-800 -ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold">Leave Management</h1>
            <p className="text-gray-400">Manage employee leave requests and balances</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                New Leave Request
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800 text-white">
              <DialogHeader>
                <DialogTitle>Submit Leave Request</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Fill in the details for your leave request.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="leaveType">Leave Type</Label>
                    <Select
                      name="type"
                      value={formData.type}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                        <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                        <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                        <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                        <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        className="bg-gray-800 border-gray-700"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        className="bg-gray-800 border-gray-700"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      placeholder="Please provide a reason for your leave request..."
                      className="bg-gray-800 border-gray-700"
                      value={formData.reason}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-700 bg-transparent"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size={16} className="mr-2" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {leaveStats.map((stat, index) => (
            <Card
              key={index}
              className="glassmorphism border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    <p className="text-gray-400 text-sm mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="requests" className="data-[state=active]:bg-red-600">
              Leave Requests
            </TabsTrigger>
            <TabsTrigger value="balances" className="data-[state=active]:bg-red-600">
              Leave Balances
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-red-600">
              Leave Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card className="glassmorphism border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Leave Requests</CardTitle>
                <CardDescription className="text-gray-400">Review and manage employee leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-64 items-center justify-center">
                    <LoadingSpinner size={40} className="text-red-500" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-400">Employee</TableHead>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Duration</TableHead>
                        <TableHead className="text-gray-400">Days</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaveRequests.map((request) => (
                        <TableRow key={request.id} className="border-gray-700 hover:bg-gray-800/30">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-red-500/20 text-red-400 text-xs">
                                  {request.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-white font-medium">{request.employee}</p>
                                <p className="text-gray-400 text-sm">Applied: {request.appliedDate}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              {request.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {request.startDate} to {request.endDate}
                          </TableCell>
                          <TableCell className="text-white font-semibold">{request.days} days</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                          </TableCell>
                          <TableCell>
                            {request.status === "Pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApprove(request.id)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                            {request.status !== "Pending" && <span className="text-gray-400 text-sm">No actions</span>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balances">
            <Card className="glassmorphism border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Leave Balances</CardTitle>
                <CardDescription className="text-gray-400">Employee leave balance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {leaveBalances.map((balance, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-red-500/20 text-red-400">{balance.avatar}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-white font-semibold">{balance.employee}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Annual Leave</span>
                            <span className="text-white text-sm">
                              {balance.annual.remaining}/{balance.annual.total} days
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(balance.annual.used / balance.annual.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Sick Leave</span>
                            <span className="text-white text-sm">
                              {balance.sick.remaining}/{balance.sick.total} days
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(balance.sick.used / balance.sick.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Personal Leave</span>
                            <span className="text-white text-sm">
                              {balance.personal.remaining}/{balance.personal.total} days
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(balance.personal.used / balance.personal.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="glassmorphism border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Leave Calendar</CardTitle>
                <CardDescription className="text-gray-400">Visual overview of scheduled leaves</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Calendar view coming soon</p>
                  <p className="text-gray-500 text-sm">Interactive calendar to visualize leave schedules</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
