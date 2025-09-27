import React from 'react'
import { steps } from '../../routes/steps'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'

export default function StepNav({ className = '' }) {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const idx = steps.findIndex(s => s.path === pathname)
  if (idx === -1) return null

  const prev = idx > 0 ? steps[idx - 1] : null
  const next = idx < steps.length - 1 ? steps[idx + 1] : null

  return (
    <div className={["flex items-center justify-between pt-4", className].join(' ').trim()}>
      <div>
        {prev && (
          <Button variant="outline" onClick={() => nav(prev.path)}>← Back: {prev.title}</Button>
        )}
      </div>
      <div>
        {next && (
          <Button onClick={() => nav(next.path)}>Next: {next.title} →</Button>
        )}
      </div>
    </div>
  )}
