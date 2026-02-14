import { useState } from "react"

type FilterOption = "best" | "hot" | "new" | "top"

interface FilterProps {
  active: FilterOption;
  onChange: (value: FilterOption) => void;
}

export function Filter({ active, onChange }: FilterProps) {
  const tabs: { label: string; value: FilterOption }[] = [
    { label: "Best", value: "best" },
    { label: "Hot", value: "hot" },
    { label: "New", value: "new" },
    { label: "Top", value: "top" },
  ]

  return (
    <div className="flex items-center gap-6 border-b border-border-light dark:border-border-dark pb-2 mb-5">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative text-sm font-medium transition-colors ${
            active === tab.value
              ? "text-text-main-light dark:text-text-main-dark"
              : "text-text-sub-light dark:text-text-sub-dark hover:text-text-main-light dark:hover:text-text-main-dark"
          }`}
        >
          {tab.label}
          {active === tab.value && (
            <span className="absolute left-0 -bottom-2 h-0.5 w-full bg-primary rounded" />
          )}
        </button>
      ))}
    </div>
  )
}
