import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { useTranslation } from '../hooks/useTranslation'

export default function LandingPage() {
  const { t } = useTranslation();
  
  const tiles = [
    { to: '/area', titleKey: 'landing.features.rooftopArea.title', descKey: 'landing.features.rooftopArea.description', icon: (
      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    ) },
    { to: '/material', titleKey: 'landing.features.material.title', descKey: 'landing.features.material.description', icon: (
      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6"/><path d="M10 3v6a4 4 0 1 0 4 0V3"/></svg>
    ) },
    { to: '/rainfall', titleKey: 'landing.features.rainfall.title', descKey: 'landing.features.rainfall.description', icon: (
      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15"/><path d="M8 19v2"/><path d="M16 19v2"/><path d="M12 21v2"/></svg>
    ) },
    { to: '/feasibility', titleKey: 'landing.features.waterFeasibility.title', descKey: 'landing.features.waterFeasibility.description', icon: (
      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 7 6 10 6 13a6 6 0 0 0 12 0c0-3-2-6-6-11z"/></svg>
    ) },
    { to: '/soil', titleKey: 'landing.features.soilAquifer.title', descKey: 'landing.features.soilAquifer.description', icon: (
      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>
    ) },
    { to: '/report', titleKey: 'landing.features.reportChatbot.title', descKey: 'landing.features.reportChatbot.description', icon: (
      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2z"/></svg>
    ) },
  ];
  
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 p-8 text-center fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">{t('landing.title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('landing.subtitle')}</p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link to="/login"><Button size="lg">{t('landing.getStarted')}</Button></Link>
          <Link to="/area"><Button variant="outline" size="lg">{t('landing.skipToSteps')}</Button></Link>
        </div>
      </section>
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <Link to={tile.to} key={tile.to}>
            <Card className="p-5 hover:shadow-lg transition-shadow h-full">
              <div className="flex items-center gap-3 mb-2">
                {tile.icon}
                <h3 className="text-lg font-semibold">{t(tile.titleKey)}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t(tile.descKey)}</p>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
