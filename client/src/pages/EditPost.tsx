import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import {
  LoadingSpinner,
  ErrorState,
} from '@/components/shared'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useEditPost } from '@/features/posts/hooks/useEditPost'
import { PostForm } from '@/features/posts/components/PostForm'

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()

  const {
    formData,
    tagInput,
    errors,
    isLoading,
    isSubmitting,
    loadError,
    setField,
    setTagInput,
    addTag,
    removeTag,
    handleSubmit,
    handleCancel,
  } = useEditPost(id)

  if (isLoading) {
    return (
      <MainLayout maxWidth="max-w-3xl">
        <LoadingSpinner text="Loading post..." />
      </MainLayout>
    )
  }

  if (loadError) {
    return (
      <MainLayout maxWidth="max-w-3xl">
        <ErrorState
          title={loadError}
          onRetry={handleCancel}
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      maxWidth="max-w-3xl"
      leftSidebar={
        <div className="flex flex-col gap-6">
          <SidebarNav />
          <div
            className={cn(
              'h-px bg-gray-200',
              'dark:bg-gray-800',
            )}
          />
        </div>
      }
    >
      <Card className="mb-4">
        <button
          onClick={handleCancel}
          className={cn(
            'flex items-center gap-2 mb-4',
            'text-gray-600 dark:text-gray-400',
            'hover:text-primary transition-colors',
          )}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>
        <h1
          className={cn(
            'text-2xl font-bold mb-2',
            'text-gray-900 dark:text-white',
          )}
        >
          Edit Post
        </h1>
      </Card>

      <Card>
        <PostForm
          mode="edit"
          formData={formData}
          tagInput={tagInput}
          errors={errors}
          isSubmitting={isSubmitting}
          onFieldChange={setField}
          onTagInputChange={setTagInput}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Card>
    </MainLayout>
  )
}
