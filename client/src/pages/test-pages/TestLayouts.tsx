import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'
import { TrendingWidget } from '@/features/posts/components/TrendingWidget'
import { RulesWidget } from '@/features/spaces/components/RulesWidget'
import { Button, Card } from '@/components/ui'

// Landing Bricks
import { Hero } from '@/features/landing/components/Hero'
import { Stats } from '@/features/landing/components/Stats'
import { TrendingCarousel } from '@/features/landing/components/TrendingCarousel'

const TestLayouts = () => {
  const [view, setView] = useState<'landing' | 'feed' | 'minimal'>('feed')

  const renderControls = (
    <Card className="mb-8 bg-primary/5 border-primary/20">
      <div className="flex items-center gap-4">
        <span className="font-bold text-sm uppercase text-primary">Switch Layout:</span>
        <Button variant={view === 'landing' ? 'primary' : 'secondary'} size="sm" onClick={() => setView('landing')}>Landing</Button>
        <Button variant={view === 'feed' ? 'primary' : 'secondary'} size="sm" onClick={() => setView('feed')}>App Feed</Button>
        <Button variant={view === 'minimal' ? 'primary' : 'secondary'} size="sm" onClick={() => setView('minimal')}>Minimal</Button>
      </div>
    </Card>
  )

  if (view === 'landing') {
    return (
      <MainLayout headerVariant="landing" maxWidth="max-w-7xl">
        {renderControls}
        <Hero />
        <Stats />
        <TrendingCarousel />
      </MainLayout>
    )
  }

  if (view === 'minimal') {
    return (
      <MainLayout headerVariant="landing" maxWidth="max-w-md">
        {renderControls}
        <Card className="mt-10 text-center p-10">
          <h1 className="text-2xl font-bold">Minimal Layout</h1>
          <p className="text-gray-500 mt-2">Used for Login/Signup</p>
        </Card>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      leftSidebar={
        <div className="space-y-6">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
      rightSidebar={
        <>
          <TrendingWidget />
          <RulesWidget />
        </>
      }
    >
      {renderControls}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">App Feed Layout</h1>
        <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
          <p className="text-gray-400">Post Feed Content Goes Here</p>
        </div>
      </div>
    </MainLayout>
  )
}

export default TestLayouts
