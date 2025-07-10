"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Upload, FileText, Download, Eye, Trash2, Filter, FolderOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { apiService, type Document } from "@/lib/api-service"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const documentStats = [
    {
      title: "Total Documents",
      value: "1,247",
      change: "+23 this week",
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Employee Contracts",
      value: "247",
      change: "All active",
      icon: FolderOpen,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Payslips Generated",
      value: "2,940",
      change: "This year",
      icon: Download,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Pending Reviews",
      value: "15",
      change: "Needs attention",
      icon: Eye,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
  ]

  const categories = ["Contracts", "Payslips", "Identity Documents", "Reviews", "Leave Documents", "Certificates"]

  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true)
        const data = await apiService.getDocuments()
        setDocuments(data)
      } catch (error) {
        console.error("Failed to fetch documents:", error)
        toast({
          title: "Error",
          description: "Failed to load documents. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Generated":
      case "Verified":
      case "Approved":
      case "Valid":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Expired":
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return "📄"
      case "Image":
        return "🖼️"
      case "Document":
        return "📝"
      default:
        return "📁"
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", files[0])

      const response = await apiService.uploadDocument(formData)
      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Document uploaded successfully",
        })

        // Add the new document to the list
        const newDocument = {
          id: result.documentId,
          name: files[0].name,
          category: selectedCategory !== "all" ? selectedCategory : "Uncategorized",
          employee: "Current User",
          size: `${(files[0].size / 1024).toFixed(0)} KB`,
          uploadDate: new Date().toISOString().split("T")[0],
          status: "Pending",
          type: files[0].type.includes("pdf") ? "PDF" : files[0].type.includes("image") ? "Image" : "Document",
          avatar: "CU",
          url: result.url,
        }

        setDocuments([newDocument, ...documents])
      } else {
        throw new Error(result.message || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeleteDocument = async (id: string) => {
    try {
      await apiService.deleteDocument(id)

      // Remove the document from the list
      setDocuments(documents.filter((doc) => doc.id !== id))

      toast({
        title: "Success",
        description: "Document deleted successfully",
      })
    } catch (error) {
      console.error("Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleViewDocument = (document: Document) => {
    toast({
      title: "Document Viewer",
      description: `Viewing ${document.name}`,
    })
  }

  const handleDownloadDocument = (document: Document) => {
    toast({
      title: "Download Started",
      description: `Downloading ${document.name}`,
    })
  }

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-800 bg-black/50 backdrop-blur-sm px-4">
        <SidebarTrigger className="text-white hover:bg-gray-800" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-bold">Document Management</h1>
            <p className="text-sm text-gray-400">Organize and manage all HR documents</p>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <LoadingSpinner size={16} className="mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {documentStats.map((stat, index) => (
            <Card
              key={index}
              className="glassmorphism border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-400 text-sm truncate">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    <p className="text-gray-400 text-sm mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Document Gallery */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner size={40} className="text-red-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map((document) => (
              <Card
                key={document.id}
                className="glassmorphism border-gray-800 hover:border-gray-700 transition-all duration-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getFileIcon(document.type)}</div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-white text-sm truncate">{document.name}</CardTitle>
                        <p className="text-gray-400 text-xs">{document.category}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem
                          className="text-white hover:bg-gray-700"
                          onClick={() => handleViewDocument(document)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-white hover:bg-gray-700"
                          onClick={() => handleDownloadDocument(document)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400 hover:bg-gray-700"
                          onClick={() => handleDeleteDocument(document.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-red-500/20 text-red-400 text-xs">{document.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{document.employee}</p>
                      <p className="text-gray-400 text-xs">Employee</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(document.status)}>{document.status}</Badge>
                    <span className="text-gray-400 text-xs">{document.size}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">Uploaded</span>
                      <span className="text-white">{document.uploadDate}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                      onClick={() => handleViewDocument(document)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => handleDownloadDocument(document)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No documents found matching your criteria.</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Quick Upload Area */}
        <Card className="glassmorphism border-gray-800 border-dashed">
          <CardContent className="p-8">
            <div className="text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">Quick Upload</h3>
              <p className="text-gray-400 mb-4">Drag and drop files here or click to browse</p>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Choose Files"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
