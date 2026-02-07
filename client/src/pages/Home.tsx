import { Header } from '@/components/layout/Header'

const myDefaultUser =  { name: 'Diane Panganiban' };
const Home = () => {
  
  return (
    <>
    <Header user={myDefaultUser} />
    </>
  )
}

export default Home
