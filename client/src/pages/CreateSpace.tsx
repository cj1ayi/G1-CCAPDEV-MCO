import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { SpaceForm } from '@/features/spaces/components'
import { useCreateSpace } from '@/features/spaces/hooks/useCreateSpace'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'

const CreateSpace = () => {
  const { handleCreate, isSubmitting, onCancel } = useCreateSpace()
  const { toasts, error: showError, removeToast } = useToast()

  const handleSubmit = async (data: any) => {
    try {
      await handleCreate(data)
    } catch (error) {
      showError('Error creating space. Please try again.')
    }
  }

  return (
    <MainLayout
      maxWidth="max-w-3xl"
      leftSidebar={<SidebarNav />}
    >
      <div className="space-y-6">
        <button 
          onClick={onCancel}
          className={cn(
            "flex items-center gap-2 text-gray-500",
            "hover:text-primary transition-colors")}
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm font-bold">Back</span>
        </button>

        <div>
          <h1 className="text-3xl font-black dark:text-white">
            Create a Space
          </h1>
          <p className="text-gray-500 mt-1">
            Start a new community for fellow Lasallians.
          </p>
        </div>

        <SpaceForm 
          onSubmit={handleSubmit} 
          onCancel={onCancel} 
          isLoading={isSubmitting} 
        />
      </div>

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </MainLayout>
  )
}

export default CreateSpace
