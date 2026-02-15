import { MainLayout } from '@/components/layout/MainLayout'

import { 
  Hero,
  Stats,
  TrendingCarousel,
} from '@/features/landing/components/'

const Home = () => {
  return (
    <MainLayout 
      headerVariant="landing" 
      maxWidth="max-w-7xl" 
    >
      <Hero />
      <Stats />
      <TrendingCarousel />
    </MainLayout>
  )
}

export default Home
