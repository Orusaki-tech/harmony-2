import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size={40} className="text-red-500" />
        <p className="text-lg text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
