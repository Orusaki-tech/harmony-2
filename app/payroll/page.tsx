"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  Download,
  Play,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Edit3,
  Send,
  FileText,
  Calculator,
  Building2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { apiService, type PayrollData, type PayrollEmployee } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function Payroll() {
  const [currentPeriod, setCurrentPeriod] = useState("December 2024")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [payrollData, setPayrollData] = useState<PayrollData | null>(null)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [showRunPayrollDialog, setShowRunPayrollDialog] = useState(false)
  const [showPayslipDialog, setShowPayslipDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollEmployee | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<PayrollEmployee | null>(null)

  useEffect(() => {
    fetchPayrollData()
  }, [])

  const fetchPayrollData = async () => {
    try {
      setLoading(true)
      const data = await apiService.getPayrollData()
      setPayrollData(data)
    } catch (error) {
      console.error("Failed to fetch payroll data:", error)
      toast({
        title: "Error",
        description: "Failed to load payroll data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculatePayroll = async () => {
    try {
      setProcessing(true)
      const result = await apiService.calculatePayroll({
        period: currentPeriod,
        employeeIds: selectedEmployees.length > 0 ? selectedEmployees : undefined,
      })

      toast({
        title: "Success",
        description: `Payroll calculated for ${result.processedCount} employees`,
      })

      await fetchPayrollData()
    } catch (error) {
      console.error("Failed to calculate payroll:", error)
      toast({
        title: "Error",
        description: "Failed to calculate payroll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const processPayroll = async () => {
    try {
      setProcessing(true)
      const result = await apiService.processPayroll({
        period: currentPeriod,
        employeeIds: selectedEmployees.length > 0 ? selectedEmployees : undefined,
      })

      toast({
        title: "Success",
        description: `Payroll processed for ${result.processedCount} employees`,
      })

      await fetchPayrollData()
      setShowRunPayrollDialog(false)
    } catch (error) {
      console.error("Failed to process payroll:", error)
      toast({
        title: "Error",
        description: "Failed to process payroll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const generatePayslip = async (employee: PayrollEmployee) => {
    try {
      const result = await apiService.generatePayslip(employee.id)
      toast({
        title: "Success",
        description: `Payslip generated for ${employee.name}`,
      })

      // Open payslip dialog
      setSelectedEmployee(employee)
      setShowPayslipDialog(true)
    } catch (error) {
      console.error("Failed to generate payslip:", error)
      toast({
        title: "Error",
        description: "Failed to generate payslip. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sendPayslip = async (method: "email" | "whatsapp") => {
    if (!selectedEmployee) return

    try {
      await apiService.sendPayslip(selectedEmployee.id, method)
      toast({
        title: "Success",
        description: `Payslip sent via ${method} to ${selectedEmployee.name}`,
      })
    } catch (error) {
      console.error("Failed to send payslip:", error)
      toast({
        title: "Error",
        description: `Failed to send payslip via ${method}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const updateEmployeePayroll = async (employee: PayrollEmployee) => {
    try {
      await apiService.updateEmployeePayroll(employee.id, employee)
      toast({
        title: "Success",
        description: `Payroll updated for ${employee.name}`,
      })

      await fetchPayrollData()
      setEditingEmployee(null)
    } catch (error) {
      console.error("Failed to update employee payroll:", error)
      toast({
        title: "Error",
        description: "Failed to update employee payroll. Please try again.",
        variant: "destructive",
      })
    }
  }

  const exportBankFile = async () => {
    try {
      const result = await apiService.exportBankFile(currentPeriod)
      toast({
        title: "Success",
        description: "Bank file exported successfully",
      })

      // Trigger download
      const link = document.createElement("a")
      link.href = result.downloadUrl
      link.download = `payroll_${currentPeriod.replace(" ", "_")}.csv`
      link.click()
    } catch (error) {
      console.error("Failed to export bank file:", error)
      toast({
        title: "Error",
        description: "Failed to export bank file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const generateRemittanceReports = async () => {
    try {
      const result = await apiService.generateRemittanceReports(currentPeriod)
      toast({
        title: "Success",
        description: "Remittance reports generated successfully",
      })
    } catch (error) {
      console.error("Failed to generate remittance reports:", error)
      toast({
        title: "Error",
        description: "Failed to generate remittance reports. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <LoadingSpinner size={40} className="text-red-500" />
      </div>
    )
  }

  if (!payrollData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <p className="text-gray-400">Failed to load payroll data</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10 px-6">
        <SidebarTrigger className="text-white hover:bg-gray-800 -ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold">Payroll Management</h1>
            <p className="text-gray-400">Manage employee compensation - {currentPeriod}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              onClick={exportBankFile}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Bank File
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
              onClick={generateRemittanceReports}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Remittance Reports
            </Button>
            <Dialog open={showRunPayrollDialog} onOpenChange={setShowRunPayrollDialog}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Play className="h-4 w-4 mr-2" />
                  Run Payroll
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Run Payroll - {currentPeriod}</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Review and process payroll for selected employees
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pay Period</Label>
                      <Select value={currentPeriod} onValueChange={setCurrentPeriod}>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="December 2024">December 2024</SelectItem>
                          <SelectItem value="January 2025">January 2025</SelectItem>
                          <SelectItem value="February 2025">February 2025</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Employees</Label>
                      <p className="text-sm text-gray-400 mt-1">
                        {selectedEmployees.length > 0
                          ? `${selectedEmployees.length} selected`
                          : `All ${payrollData.employees.length} employees`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                      onClick={calculatePayroll}
                      disabled={processing}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate Only
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 flex-1"
                      onClick={processPayroll}
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <LoadingSpinner size={16} className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Process & Generate Payslips
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {payrollData.stats.map((stat, index) => (
            <Card
              key={index}
              className="glassmorphism border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    {stat.icon === "DollarSign" && <DollarSign className={`h-6 w-6 ${stat.color}`} />}
                    {stat.icon === "Users" && <Users className={`h-6 w-6 ${stat.color}`} />}
                    {stat.icon === "TrendingUp" && <TrendingUp className={`h-6 w-6 ${stat.color}`} />}
                    {stat.icon === "AlertCircle" && <AlertCircle className={`h-6 w-6 ${stat.color}`} />}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payroll Table */}
        <Card className="glassmorphism border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Employee Payroll Details</CardTitle>
                <CardDescription className="text-gray-400">
                  Individual employee compensation breakdown for {currentPeriod}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedEmployees.length === payrollData.employees.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedEmployees(payrollData.employees.map((emp) => emp.id))
                    } else {
                      setSelectedEmployees([])
                    }
                  }}
                />
                <Label className="text-sm text-gray-400">Select All</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Select</TableHead>
                  <TableHead className="text-gray-400">Employee</TableHead>
                  <TableHead className="text-gray-400">Gross Salary</TableHead>
                  <TableHead className="text-gray-400">PAYE</TableHead>
                  <TableHead className="text-gray-400">NSSF</TableHead>
                  <TableHead className="text-gray-400">NHIF</TableHead>
                  <TableHead className="text-gray-400">Other Deductions</TableHead>
                  <TableHead className="text-gray-400">Net Salary</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollData.employees.map((employee) => (
                  <TableRow key={employee.id} className="border-gray-700 hover:bg-gray-800/30">
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedEmployees([...selectedEmployees, employee.id])
                          } else {
                            setSelectedEmployees(selectedEmployees.filter((id) => id !== employee.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-red-500/20 text-red-400 text-xs">
                            {employee.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{employee.name}</p>
                          <p className="text-gray-400 text-sm">{employee.position}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white font-semibold">{formatCurrency(employee.grossSalary)}</TableCell>
                    <TableCell className="text-red-400">-{formatCurrency(employee.paye)}</TableCell>
                    <TableCell className="text-red-400">-{formatCurrency(employee.nssf)}</TableCell>
                    <TableCell className="text-red-400">-{formatCurrency(employee.nhif)}</TableCell>
                    <TableCell className="text-red-400">-{formatCurrency(employee.otherDeductions)}</TableCell>
                    <TableCell className="text-green-400 font-bold">{formatCurrency(employee.netSalary)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          employee.status === "Paid"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : employee.status === "Processed"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                          onClick={() => setEditingEmployee(employee)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => generatePayslip(employee)}
                        >
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glassmorphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Payroll Summary</CardTitle>
              <CardDescription className="text-gray-400">{currentPeriod} totals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Gross</span>
                  <span className="text-white font-semibold">{formatCurrency(payrollData.summary.totalGross)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total PAYE</span>
                  <span className="text-red-400">-{formatCurrency(payrollData.summary.totalPaye)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total NSSF</span>
                  <span className="text-red-400">-{formatCurrency(payrollData.summary.totalNssf)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total NHIF</span>
                  <span className="text-red-400">-{formatCurrency(payrollData.summary.totalNhif)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total Net</span>
                    <span className="text-green-400 font-bold text-lg">
                      {formatCurrency(payrollData.summary.totalNet)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Statutory Remittances</CardTitle>
              <CardDescription className="text-gray-400">Amounts to remit to authorities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">KRA (PAYE)</span>
                  <span className="text-yellow-400 font-semibold">{formatCurrency(payrollData.summary.totalPaye)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">NSSF</span>
                  <span className="text-yellow-400 font-semibold">
                    {formatCurrency(payrollData.summary.totalNssf * 2)} {/* Employer + Employee */}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">NHIF</span>
                  <span className="text-yellow-400 font-semibold">{formatCurrency(payrollData.summary.totalNhif)}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total Due</span>
                    <span className="text-yellow-400 font-bold text-lg">
                      {formatCurrency(
                        payrollData.summary.totalPaye +
                          payrollData.summary.totalNssf * 2 +
                          payrollData.summary.totalNhif,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Processing Status</CardTitle>
              <CardDescription className="text-gray-400">Current payroll status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Pending</span>
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    {payrollData.employees.filter((emp) => emp.status === "Pending").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Processed</span>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {payrollData.employees.filter((emp) => emp.status === "Processed").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Paid</span>
                  <Badge className="bg-green-500/20 text-green-400">
                    {payrollData.employees.filter((emp) => emp.status === "Paid").length}
                  </Badge>
                </div>
                <div className="pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Completion</span>
                    <span className="text-white">
                      {Math.round(
                        (payrollData.employees.filter((emp) => emp.status !== "Pending").length /
                          payrollData.employees.length) *
                          100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      (payrollData.employees.filter((emp) => emp.status !== "Pending").length /
                        payrollData.employees.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Employee Dialog */}
      <Dialog open={!!editingEmployee} onOpenChange={() => setEditingEmployee(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Payroll - {editingEmployee?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">Adjust salary components and deductions</DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Gross Salary</Label>
                <Input
                  type="number"
                  value={editingEmployee.grossSalary}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      grossSalary: Number(e.target.value),
                    })
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <Label>Other Deductions</Label>
                <Input
                  type="number"
                  value={editingEmployee.otherDeductions}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      otherDeductions: Number(e.target.value),
                    })
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div className="col-span-2 flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                  onClick={() => setEditingEmployee(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => updateEmployeePayroll(editingEmployee)}
                >
                  Update Payroll
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payslip Dialog */}
      <Dialog open={showPayslipDialog} onOpenChange={setShowPayslipDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payslip - {selectedEmployee?.name}</DialogTitle>
            <DialogDescription className="text-gray-400">{currentPeriod} payslip details</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Payslip Preview */}
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white">PAYSLIP</h3>
                  <p className="text-gray-400">{currentPeriod}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-white mb-3">Employee Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{selectedEmployee.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Position:</span>
                        <span className="text-white">{selectedEmployee.position}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Employee ID:</span>
                        <span className="text-white">{selectedEmployee.id}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-white mb-3">Earnings & Deductions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gross Salary:</span>
                        <span className="text-white">{formatCurrency(selectedEmployee.grossSalary)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">PAYE:</span>
                        <span className="text-red-400">-{formatCurrency(selectedEmployee.paye)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">NSSF:</span>
                        <span className="text-red-400">-{formatCurrency(selectedEmployee.nssf)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">NHIF:</span>
                        <span className="text-red-400">-{formatCurrency(selectedEmployee.nhif)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Other:</span>
                        <span className="text-red-400">-{formatCurrency(selectedEmployee.otherDeductions)}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-white">Net Salary:</span>
                          <span className="text-green-400">{formatCurrency(selectedEmployee.netSalary)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                  onClick={() => setShowPayslipDialog(false)}
                >
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.print()}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => sendPayslip("email")}>
                  <Send className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => sendPayslip("whatsapp")}>
                  <Send className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
