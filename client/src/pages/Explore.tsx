import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'
import { TrendingWidget } from '@/features/posts/components'
import { RulesWidget } from '@/features/spaces/components'
import { Filter, Feed } from '@/features/explore/components'

const Explore = () => {
  const [currentSort, setCurrentSort] = useState<
  'best' | 'hot' | 'new' | 'top'>('best')

  return (
    <MainLayout
      maxWidth="max-w-6xl"
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
      <Filter active={currentSort} onChange={setCurrentSort} />
      <Feed sortBy={currentSort} />
    </MainLayout>
  )
}

export default Explore
