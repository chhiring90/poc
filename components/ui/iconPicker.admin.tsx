"use client";
import { useMemo, useState } from "react";
import { FieldLabel, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";
import { icons } from "lucide-react";

const allNames = Object.keys(icons);
const PAGE_SIZE = 60;

export const IconPicker: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue } = useField<string>({ path });
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allNames.filter((n) => n.toLowerCase().includes(q));
  }, [query]);
  const visibleResults = results.slice(0, visibleCount);

  const Selected = value ? icons[value as keyof typeof icons] : null;

  return (
    <div style={{ marginBottom: 24 }}>
      <FieldLabel label={field.label || field.name} path={path} />

      {value && Selected && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            margin: "8px 0",
          }}
        >
          <Selected size={20} />
          <span>{value}</span>
          <button
            type="button"
            onClick={() => setValue(null)}
            style={{ marginLeft: "auto" }}
          >
            Clear
          </button>
        </div>
      )}

      <input
        type="search"
        placeholder="Search icons..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setVisibleCount(PAGE_SIZE);
        }}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 8,
          background: "var(--theme-input-bg)",
          border: "1px solid var(--theme-elevation-150)",
          color: "var(--theme-text)",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(44px, 1fr))",
          gap: 6,
          maxHeight: 220,
          overflowY: "auto",
        }}
      >
        {visibleResults.map((name) => {
          const Icon = icons[name as keyof typeof icons];
          const active = name === value;
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => setValue(name)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 44,
                cursor: "pointer",
                color: "var(--theme-text)",
                background: active
                  ? "var(--theme-elevation-200)"
                  : "var(--theme-elevation-50)",
                border: active
                  ? "2px solid var(--theme-success-500)"
                  : "1px solid var(--theme-elevation-150)",
              }}
            >
              <Icon size={20} />
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: 8,
        }}
      >
        <span>
          Showing {visibleResults.length} of {results.length} icons
        </span>
        {visibleResults.length < results.length && (
          <button
            type="button"
            onClick={() =>
              setVisibleCount((count) =>
                Math.min(count + PAGE_SIZE, results.length),
              )
            }
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};
