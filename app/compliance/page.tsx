"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Calendar, Download, Eye, RefreshCw } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ComplianceItem {
  id: string
  title: string
  description: string
  status: "compliant" | "non-compliant" | "pending" | "due-soon"
  dueDate: string
  category: string
  priority: "high" | "medium" | "low"
  completionRate: number
}

interface ComplianceAudit {
  id: string
  date: string
  auditor: string
  type: string
  status: "passed" | "failed" | "pending"
  score: number
  findings: number
}

export default function CompliancePage() {
  const [loading, setLoading] = useState(true)
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [audits, setAudits] = useState<ComplianceAudit[]>([])
  const [overallScore, setOverallScore] = useState(0)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setComplianceItems([
        {
          id: "1",
          title: "Employee Tax Compliance",
          description: "Ensure all employee tax deductions are properly calculated and remitted",
          status: "compliant",
          dueDate: "2024-01-31",
          category: "Tax",
          priority: "high",
          completionRate: 100,
        },
        {
          id: "2",
          title: "NHIF Contributions",
          description: "Monthly NHIF contributions for all employees",
          status: "due-soon",
          dueDate: "2024-01-15",
          category: "Healthcare",
          priority: "high",
          completionRate: 85,
        },
        {
          id: "3",
          title: "NSSF Contributions",
          description: "Social security contributions compliance",
          status: "pending",
          dueDate: "2024-01-20",
          category: "Social Security",
          priority: "high",
          completionRate: 60,
        },
        {
          id: "4",
          title: "Work Permit Renewals",
          description: "Track and renew work permits for foreign employees",
          status: "non-compliant",
          dueDate: "2024-01-10",
          category: "Immigration",
          priority: "high",
          completionRate: 30,
        },
        {
          id: "5",
          title: "Safety Training Records",
          description: "Maintain up-to-date safety training records",
          status: "compliant",
          dueDate: "2024-03-01",
          category: "Safety",
          priority: "medium",
          completionRate: 95,
        },
      ])

      setAudits([
        {
          id: "1",
          date: "2023-12-15",
          auditor: "Kenya Revenue Authority",
          type: "Tax Audit",
          status: "passed",
          score: 92,
          findings: 2,
        },
        {
          id: "2",
          date: "2023-11-20",
          auditor: "Ministry of Labour",
          type: "Labour Compliance",
          status: "passed",
          score: 88,
          findings: 3,
        },
        {
          id: "3",
          date: "2023-10-10",
          auditor: "NSSF",
          type: "Social Security",
          status: "pending",
          score: 0,
          findings: 0,
        },
      ])

      setOverallScore(85)
      setLoading(false)
    }

    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "non-compliant":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "due-soon":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4" />
      case "non-compliant":
        return <AlertTriangle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "due-soon":
        return <Calendar className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-white">Compliance</h2>
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
        <h2 className="text-3xl font-bold tracking-tight text-white">Compliance Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Overall Score</CardTitle>
            <Shield className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{overallScore}%</div>
            <Progress value={overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Compliant Items</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {complianceItems.filter((item) => item.status === "compliant").length}
            </div>
            <p className="text-xs text-gray-400">of {complianceItems.length} total items</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Due Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {complianceItems.filter((item) => item.status === "due-soon").length}
            </div>
            <p className="text-xs text-gray-400">require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Non-Compliant</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {complianceItems.filter((item) => item.status === "non-compliant").length}
            </div>
            <p className="text-xs text-gray-400">critical issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {complianceItems.some((item) => item.status === "non-compliant" || item.status === "due-soon") && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle className="text-red-400">Compliance Issues Detected</AlertTitle>
          <AlertDescription className="text-red-300">
            You have {complianceItems.filter((item) => item.status === "non-compliant").length} non-compliant items and{" "}
            {complianceItems.filter((item) => item.status === "due-soon").length} items due soon. Immediate action
            required.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList className="bg-gray-900/50 border-gray-800">
          <TabsTrigger value="requirements">Compliance Requirements</TabsTrigger>
          <TabsTrigger value="audits">Audit History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="requirements" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Compliance Requirements</CardTitle>
              <CardDescription className="text-gray-400">Track and manage all compliance requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-800 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(item.status)}
                      <div>
                        <h4 className="font-medium text-white">{item.title}</h4>
                        <p className="text-sm text-gray-400">{item.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                          <span className="text-xs text-gray-400">Due: {item.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge className={getStatusColor(item.status)}>{item.status.replace("-", " ")}</Badge>
                        <div className="mt-2">
                          <Progress value={item.completionRate} className="w-20" />
                          <span className="text-xs text-gray-400">{item.completionRate}%</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Audit History</CardTitle>
              <CardDescription className="text-gray-400">Previous compliance audits and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Auditor</TableHead>
                    <TableHead className="text-gray-300">Type</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Score</TableHead>
                    <TableHead className="text-gray-300">Findings</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audits.map((audit) => (
                    <TableRow key={audit.id} className="border-gray-800">
                      <TableCell className="text-gray-300">{audit.date}</TableCell>
                      <TableCell className="text-gray-300">{audit.auditor}</TableCell>
                      <TableCell className="text-gray-300">{audit.type}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(audit.status)}>{audit.status}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {audit.status === "pending" ? "-" : `${audit.score}%`}
                      </TableCell>
                      <TableCell className="text-gray-300">{audit.findings}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Compliance Documents</CardTitle>
              <CardDescription className="text-gray-400">
                Manage compliance-related documents and certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { name: "Business License", status: "valid", expires: "2024-12-31" },
                  { name: "Tax Certificate", status: "valid", expires: "2024-06-30" },
                  { name: "NSSF Certificate", status: "expired", expires: "2023-12-31" },
                  { name: "NHIF Certificate", status: "valid", expires: "2024-03-31" },
                  { name: "Safety Certificate", status: "valid", expires: "2024-09-15" },
                  { name: "Environmental Permit", status: "pending", expires: "2024-08-20" },
                ].map((doc, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-medium text-white mb-2">{doc.name}</h4>
                      <p className="text-sm text-gray-400">Expires: {doc.expires}</p>
                      <div className="flex space-x-2 mt-3">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
