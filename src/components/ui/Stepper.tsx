import React from 'react'
import { steps } from '../../routes/steps'
import { NavLink, useLocation } from 'react-router-dom'

export default function Stepper() {
  const { pathname } = useLocation()
  const current = Math.max(steps.findIndex(s => s.path === pathname), 0)
  const isStepRoute = steps.some(s => s.path === pathname)
  if (!isStepRoute) return null

  return (
    <div className="container py-4 fade-in-up">
      <ol className="flex items-center gap-2 overflow-x-auto" aria-label="Progress">
        {steps.map((s, i) => {
          const done = i < current
          const active = i === current
          return (
            <li key={s.path} className="flex items-center gap-2 min-w-max">
              <NavLink to={s.path} className="flex items-center gap-2 group">
                <span
                  className={[
                    'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border',
                    done ? 'bg-blue-600 text-white border-blue-600' : active ? 'bg-blue-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-gray-700' : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                  ].join(' ')}
                >
                  {i + 1}
                </span>
                <span className={['text-sm', active ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'].join(' ')}>{s.title}</span>
              </NavLink>
              {i < steps.length - 1 && (
                <div className={['h-px w-8 md:w-14', done ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'].join(' ')} />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
