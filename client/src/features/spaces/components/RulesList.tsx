import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { SpaceRule } from "../types";
import { RuleEditor } from "./RuleEditor";

const MAX_RULES = 10;

interface RulesListProps {
  rules: SpaceRule[];
  ruleErrors?: { title?: string; description?: string }[];
  onChange: (rules: SpaceRule[]) => void;
}

export const RulesList = ({
  rules,
  ruleErrors = [],
  onChange,
}: RulesListProps) => {
  const handleRuleChange = (index: number, updated: SpaceRule) => {
    const next = rules.map((r, i) => (i === index ? updated : r));
    onChange(next);
  };

  const handleRuleDelete = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  const handleAddRule = () => {
    if (rules.length >= MAX_RULES) return;
    onChange([...rules, { title: "", description: "" }]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold dark:text-white">
          Rules
          <span className="ml-2 text-gray-400 font-normal">
            ({rules.length}/{MAX_RULES})
          </span>
        </h3>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={handleAddRule}
          disabled={rules.length >= MAX_RULES}
          leftIcon={<Plus className="size-4" />}
        >
          Add Rule
        </Button>
      </div>

      {rules.map((rule, i) => (
        <RuleEditor
          key={i}
          rule={rule}
          index={i}
          titleError={ruleErrors[i]?.title}
          descriptionError={ruleErrors[i]?.description}
          canDelete={rules.length > 1}
          onChange={handleRuleChange}
          onDelete={handleRuleDelete}
        />
      ))}
    </div>
  );
};
