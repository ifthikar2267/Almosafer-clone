"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const TEAL = "#0d9488";

/**
 * Filter section with title (bold small caps) and checkbox grid.
 * grid-cols-2 md:grid-cols-3 gap-3. Each option: Checkbox + label + optional count.
 * valueKey: 'name' | 'id' – use opt.name or opt.id as the selected value (for chips/filter).
 */
export default function FilterSection({ title, options = [], selected = [], onChange, valueKey = "name" }) {
  if (!options.length) return null;

  const handleToggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange?.(next);
  };

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {options.map((opt) => {
          const label = opt.name ?? opt.label ?? String(opt);
          const value = valueKey === "id" ? (opt.id ?? opt.name) : (opt.name ?? opt.id ?? label);
          const count = opt.count;
          const checked = selected.includes(value);

          return (
            <FormControlLabel
              key={value}
              control={
                <Checkbox
                  size="small"
                  checked={checked}
                  onChange={() => handleToggle(value)}
                  sx={{ "&.Mui-checked": { color: TEAL } }}
                />
              }
              label={
                <span className="text-sm text-gray-700">
                  {label}
                  {count != null && <span className="ml-1 text-gray-500">({count})</span>}
                </span>
              }
              className="m-0"
              sx={{ alignItems: "flex-start", "& .MuiFormControlLabel-label": { flex: 1 } }}
            />
          );
        })}
      </div>
    </div>
  );
}
