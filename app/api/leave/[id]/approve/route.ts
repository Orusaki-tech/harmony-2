import { NextResponse } from "next/server"

// Mock data - would be fetched from database in real app
const leaveRequests = [
  {
    id: "1",
    employee: "John Doe",
    type: "Annual Leave",
    startDate: "2024-01-15",
    endDate: "2024-01-19",
    days: 5,
    reason: "Family vacation",
    status: "Pending",
    appliedDate: "2024-01-01",
    avatar: "JD",
  },
  {
    id: "2",
    employee: "Sarah Wilson",
    type: "Sick Leave",
    startDate: "2024-01-10",
    endDate: "2024-01-12",
    days: 3,
    reason: "Medical appointment",
    status: "Approved",
    appliedDate: "2024-01-08",
    avatar: "SW",
  },
  {
    id: "3",
    employee: "Mike Johnson",
    type: "Personal Leave",
    startDate: "2024-01-20",
    endDate: "2024-01-22",
    days: 3,
    reason: "Personal matters",
    status: "Pending",
    appliedDate: "2024-01-05",
    avatar: "MJ",
  },
]

export async function POST(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = leaveRequests.findIndex((r) => r.id === params.id)

  if (index === -1) {
    return NextResponse.json({ message: "Leave request not found" }, { status: 404 })
  }

  // Update status
  leaveRequests[index].status = "Approved"

  return NextResponse.json(leaveRequests[index])
}
