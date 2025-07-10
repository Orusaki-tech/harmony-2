import { NextResponse } from "next/server"

// Mock data
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
  {
    id: "4",
    employee: "Lisa Brown",
    type: "Maternity Leave",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    days: 90,
    reason: "Maternity leave",
    status: "Approved",
    appliedDate: "2023-12-15",
    avatar: "LB",
  },
]

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(leaveRequests)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Validate data
  if (!data.type || !data.startDate || !data.endDate || !data.reason) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  // Calculate days
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // Create new leave request
  const newLeaveRequest = {
    id: (leaveRequests.length + 1).toString(),
    employee: data.employee || "Current User",
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    days,
    reason: data.reason,
    status: "Pending",
    appliedDate: new Date().toISOString().split("T")[0],
    avatar: data.avatar || "CU",
  }

  // In a real app, we would save to database
  leaveRequests.push(newLeaveRequest)

  return NextResponse.json(newLeaveRequest, { status: 201 })
}
