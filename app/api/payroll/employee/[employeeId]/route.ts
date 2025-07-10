import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { employeeId: string } }) {
  try {
    const { employeeId } = params
    const updateData = await request.json()

    // Simulate database update
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In a real app, this would:
    // 1. Validate the update data
    // 2. Recalculate statutory deductions
    // 3. Update database record
    // 4. Create audit trail

    const updatedEmployee = {
      id: employeeId,
      ...updateData,
      // Recalculate based on new gross salary
      paye: Math.round(updateData.grossSalary * 0.15), // Simplified calculation
      nssf: Math.min(Math.round(updateData.grossSalary * 0.06), 2160),
      nhif: updateData.grossSalary > 100000 ? 1700 : 1300,
      netSalary:
        updateData.grossSalary -
        Math.round(updateData.grossSalary * 0.15) -
        Math.min(Math.round(updateData.grossSalary * 0.06), 2160) -
        (updateData.grossSalary > 100000 ? 1700 : 1300) -
        updateData.otherDeductions,
    }

    return NextResponse.json(updatedEmployee)
  } catch (error) {
    console.error("Employee payroll update error:", error)
    return NextResponse.json({ success: false, message: "Failed to update employee payroll" }, { status: 500 })
  }
}
