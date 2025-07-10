import { NextResponse } from "next/server"

// Mock data - would be fetched from database in real app
const employees = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+234 801 234 5678",
    position: "Senior Developer",
    department: "Engineering",
    status: "Active",
    salary: "₦450,000",
    joinDate: "2023-01-15",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+234 802 345 6789",
    position: "Product Manager",
    department: "Product",
    status: "Active",
    salary: "₦520,000",
    joinDate: "2022-11-20",
    avatar: "SW",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@company.com",
    phone: "+234 803 456 7890",
    position: "Sales Executive",
    department: "Sales",
    status: "On Leave",
    salary: "₦320,000",
    joinDate: "2023-03-10",
    avatar: "MJ",
  },
  {
    id: "4",
    name: "Lisa Brown",
    email: "lisa.brown@company.com",
    phone: "+234 804 567 8901",
    position: "HR Specialist",
    department: "Human Resources",
    status: "Active",
    salary: "₦380,000",
    joinDate: "2022-08-05",
    avatar: "LB",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const employee = employees.find((e) => e.id === params.id)

  if (!employee) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 })
  }

  return NextResponse.json(employee)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json()
  const index = employees.findIndex((e) => e.id === params.id)

  if (index === -1) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 })
  }

  // Update employee
  const updatedEmployee = {
    ...employees[index],
    ...data,
  }

  // In a real app, we would update the database
  employees[index] = updatedEmployee

  return NextResponse.json(updatedEmployee)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const index = employees.findIndex((e) => e.id === params.id)

  if (index === -1) {
    return NextResponse.json({ message: "Employee not found" }, { status: 404 })
  }

  // In a real app, we would delete from database
  employees.splice(index, 1)

  return NextResponse.json({ success: true })
}
