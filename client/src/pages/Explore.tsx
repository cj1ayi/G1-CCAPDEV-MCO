import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Filter, Feed } from '@/features/explore/components'
import { DefaultLeftSidebar, DefaultRightSidebar } from '@/components/layout'

const Explore = () => {
  const [currentSort, setCurrentSort] = useState<
  'best' | 'hot' | 'new' | 'top'>('best')

  return (
    <MainLayout
      maxWidth="max-w-2xl"
      leftSidebar={
        <DefaultLeftSidebar />
      }
      rightSidebar={
        <DefaultRightSidebar />
      }
    >
      <Filter active={currentSort} onChange={setCurrentSort} />
      <Feed sortBy={currentSort} />
    </MainLayout>
  )
}

export default Explore
