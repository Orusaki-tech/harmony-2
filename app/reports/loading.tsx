import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ReportsLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-white">Reports & Analytics</h2>
      </div>
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    </div>
  )
}
