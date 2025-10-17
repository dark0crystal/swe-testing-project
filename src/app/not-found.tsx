import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-8">Page not found</p>
        <Link
          href="/"
          className="bg-[#C2E7FF] text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-[#B8D9FF] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
