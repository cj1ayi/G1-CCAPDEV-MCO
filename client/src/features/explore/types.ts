
export type FilterOption = "best" | "hot" | "new" | "top"

export interface FilterProps {
  active: FilterOption;
  onChange: (value: FilterOption) => void;
}
