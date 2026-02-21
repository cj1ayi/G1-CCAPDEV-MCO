import { MainLayout } from '@/components/layout/MainLayout'
import { SpaceForm } from '@/features/spaces/components'
import { useCreateSpace } from '@/features/spaces/hooks/useCreateSpace'
import { DefaultLeftSidebar } from '@/components/layout'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const CreateSpace = () => {
  const { handleCreate, isSubmitting, onCancel } = useCreateSpace()

  return (
    <MainLayout
      maxWidth="max-w-3xl"
      leftSidebar={<DefaultLeftSidebar/>}
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
          onSubmit={handleCreate} 
          onCancel={onCancel} 
          isLoading={isSubmitting} 
        />
      </div>
    </MainLayout>
  )
}

export default CreateSpace
