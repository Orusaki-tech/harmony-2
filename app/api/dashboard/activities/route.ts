import { NextResponse } from "next/server"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, this would come from database
  const activities = [
    { name: "John Doe", action: "submitted leave request", time: "2 hours ago", avatar: "JD" },
    { name: "Sarah Wilson", action: "completed onboarding", time: "4 hours ago", avatar: "SW" },
    { name: "Mike Johnson", action: "updated profile", time: "6 hours ago", avatar: "MJ" },
    { name: "Lisa Brown", action: "approved timesheet", time: "8 hours ago", avatar: "LB" },
  ]

  return NextResponse.json(activities)
}
