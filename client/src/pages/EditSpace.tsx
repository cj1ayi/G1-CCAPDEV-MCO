import { useParams } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { LoadingSpinner, ErrorState } from '@/components/shared'
import { useEditSpace } from '@/features/spaces/hooks/useEditSpace'
import { SpaceForm } from '@/features/spaces/components'
import { PageHeader } from '@/components/shared'

export default function EditSpace() {
  const { name } = useParams<{ name: string }>()

  const {
    space,
    formData,
    errors,
    isLoading,
    isSubmitting,
    authError,
    onChange,
    onBlur,
    onRulesChange,
    onSubmit,
    onCancel,
  } = useEditSpace(name)

  if (isLoading) {
    return (
      <MainLayout maxWidth="max-w-3xl" leftSidebar={<SidebarNav />}>
        <LoadingSpinner />
      </MainLayout>
    )
  }

  if (authError || !space) {
    return (
      <MainLayout maxWidth="max-w-3xl" leftSidebar={<SidebarNav />}>
        <ErrorState
          title="Access Denied"
          message={authError ?? 'Space not found'}
          onRetry={onCancel}
        />
      </MainLayout>
    )
  }

  return (
    <MainLayout maxWidth="max-w-3xl" leftSidebar={<SidebarNav />}>
      <PageHeader
        title="Edit Space"
        subtitle={<>Update settings for <span className="font-semibold">{space.displayName}</span></>}
        backLabel={`Back to r/${space.name}`}
        onBack={onCancel}
      />

      <SpaceForm
        mode="edit"
        space={space}
        formData={formData}
        errors={errors}
        isSubmitting={isSubmitting}
        onChange={onChange}
        onBlur={onBlur}
        onRulesChange={onRulesChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </MainLayout>
  )
}
