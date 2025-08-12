import { BookOpen } from 'lucide-react'

interface LoadingProps {
  message?: string
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-blue-600 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}
