import { NextResponse } from "next/server"

// Mock data for employee documents
const employeeDocuments: { [employeeId: string]: any[] } = {
  "1": [
    {
      id: "doc-1",
      name: "John_Doe_CV.pdf",
      type: "cv",
      fileType: "application/pdf",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      url: "/api/documents/files/doc-1",
    },
    {
      id: "doc-2",
      name: "AWS_Certificate.pdf",
      type: "certificate",
      fileType: "application/pdf",
      size: "1.2 MB",
      uploadDate: "2024-01-10",
      url: "/api/documents/files/doc-2",
    },
    {
      id: "doc-3",
      name: "Passport_Copy.jpg",
      type: "id",
      fileType: "image/jpeg",
      size: "3.1 MB",
      uploadDate: "2024-01-05",
      url: "/api/documents/files/doc-3",
    },
  ],
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const documents = employeeDocuments[params.id] || []

  return NextResponse.json(documents)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const type = formData.get("type") as string

    if (!files.length || !type) {
      return NextResponse.json({ message: "Missing files or type" }, { status: 400 })
    }

    // Simulate file processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newDocuments = files.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      name: file.name,
      type,
      fileType: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split("T")[0],
      url: `/api/documents/files/doc-${Date.now()}-${index}`,
      employeeId: params.id,
    }))

    // In a real app, we would save to database and storage
    if (!employeeDocuments[params.id]) {
      employeeDocuments[params.id] = []
    }
    employeeDocuments[params.id].push(...newDocuments)

    return NextResponse.json({
      success: true,
      documents: newDocuments,
      message: `${files.length} file(s) uploaded successfully`,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, message: "Failed to upload documents" }, { status: 500 })
  }
}
