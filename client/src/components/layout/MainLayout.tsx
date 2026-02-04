import { ReactNode } from 'react'
import { Footer } from './Footer'

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> woo */}
      
      <div className="flex flex-1 max-w-[1440px] w-full mx-auto">
        {/* <Navbar /> hehe */}
        
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 md:p-6 bg-background-light dark:bg-background-dark">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  )
}
