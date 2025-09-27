import React from 'react'

const base = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-gray-950'

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
  secondary: 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white',
  outline: 'border border-gray-400 bg-white hover:bg-gray-50 text-gray-800 shadow-sm',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-900 dark:text-gray-100',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4',
  lg: 'h-11 px-6 text-base',
}

export default function Button({ className = '', variant = 'primary', size = 'md', ...props }) {
  const classes = [base, variants[variant] ?? variants.primary, sizes[size] ?? sizes.md, className].join(' ').trim()
  return <button className={classes} {...props} />
}
