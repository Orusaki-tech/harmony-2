import { NextResponse } from "next/server"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, this would be calculated from database
  const stats = {
    employees: 247,
    payroll: "₦2.4M",
    pendingLeaves: 15,
    complianceScore: 94,
  }

  return NextResponse.json(stats)
}
