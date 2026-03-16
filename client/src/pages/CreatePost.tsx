import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { YourSpacesWidget } from '@/features/spaces/components'
import { Card } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useCreatePost } from '@/features/posts/hooks/useCreatePost'
import { PostForm } from '@/features/posts/components/PostForm'
import { PageHeader } from '@/components/shared'

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
      <PageHeader
        title="Create a Post"
        subtitle="Share your thoughts with the community"
        onBack={() => navigate(-1)}
      />

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
