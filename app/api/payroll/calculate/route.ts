import { NextResponse } from "next/server"

// PAYE calculation brackets for Kenya (2024 rates)
const PAYE_BRACKETS = [
  { min: 0, max: 24000, rate: 0.1 },
  { min: 24001, max: 32333, rate: 0.25 },
  { min: 32334, max: 500000, rate: 0.3 },
  { min: 500001, max: 800000, rate: 0.325 },
  { min: 800001, max: Number.POSITIVE_INFINITY, rate: 0.35 },
]

// NSSF rates (2024)
const NSSF_RATE = 0.06 // 6% of pensionable pay
const NSSF_MAX = 2160 // Maximum monthly contribution

// NHIF rates (2024)
const NHIF_BRACKETS = [
  { min: 0, max: 5999, amount: 150 },
  { min: 6000, max: 7999, amount: 300 },
  { min: 8000, max: 11999, amount: 400 },
  { min: 12000, max: 14999, amount: 500 },
  { min: 15000, max: 19999, amount: 600 },
  { min: 20000, max: 24999, amount: 750 },
  { min: 25000, max: 29999, amount: 850 },
  { min: 30000, max: 34999, amount: 900 },
  { min: 35000, max: 39999, amount: 950 },
  { min: 40000, max: 44999, amount: 1000 },
  { min: 45000, max: 49999, amount: 1100 },
  { min: 50000, max: 59999, amount: 1200 },
  { min: 60000, max: 69999, amount: 1300 },
  { min: 70000, max: 79999, amount: 1400 },
  { min: 80000, max: 89999, amount: 1500 },
  { min: 90000, max: 99999, amount: 1600 },
  { min: 100000, max: Number.POSITIVE_INFINITY, amount: 1700 },
]

function calculatePAYE(grossSalary: number): number {
  let paye = 0
  let remainingSalary = grossSalary

  for (const bracket of PAYE_BRACKETS) {
    if (remainingSalary <= 0) break

    const taxableInBracket = Math.min(remainingSalary, bracket.max - bracket.min + 1)
    paye += taxableInBracket * bracket.rate
    remainingSalary -= taxableInBracket
  }

  return Math.round(paye)
}

function calculateNSSF(grossSalary: number): number {
  const nssf = grossSalary * NSSF_RATE
  return Math.min(Math.round(nssf), NSSF_MAX)
}

function calculateNHIF(grossSalary: number): number {
  for (const bracket of NHIF_BRACKETS) {
    if (grossSalary >= bracket.min && grossSalary <= bracket.max) {
      return bracket.amount
    }
  }
  return 1700 // Default maximum
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { period, employeeIds } = data

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock employee data - in real app, fetch from database
    const employees = [
      {
        id: "emp_001",
        name: "John Doe",
        position: "Senior Developer",
        department: "Engineering",
        grossSalary: 120000,
        otherDeductions: 5000,
        avatar: "JD",
      },
      {
        id: "emp_002",
        name: "Sarah Wilson",
        position: "Product Manager",
        department: "Product",
        grossSalary: 150000,
        otherDeductions: 3000,
        avatar: "SW",
      },
      {
        id: "emp_003",
        name: "Mike Johnson",
        position: "Sales Executive",
        department: "Sales",
        grossSalary: 80000,
        otherDeductions: 2000,
        avatar: "MJ",
      },
      {
        id: "emp_004",
        name: "Lisa Brown",
        position: "HR Specialist",
        department: "Human Resources",
        grossSalary: 95000,
        otherDeductions: 1500,
        avatar: "LB",
      },
      {
        id: "emp_005",
        name: "David Chen",
        position: "Marketing Manager",
        department: "Marketing",
        grossSalary: 110000,
        otherDeductions: 2500,
        avatar: "DC",
      },
    ]

    // Filter employees if specific IDs provided
    const targetEmployees = employeeIds ? employees.filter((emp) => employeeIds.includes(emp.id)) : employees

    // Calculate payroll for each employee
    const calculations = targetEmployees.map((employee) => {
      const paye = calculatePAYE(employee.grossSalary)
      const nssf = calculateNSSF(employee.grossSalary)
      const nhif = calculateNHIF(employee.grossSalary)
      const netSalary = employee.grossSalary - paye - nssf - nhif - employee.otherDeductions

      return {
        ...employee,
        paye,
        nssf,
        nhif,
        netSalary,
        status: "Calculated" as const,
      }
    })

    const result = {
      success: true,
      message: `Payroll calculated for ${period}`,
      processedCount: calculations.length,
      calculations,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payroll calculation error:", error)
    return NextResponse.json({ success: false, message: "Failed to calculate payroll" }, { status: 500 })
  }
}
