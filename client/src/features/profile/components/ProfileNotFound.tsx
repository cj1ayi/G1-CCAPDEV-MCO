import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components/SidebarNav'
import { YourSpacesWidget } from '@/features/spaces/components/YourSpacesWidget'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UserX } from 'lucide-react'

export const ProfileNotFound = () => {
  const navigate = useNavigate()

  return (
    <MainLayout
      maxWidth="max-w-full"
      leftSidebar={
        <div className="flex flex-col gap-6 px-4">
          <SidebarNav />
          <div className="h-px bg-gray-200 dark:bg-gray-800" />
          <YourSpacesWidget />
        </div>
      }
    >
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <UserX className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                User not found
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This profile doesn't exist or may have been removed.
              </p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
