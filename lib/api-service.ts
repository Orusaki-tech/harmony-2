// Base API URL - would be an environment variable in production
const API_BASE_URL = "/api"

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = "An error occurred"
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    console.error("API Error:", message)
    throw error
  }
}

// API service with typed methods
export const apiService = {
  // Employees
  getEmployees: () => fetchAPI<Employee[]>("/employees"),
  getEmployee: (id: string) => fetchAPI<Employee>(`/employees/${id}`),
  createEmployee: (data: Partial<Employee>) =>
    fetchAPI<Employee>("/employees", { method: "POST", body: JSON.stringify(data) }),
  updateEmployee: (id: string, data: Partial<Employee>) =>
    fetchAPI<Employee>(`/employees/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEmployee: (id: string) => fetchAPI<void>(`/employees/${id}`, { method: "DELETE" }),

  // Payroll
  getPayrollData: () => fetchAPI<PayrollData>("/payroll"),
  calculatePayroll: (data: PayrollCalculationRequest) =>
    fetchAPI<PayrollCalculationResult>("/payroll/calculate", { method: "POST", body: JSON.stringify(data) }),
  processPayroll: (data: PayrollProcessRequest) =>
    fetchAPI<PayrollProcessResult>("/payroll/process", { method: "POST", body: JSON.stringify(data) }),
  updateEmployeePayroll: (employeeId: string, data: Partial<PayrollEmployee>) =>
    fetchAPI<PayrollEmployee>(`/payroll/employee/${employeeId}`, { method: "PUT", body: JSON.stringify(data) }),
  generatePayslip: (employeeId: string) =>
    fetchAPI<PayslipResult>(`/payroll/payslip/${employeeId}`, { method: "POST" }),
  sendPayslip: (employeeId: string, method: "email" | "whatsapp") =>
    fetchAPI<void>(`/payroll/payslip/${employeeId}/send`, { method: "POST", body: JSON.stringify({ method }) }),
  exportBankFile: (period: string) =>
    fetchAPI<{ downloadUrl: string }>(`/payroll/export/bank`, { method: "POST", body: JSON.stringify({ period }) }),
  generateRemittanceReports: (period: string) =>
    fetchAPI<RemittanceResult>(`/payroll/remittance`, { method: "POST", body: JSON.stringify({ period }) }),

  // Leave
  getLeaveRequests: () => fetchAPI<LeaveRequest[]>("/leave"),
  submitLeaveRequest: (data: Partial<LeaveRequest>) =>
    fetchAPI<LeaveRequest>("/leave", { method: "POST", body: JSON.stringify(data) }),
  approveLeaveRequest: (id: string) => fetchAPI<LeaveRequest>(`/leave/${id}/approve`, { method: "POST" }),
  rejectLeaveRequest: (id: string) => fetchAPI<LeaveRequest>(`/leave/${id}/reject`, { method: "POST" }),

  // Documents
  getDocuments: () => fetchAPI<Document[]>("/documents"),
  uploadDocument: async (formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Upload failed")
    }

    return response.json()
  },
  deleteDocument: (id: string) => fetchAPI<void>(`/documents/${id}`, { method: "DELETE" }),

  // Employee Documents
  getEmployeeDocuments: (employeeId: string) => fetchAPI<EmployeeDocument[]>(`/employees/${employeeId}/documents`),
  uploadEmployeeDocument: async (employeeId: string, formData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}/documents`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Upload failed")
    }

    return response.json()
  },

  // Qualification Analysis
  analyzeQualifications: (employeeId: string) =>
    fetchAPI<QualificationAnalysis>(`/employees/${employeeId}/analyze`, { method: "POST" }),

  // Dashboard
  getDashboardStats: () => fetchAPI<DashboardStats>("/dashboard/stats"),
  getDashboardActivities: () => fetchAPI<Activity[]>("/dashboard/activities"),
}

// Types
export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  status: string
  salary: string
  joinDate: string
  avatar: string
  dateOfBirth?: string
  address?: string
}

export interface PayrollEmployee {
  id: string
  name: string
  position: string
  department: string
  grossSalary: number
  paye: number
  nssf: number
  nhif: number
  otherDeductions: number
  netSalary: number
  status: "Pending" | "Processed" | "Paid"
  avatar: string
  email?: string
  phone?: string
}

export interface PayrollData {
  stats: PayrollStat[]
  employees: PayrollEmployee[]
  summary: PayrollSummary
}

export interface PayrollStat {
  title: string
  value: string
  change: string
  icon: string
  color: string
  bgColor: string
}

export interface PayrollSummary {
  totalGross: number
  totalPaye: number
  totalNssf: number
  totalNhif: number
  totalOtherDeductions: number
  totalNet: number
}

export interface PayrollCalculationRequest {
  period: string
  employeeIds?: string[]
}

export interface PayrollCalculationResult {
  success: boolean
  message: string
  processedCount: number
  calculations: PayrollEmployee[]
}

export interface PayrollProcessRequest {
  period: string
  employeeIds?: string[]
}

export interface PayrollProcessResult {
  success: boolean
  message: string
  processedCount: number
  totalAmount: number
}

export interface PayslipResult {
  success: boolean
  payslipId: string
  downloadUrl: string
}

export interface RemittanceResult {
  success: boolean
  reports: {
    kra: string
    nssf: string
    nhif: string
  }
}

export interface EmployeeDocument {
  id: string
  name: string
  type: "cv" | "certificate" | "id"
  fileType: string
  size: string
  uploadDate: string
  url: string
  employeeId: string
}

export interface QualificationAnalysis {
  skills: string[]
  education: string
  experience: string
  certifications: string[]
  matchScore: number
  lastAnalyzed: string
  employeeId: string
}

export interface LeaveRequest {
  id: string
  employee: string
  type: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: string
  appliedDate: string
  avatar: string
}

export interface Document {
  id: string
  name: string
  category: string
  employee: string
  size: string
  uploadDate: string
  status: string
  type: string
  avatar: string
  url?: string
}

export interface DashboardStats {
  employees: number
  payroll: string
  pendingLeaves: number
  complianceScore: number
}

export interface Activity {
  name: string
  action: string
  time: string
  avatar: string
}
