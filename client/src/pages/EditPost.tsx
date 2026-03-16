import { useParams } from 'react-router-dom'
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
import { PageHeader } from '@/components/shared'

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
     <PageHeader
        title="Edit Post"
        onBack={handleCancel}
      />
      
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
