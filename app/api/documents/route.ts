import { NextResponse } from "next/server"

// Mock data
const documents = [
  {
    id: "1",
    name: "Employment_Contract_John_Doe.pdf",
    category: "Contracts",
    employee: "John Doe",
    size: "2.4 MB",
    uploadDate: "2024-01-15",
    status: "Active",
    type: "PDF",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Payslip_December_2024_Sarah_Wilson.pdf",
    category: "Payslips",
    employee: "Sarah Wilson",
    size: "1.2 MB",
    uploadDate: "2024-01-01",
    status: "Generated",
    type: "PDF",
    avatar: "SW",
  },
  {
    id: "3",
    name: "ID_Copy_Mike_Johnson.jpg",
    category: "Identity Documents",
    employee: "Mike Johnson",
    size: "3.1 MB",
    uploadDate: "2024-01-10",
    status: "Verified",
    type: "Image",
    avatar: "MJ",
  },
  {
    id: "4",
    name: "Performance_Review_Lisa_Brown_2024.docx",
    category: "Reviews",
    employee: "Lisa Brown",
    size: "856 KB",
    uploadDate: "2024-01-05",
    status: "Pending",
    type: "Document",
    avatar: "LB",
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(documents)
}
