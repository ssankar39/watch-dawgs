'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100">
      <nav className="bg-red-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold hover:text-red-100">
            WatchDawgs
          </Link>
          <div className="space-x-4">
            <Link href="/auth/login" className="hover:text-red-100">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-red-700 mb-6">About WatchDawgs</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              WatchDawgs is dedicated to improving traffic navigation and safety across the University of Georgia campus. 
              We provide real-time incident reporting and traffic updates to help students, faculty, and staff navigate 
              campus efficiently and safely.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Real-time traffic incident reporting</li>
              <li>Community-driven incident updates</li>
              <li>Severity-based filtering and alerts</li>
              <li>Easy navigation across campus routes</li>
              <li>User authentication and personalized dashboard</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="font-semibold text-gray-800">Sarveshwar Sankar</p>
                <p className="text-sm text-gray-600">Project Leader</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="font-semibold text-gray-800">Aly Pabani</p>
                <p className="text-sm text-gray-600">Project Manager</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="font-semibold text-gray-800">Jaylen Grant</p>
                <p className="text-sm text-gray-600">Communication Leader</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="font-semibold text-gray-800">Christopher Ambrose</p>
                <p className="text-sm text-gray-600">GitHub Captain</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Technology</h2>
            <p className="text-gray-700 mb-3">Built with modern web technologies:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>React & Next.js for frontend</li>
              <li>TypeScript for type safety</li>
              <li>TailwindCSS for styling</li>
              <li>Node.js API backend</li>
              <li>MongoDB for data persistence</li>
            </ul>
          </section>

          <div className="flex gap-4 justify-center mt-8">
            <Link
              href="/"
              className="px-6 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
