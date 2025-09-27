import React from 'react'

export default function Card({ className = '', children, ...props }) {
  const classes = ['rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm', className].join(' ').trim()
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
