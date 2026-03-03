import { FormEvent } from 'react'
import { Card, Input, Textarea, Select, Button } from "@/components/ui";
import { Save } from "lucide-react";
import {
  CATEGORIES,
  EditSpaceFormData,
  EditSpaceFormErrors,
  Space,
  SpaceRule,
} from "../types";
import { RulesList } from "./RulesList";
import { formatNumber } from "@/lib/utils";

interface EditSpaceFormProps {
  space: Space;
  formData: EditSpaceFormData;
  errors: EditSpaceFormErrors;
  isSubmitting: boolean;
  onChange: (data: EditSpaceFormData) => void;
  onBlur: (field: keyof EditSpaceFormData) => void;
  onRulesChange: (rules: SpaceRule[]) => void;
  onSubmit: (e: FormEvent) => void
  onCancel: () => void;
}

export const EditSpaceForm = ({
  space,
  formData,
  errors,
  isSubmitting,
  onChange,
  onBlur,
  onRulesChange,
  onSubmit,
  onCancel,
}: EditSpaceFormProps) => {
  const hasErrors =
    !!errors.displayName ||
    !!errors.description ||
    !!errors.icon ||
    !!errors.rules ||
    (errors.ruleErrors ?? []).some((e) => e?.title || e?.description);

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      {/* Read-only metadata */}
      <Card className="p-6">
        <h2 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-wide">
          Space Info (read-only)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="block text-gray-500 mb-1">Space Slug</span>
            <span className="font-semibold dark:text-white">
              r/{space.name}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 mb-1">Created</span>
            <span className="font-semibold dark:text-white">
              {space.createdDate}
            </span>
          </div>
          <div>
            <span className="block text-gray-500 mb-1">Members</span>
            <span className="font-semibold dark:text-white">
              {formatNumber(Number(space.memberCount))}
            </span>
          </div>
        </div>
      </Card>

      {/* Editable fields */}
      <Card className="p-6 space-y-5">
        <h2 className="text-sm font-bold uppercase text-gray-400 tracking-wide">
          General
        </h2>

        <Input
          label="Display Name"
          placeholder="e.g. CCS Student Gov"
          value={formData.displayName}
          maxLength={50}
          required
          error={errors.displayName}
          onChange={(e) =>
            onChange({ ...formData, displayName: e.target.value })
          }
          onBlur={() => onBlur("displayName")}
        />

        <Textarea
          label="Description"
          placeholder="Describe what this community is for..."
          rows={4}
          value={formData.description}
          maxLength={500}
          required
          error={errors.description}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
          onBlur={() => onBlur("description")}
        />

        <Select
          label="Category"
          value={formData.category}
          options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          error={errors.category}
          onChange={(e) =>
            onChange({
              ...formData,
              category: e.target.value as EditSpaceFormData["category"],
            })
          }
          onBlur={() => onBlur("category")}
        />

        <Input
          label="Icon"
          placeholder="e.g. CS"
          maxLength={10}
          value={formData.icon}
          required
          error={errors.icon}
          helperText="Up to 10 characters shown as the space icon."
          onChange={(e) => onChange({ ...formData, icon: e.target.value })}
          onBlur={() => onBlur("icon")}
        />
      </Card>

      {/* Rules */}
      <Card className="p-6">
        <RulesList
          rules={formData.rules}
          ruleErrors={errors.ruleErrors}
          onChange={onRulesChange}
        />
        {errors.rules && (
          <p className="mt-2 text-sm text-red-500">{errors.rules}</p>
        )}
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="secondary"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          isLoading={isSubmitting}
          disabled={hasErrors || isSubmitting}
          leftIcon={<Save className="size-4" />}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};
