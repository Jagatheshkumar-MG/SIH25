import React, { useEffect, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import Button from './ui/Button'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { useTranslation } from '../hooks/useTranslation'
import { availableLanguages } from '../translations'
import { useAppData } from '../context/AppDataContext'

function useTheme() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const enabled = stored ? stored === 'dark' : prefers
    document.documentElement.classList.toggle('dark', enabled)
    setIsDark(enabled)
  }, [])
  const toggle = () => {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setIsDark(next)
  }
  return { isDark, toggle }
}

export default function Navbar() {
  const { isDark, toggle } = useTheme()
  const { user, logout } = useAuth()
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()
  const { landType } = useAppData()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const linkBase = 'px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800'
  const active = 'bg-gray-200 dark:bg-gray-700'
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <img 
            src="/logo.png" 
            alt="App Logo" 
            className="w-8 h-8 rounded-md shadow-sm"
          />
          {t('header.title')}
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/area" className={({ isActive }) => [linkBase, isActive ? active : ''].join(' ').trim()}>{t('header.rooftop')}</NavLink>
          <NavLink to="/material" className={({ isActive }) => [linkBase, isActive ? active : ''].join(' ').trim()}>{t('header.material')}</NavLink>
          <NavLink to="/rainfall" className={({ isActive }) => [linkBase, isActive ? active : ''].join(' ').trim()}>{t('header.rainfall')}</NavLink>
          <NavLink to="/feasibility" className={({ isActive }) => [linkBase, isActive ? active : ''].join(' ').trim()}>{t('header.feasibility')}</NavLink>
          <NavLink to="/soil" className={({ isActive }) => [linkBase, isActive ? active : ''].join(' ').trim()}>{t('header.soil')}</NavLink>
          <NavLink to="/report" className={({ isActive }) => [linkBase, isActive ? active : ''].join(' ').trim()}>{t('header.report')}</NavLink>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login?mode=signup"><Button size="sm">{t('header.signup')}</Button></Link>
              <Link to="/login"><Button variant="outline" size="sm">{t('header.login')}</Button></Link>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">{user.email}</span>
              <Button variant="outline" size="sm" onClick={logout}>{t('header.logout')}</Button>
            </>
          )}
          
          {/* Language Switcher */}
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setLangMenuOpen(!langMenuOpen)}>
              {availableLanguages.find(l => l.code === language)?.code.toUpperCase() || 'EN'}
            </Button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-50 min-w-[120px]">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    className={[
                      "w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-sm",
                      language === lang.code ? "bg-gray-100 dark:bg-gray-800" : ""
                    ].join(' ')}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Land Type Indicator */}
          {landType && (
            <div className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
              {landType === 'Urban' ? '🏢' : '🌳'} {landType}
            </div>
          )}
          
          <Button variant="ghost" size="sm" aria-label="Toggle dark mode" onClick={toggle}>
            {isDark ? '🌙' : '☀️'}
          </Button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          {/* Language Switcher Mobile */}
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setLangMenuOpen(!langMenuOpen)}>
              {availableLanguages.find(l => l.code === language)?.code.toUpperCase() || 'EN'}
            </Button>
            {langMenuOpen && (
              <div className="absolute right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg z-50 min-w-[120px]">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    className={[
                      "w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-sm",
                      language === lang.code ? "bg-gray-100 dark:bg-gray-800" : ""
                    ].join(' ')}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Land Type Indicator Mobile */}
          {landType && (
            <div className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
              {landType === 'Urban' ? '🏢' : '🌳'} {landType}
            </div>
          )}
          
          <Button variant="ghost" size="sm" aria-label="Toggle dark mode" onClick={toggle}>
            {isDark ? '🌙' : '☀️'}
          </Button>
          <Button variant="outline" size="sm" aria-label="Toggle menu" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? '✕' : '☰'}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95">
          <div className="container py-2 space-y-2">
            <nav className="flex flex-col">
              <NavLink to="/area" onClick={() => setMobileOpen(false)} className={({ isActive }) => [linkBase, 'mb-1', isActive ? active : ''].join(' ').trim()}>{t('header.rooftop')}</NavLink>
              <NavLink to="/material" onClick={() => setMobileOpen(false)} className={({ isActive }) => [linkBase, 'mb-1', isActive ? active : ''].join(' ').trim()}>{t('header.material')}</NavLink>
              <NavLink to="/rainfall" onClick={() => setMobileOpen(false)} className={({ isActive }) => [linkBase, 'mb-1', isActive ? active : ''].join(' ').trim()}>{t('header.rainfall')}</NavLink>
              <NavLink to="/feasibility" onClick={() => setMobileOpen(false)} className={({ isActive }) => [linkBase, 'mb-1', isActive ? active : ''].join(' ').trim()}>{t('header.feasibility')}</NavLink>
              <NavLink to="/soil" onClick={() => setMobileOpen(false)} className={({ isActive }) => [linkBase, 'mb-1', isActive ? active : ''].join(' ').trim()}>{t('header.soil')}</NavLink>
              <NavLink to="/report" onClick={() => setMobileOpen(false)} className={({ isActive }) => [linkBase, isActive ? active : ''].join(' ').trim()}>{t('header.report')}</NavLink>
            </nav>
            <div className="flex items-center gap-2">
              {!user ? (
                <>
                  <Link to="/login?mode=signup" onClick={() => setMobileOpen(false)}><Button size="sm">{t('header.signup')}</Button></Link>
                  <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm">{t('header.login')}</Button></Link>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => { logout(); setMobileOpen(false) }}>{t('header.logout')}</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
