import { FormEvent } from 'react'
import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SidebarNav } from "@/features/navigation/components";
import { LoadingSpinner, ErrorState } from "@/components/shared";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { useEditSpace } from "@/features/spaces/hooks/useEditSpace";
import { EditSpaceForm } from "@/features/spaces/components/EditSpaceForm";

export default function EditSpace() {
  const { name } = useParams<{ name: string }>();
  const {
    toasts,
    success: showSuccess,
    error: showError,
    removeToast,
  } = useToast();

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
  } = useEditSpace(name);

  const handleSubmit = async (e: FormEvent) => {
    try {
      await onSubmit(e);
      showSuccess("Space updated successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save changes";
      showError(message);
    }
  };

  if (isLoading) {
    return (
      <MainLayout maxWidth="max-w-3xl" leftSidebar={<SidebarNav />}>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (authError || !space) {
    return (
      <MainLayout maxWidth="max-w-3xl" leftSidebar={<SidebarNav />}>
        <ErrorState
          title="Access Denied"
          message={authError ?? "Space not found"}
          onRetry={onCancel}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout maxWidth="max-w-3xl" leftSidebar={<SidebarNav />}>
      <div className="space-y-6">
        <button
          onClick={onCancel}
          className={cn(
            "flex items-center gap-2 text-gray-500",
            "hover:text-primary transition-colors",
          )}
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm font-bold">Back to r/{space.name}</span>
        </button>

        <div>
          <h1 className="text-3xl font-black dark:text-white">Edit Space</h1>
          <p className="text-gray-500 mt-1">
            Update settings for{" "}
            <span className="font-semibold">{space.displayName}</span>
          </p>
        </div>

        <EditSpaceForm
          space={space}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onChange={onChange}
          onBlur={onBlur}
          onRulesChange={onRulesChange}
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </div>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </MainLayout>
  );
}
