import { NextResponse } from "next/server"

// Mock data - in a real app, this would come from a database
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

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(employees)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Validate data
  if (!data.name || !data.email || !data.position || !data.department) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  // Create new employee
  const newEmployee = {
    id: (employees.length + 1).toString(),
    ...data,
    status: data.status || "Active",
    joinDate: data.joinDate || new Date().toISOString().split("T")[0],
    avatar: data.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase(),
  }

  // In a real app, we would save to database
  employees.push(newEmployee)

  return NextResponse.json(newEmployee, { status: 201 })
}
