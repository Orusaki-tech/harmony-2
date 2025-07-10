"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Edit,
  Trash2,
  FileText,
  Award,
  User,
  Upload,
  Eye,
  Download,
  Sparkles,
  X,
  CheckCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { apiService, type Employee } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

interface EmployeeDocument {
  id: string
  name: string
  type: "cv" | "certificate" | "id"
  fileType: string
  size: string
  uploadDate: string
  url: string
}

interface QualificationAnalysis {
  skills: string[]
  education: string
  experience: string
  certifications: string[]
  matchScore: number
  lastAnalyzed: string
}

interface ExtendedEmployee extends Employee {
  documents: EmployeeDocument[]
  qualificationAnalysis?: QualificationAnalysis
  dateOfBirth?: string
  address?: string
}

interface UploadedFile {
  file: File
  type: "cv" | "certificate" | "id"
  preview: string
}

export default function EmployeeRecords() {
  const searchParams = useSearchParams()
  const shouldOpenAdd = searchParams.get("action") === "add"

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [employees, setEmployees] = useState<ExtendedEmployee[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(shouldOpenAdd)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<ExtendedEmployee | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    salary: "",
    dateOfBirth: "",
    address: "",
  })

  const departments = ["Engineering", "Product", "Sales", "Human Resources", "Marketing", "Finance"]

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true)
        const data = await apiService.getEmployees()
        // Transform data to include documents and analysis
        const extendedData: ExtendedEmployee[] = data.map((emp) => ({
          ...emp,
          documents: [],
          qualificationAnalysis: undefined,
        }))
        setEmployees(extendedData)
      } catch (error) {
        console.error("Failed to fetch employees:", error)
        toast({
          title: "Error",
          description: "Failed to load employees. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  // Open add dialog if coming from dashboard
  useEffect(() => {
    if (shouldOpenAdd) {
      setIsAddDialogOpen(true)
    }
  }, [shouldOpenAdd])

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (files: FileList, type: "cv" | "certificate" | "id") => {
    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      file,
      type,
      preview: URL.createObjectURL(file),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    toast({
      title: "Files Added",
      description: `${files.length} file(s) ready for upload`,
    })
  }

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev]
      URL.revokeObjectURL(newFiles[index].preview)
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.position || !formData.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check if at least one ID document is uploaded
    const hasIdDocument = uploadedFiles.some((file) => file.type === "id")
    if (!hasIdDocument) {
      toast({
        title: "Error",
        description: "At least one ID document is required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      const employeeData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        salary: formData.salary,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
      }

      // Create employee first
      const newEmployee = await apiService.createEmployee(employeeData)

      // Upload documents if any
      if (uploadedFiles.length > 0) {
        const formDataUpload = new FormData()
        uploadedFiles.forEach((uploadedFile) => {
          formDataUpload.append("files", uploadedFile.file)
          formDataUpload.append("types", uploadedFile.type)
        })
        formDataUpload.append("employeeId", newEmployee.id)

        try {
          await apiService.uploadDocument(formDataUpload)
        } catch (uploadError) {
          console.error("Document upload failed:", uploadError)
          toast({
            title: "Warning",
            description: "Employee created but some documents failed to upload",
            variant: "destructive",
          })
        }
      }

      // Create extended employee with documents
      const documentsFromFiles: EmployeeDocument[] = uploadedFiles.map((uploadedFile, index) => ({
        id: `${Date.now()}-${index}`,
        name: uploadedFile.file.name,
        type: uploadedFile.type,
        fileType: uploadedFile.file.type,
        size: `${(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        url: `/api/documents/files/${Date.now()}-${index}`,
      }))

      const extendedEmployee: ExtendedEmployee = {
        ...newEmployee,
        documents: documentsFromFiles,
        qualificationAnalysis: undefined,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
      }

      setEmployees([extendedEmployee, ...employees])

      toast({
        title: "Success",
        description: "Employee record created successfully",
      })

      // Reset form and close dialog
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        salary: "",
        dateOfBirth: "",
        address: "",
      })
      setUploadedFiles([])
      setIsAddDialogOpen(false)

      // Update recent activity
      const newActivity = {
        name: newEmployee.name,
        action: "was added to employee records",
        time: "Just now",
        avatar: newEmployee.avatar,
      }

      // In a real app, this would be handled by the backend
      console.log("New activity:", newActivity)
    } catch (error) {
      console.error("Failed to add employee:", error)
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAnalyzeQualifications = async (employeeId: string) => {
    setIsAnalyzing(true)
    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockAnalysis: QualificationAnalysis = {
        skills: ["JavaScript", "React", "Node.js", "TypeScript", "Python", "AWS"],
        education: "Bachelor's in Computer Science",
        experience: "5+ years in software development",
        certifications: ["AWS Certified Developer", "React Professional"],
        matchScore: 87,
        lastAnalyzed: new Date().toISOString().split("T")[0],
      }

      if (selectedEmployee) {
        setSelectedEmployee((prev) =>
          prev
            ? {
                ...prev,
                qualificationAnalysis: mockAnalysis,
              }
            : null,
        )

        // Update in the main list too
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === employeeId ? { ...emp, qualificationAnalysis: mockAnalysis } : emp)),
        )
      }

      toast({
        title: "Analysis Complete",
        description: "Qualification analysis has been updated",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze qualifications",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const openEmployeeDetails = (employee: ExtendedEmployee) => {
    setSelectedEmployee(employee)
    setIsDetailsDialogOpen(true)
  }

  const getDocumentIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-400" />
    if (type.includes("image")) return <Eye className="h-4 w-4 text-blue-400" />
    return <FileText className="h-4 w-4 text-gray-400" />
  }

  const getFileTypeIcon = (type: "cv" | "certificate" | "id") => {
    switch (type) {
      case "cv":
        return <FileText className="h-4 w-4 text-blue-400" />
      case "certificate":
        return <Award className="h-4 w-4 text-yellow-400" />
      case "id":
        return <User className="h-4 w-4 text-green-400" />
      default:
        return <FileText className="h-4 w-4 text-gray-400" />
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
            <h1 className="text-2xl font-bold">Employee Records</h1>
            <p className="text-gray-400">Manage employee data and documents</p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Employee
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employee Table */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size={40} className="text-red-500" />
          </div>
        ) : (
          <Card className="glassmorphism border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Employee Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-400">Employee</TableHead>
                    <TableHead className="text-gray-400">Role</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Documents</TableHead>
                    <TableHead className="text-gray-400">Last Update</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow
                      key={employee.id}
                      className="border-gray-800 hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => openEmployeeDetails(employee)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-red-500/20 text-red-400 text-xs">
                              {employee.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-white font-medium">{employee.name}</p>
                            <p className="text-gray-400 text-sm">{employee.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white">{employee.position}</p>
                          <p className="text-gray-400 text-sm">{employee.department}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.status === "Active" ? "default" : "secondary"}
                          className={
                            employee.status === "Active"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-white">{employee.documents.length}</span>
                          <span className="text-gray-400 text-sm">files</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400">{employee.joinDate}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem
                              className="text-white hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                openEmployeeDetails(employee)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-700">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-gray-700">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {!loading && filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No employees found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription className="text-gray-400">
              Enter the employee details and upload required documents.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      className="bg-gray-800 border-gray-700"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      className="bg-gray-800 border-gray-700"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="bg-gray-800 border-gray-700"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      className="bg-gray-800 border-gray-700"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      className="bg-gray-800 border-gray-700"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input
                      id="position"
                      name="position"
                      className="bg-gray-800 border-gray-700"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      name="department"
                      value={formData.department}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    name="salary"
                    placeholder="₦"
                    className="bg-gray-800 border-gray-700"
                    value={formData.salary}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    className="bg-gray-800 border-gray-700"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 mt-4">
                <div className="space-y-6">
                  {/* CV Upload */}
                  <div className="space-y-2">
                    <Label>CV/Resume (PDF, DOC)</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors">
                      <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="bg-gray-800 border-gray-700"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files, "cv")}
                      />
                      <p className="text-sm text-gray-400 mt-2">Upload CV or Resume</p>
                    </div>
                  </div>

                  {/* Certificates Upload */}
                  <div className="space-y-2">
                    <Label>Certificates (Multiple files allowed)</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors">
                      <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="bg-gray-800 border-gray-700"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files, "certificate")}
                      />
                      <p className="text-sm text-gray-400 mt-2">Upload certificates and qualifications</p>
                    </div>
                  </div>

                  {/* ID Documents Upload */}
                  <div className="space-y-2">
                    <Label>ID Documents * (ID, Passport)</Label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors">
                      <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <Input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="bg-gray-800 border-gray-700"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files, "id")}
                      />
                      <p className="text-sm text-gray-400 mt-2">
                        Upload ID card, passport, or other identification (Required)
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Files Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Files Preview</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {uploadedFiles.map((uploadedFile, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              {getFileTypeIcon(uploadedFile.type)}
                              <div>
                                <p className="text-white text-sm font-medium">{uploadedFile.file.name}</p>
                                <p className="text-gray-400 text-xs">
                                  {uploadedFile.type.toUpperCase()} •{" "}
                                  {(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-400" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-gray-400 hover:text-red-400"
                                onClick={() => removeUploadedFile(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                className="border-gray-700 bg-transparent"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setUploadedFiles([])
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    position: "",
                    department: "",
                    salary: "",
                    dateOfBirth: "",
                    address: "",
                  })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size={16} className="mr-2" />
                    Creating Employee...
                  </>
                ) : (
                  "Create Employee Record"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-red-500/20 text-red-400 text-lg">
                      {selectedEmployee.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedEmployee.name}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      {selectedEmployee.position} • {selectedEmployee.department}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="analysis">Qualification Analysis</TabsTrigger>
                  <TabsTrigger value="info">Personal Info</TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Document Library</h3>
                    <Button
                      variant="outline"
                      className="border-gray-700 bg-transparent"
                      onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.multiple = true
                        input.accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files
                          if (files) {
                            // Handle file upload for existing employee
                            toast({
                              title: "Files Selected",
                              description: `${files.length} file(s) ready for upload`,
                            })
                          }
                        }
                        input.click()
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Add Documents
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* CV Section */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          CV/Resume
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedEmployee.documents
                          .filter((doc) => doc.type === "cv")
                          .map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                              <div className="flex items-center gap-2">
                                {getDocumentIcon(doc.fileType)}
                                <div>
                                  <p className="text-white text-sm truncate">{doc.name}</p>
                                  <p className="text-gray-400 text-xs">{doc.size}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        {selectedEmployee.documents.filter((doc) => doc.type === "cv").length === 0 && (
                          <p className="text-gray-400 text-sm">No CV uploaded</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Certificates Section */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          Certificates
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedEmployee.documents
                          .filter((doc) => doc.type === "certificate")
                          .map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                              <div className="flex items-center gap-2">
                                {getDocumentIcon(doc.fileType)}
                                <div>
                                  <p className="text-white text-sm truncate">{doc.name}</p>
                                  <p className="text-gray-400 text-xs">{doc.size}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        {selectedEmployee.documents.filter((doc) => doc.type === "certificate").length === 0 && (
                          <p className="text-gray-400 text-sm">No certificates uploaded</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* ID Documents Section */}
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          ID Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedEmployee.documents
                          .filter((doc) => doc.type === "id")
                          .map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                              <div className="flex items-center gap-2">
                                {getDocumentIcon(doc.fileType)}
                                <div>
                                  <p className="text-white text-sm truncate">{doc.name}</p>
                                  <p className="text-gray-400 text-xs">{doc.size}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        {selectedEmployee.documents.filter((doc) => doc.type === "id").length === 0 && (
                          <p className="text-gray-400 text-sm">No ID documents uploaded</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">Qualification Analysis</h3>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => handleAnalyzeQualifications(selectedEmployee.id)}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <LoadingSpinner size={16} className="mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze
                        </>
                      )}
                    </Button>
                  </div>

                  {selectedEmployee.qualificationAnalysis ? (
                    <div className="space-y-6">
                      {/* Match Score */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white">Overall Match Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-4">
                            <div className="text-3xl font-bold text-green-400">
                              {selectedEmployee.qualificationAnalysis.matchScore}%
                            </div>
                            <div className="flex-1">
                              <Progress value={selectedEmployee.qualificationAnalysis.matchScore} className="h-3" />
                            </div>
                          </div>
                          <p className="text-gray-400 text-sm mt-2">
                            Last analyzed: {selectedEmployee.qualificationAnalysis.lastAnalyzed}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Skills */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white">Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedEmployee.qualificationAnalysis.skills.map((skill, index) => (
                              <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Education & Experience */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-gray-800 border-gray-700">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-white">Education</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300">{selectedEmployee.qualificationAnalysis.education}</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-white">Experience</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-300">{selectedEmployee.qualificationAnalysis.experience}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Certifications */}
                      <Card className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white">Certifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {selectedEmployee.qualificationAnalysis.certifications.map((cert, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-yellow-400" />
                                <span className="text-gray-300">{cert}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-400 text-lg">No analysis available</p>
                      <p className="text-gray-500 text-sm">Click "Analyze" to generate qualification insights</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{selectedEmployee.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-300">{selectedEmployee.phone || "Not provided"}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white">Employment Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-gray-400 text-sm">Position</p>
                          <p className="text-white">{selectedEmployee.position}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Department</p>
                          <p className="text-white">{selectedEmployee.department}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Salary</p>
                          <p className="text-white">{selectedEmployee.salary}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Join Date</p>
                          <p className="text-white">{selectedEmployee.joinDate}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {(selectedEmployee.dateOfBirth || selectedEmployee.address) && (
                    <Card className="bg-gray-800 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedEmployee.dateOfBirth && (
                          <div>
                            <p className="text-gray-400 text-sm">Date of Birth</p>
                            <p className="text-white">{selectedEmployee.dateOfBirth}</p>
                          </div>
                        )}
                        {selectedEmployee.address && (
                          <div>
                            <p className="text-gray-400 text-sm">Address</p>
                            <p className="text-white">{selectedEmployee.address}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
