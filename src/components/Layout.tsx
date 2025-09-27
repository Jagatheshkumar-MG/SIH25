import React from 'react'
import Navbar from './Navbar'
import Stepper from './ui/Stepper'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <Stepper />
      <main className="container py-6">{children}</main>
      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-10 text-sm text-gray-500 dark:text-gray-400">
        <div className="container">&copy; {new Date().getFullYear()} RWH Feasibility</div>
      </footer>
    </div>
  )
}
