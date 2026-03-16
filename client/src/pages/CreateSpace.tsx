import { MainLayout } from '@/components/layout/MainLayout'
import { SidebarNav } from '@/features/navigation/components'
import { SpaceForm } from '@/features/spaces/components'
import { useCreateSpace } from '@/features/spaces/hooks/useCreateSpace'
import { PageHeader } from '@/components/shared'

const CreateSpace = () => {
  const {
    formData,
    errors,
    isSubmitting,
    onChange,
    onRulesChange,
    onSubmit,
    onCancel,
  } = useCreateSpace()

  return (
    <MainLayout maxWidth="max-w-3xl" leftSidebar={<SidebarNav />}>
      <div className="space-y-6">
        <PageHeader
          title="Create a Space"
          subtitle="Start a new community for fellow Lasallians."
          onBack={onCancel}
        />

        <SpaceForm
          mode="create"
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={onChange}
          onRulesChange={onRulesChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </MainLayout>
  )
}

export default CreateSpace
