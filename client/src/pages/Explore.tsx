import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'
import { TrendingWidget } from '@/features/posts/components/TrendingWidget'
import { RulesWidget } from '@/features/spaces/components/RulesWidget'
import { Filter } from '@/features/explore/components/Filter'
import { Feed } from '@/features/explore/components/Feed'

const Explore = () => {
  const [currentSort, setCurrentSort] = useState<'best' | 'hot' | 'new' | 'top'>('best')

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
