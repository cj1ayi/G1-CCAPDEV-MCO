import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useCreatePost } from '@/features/posts/hooks/useCreatePost'
import { PostForm } from '@/features/posts/components/PostForm'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const {
    formData,
    tagInput,
    errors,
    joinedSpaces,
    isSubmitting,
    selectedSpace,
    setField,
    setTagInput,
    addTag,
    removeTag,
    handleSubmit,
  } = useCreatePost()

  return (
    <MainLayout
      maxWidth="max-w-3xl"
      leftSidebar={
        <div className="space-y-6">
          <SidebarNav />
          <div
            className={cn(
              'h-px bg-gray-200',
              'dark:bg-gray-800',
            )}
          />
          <YourSpacesWidget />
        </div>
      }
    >
      <Card className="mb-4">
        <button
          onClick={() => navigate(-1)}
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
            'text-2xl font-bold mb-1',
            'text-gray-900 dark:text-white',
          )}
        >
          Create a Post
        </h1>
        <p
          className={cn(
            'text-sm',
            'text-gray-500 dark:text-gray-400',
          )}
        >
          Share your thoughts with the community
        </p>
      </Card>

      <Card>
        <PostForm
          mode="create"
          formData={formData}
          tagInput={tagInput}
          errors={errors}
          joinedSpaces={joinedSpaces}
          isSubmitting={isSubmitting}
          selectedSpace={selectedSpace}
          onFieldChange={setField}
          onTagInputChange={setTagInput}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          onSubmit={handleSubmit}
        />
      </Card>
    </MainLayout>
  )
}
