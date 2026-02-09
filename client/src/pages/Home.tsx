import { MainLayout } from '@/components/layout/MainLayout'
import { Hero } from '@/features/landing/components/Hero'
import { Stats } from '@/features/landing/components/Stats'
import { TrendingCarousel } from '@/features/landing/components/TrendingCarousel'

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
