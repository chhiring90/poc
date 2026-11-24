"use client";

import { Check } from "lucide-react";
import { Tabs } from "radix-ui";
import { PlaceholderText } from "@/components/layouts/packages/placeholder-text";
import type { PackageDeliverableGroup } from "@/lib/type/package.type";

function Checklist({ group }: { group: PackageDeliverableGroup }) {
  const items = group.items ?? [];
  return (
    <>
      {group.intro && (
        <p className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-primary">
          {group.intro}
        </p>
      )}
      <ul className="space-y-3.5">
        {items.map(({ id, text }, index) => (
          <li key={id ?? `${text}-${index}`} className="flex gap-3 leading-snug">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 border-border bg-card text-primary"
            >
              <Check className="size-3.5" strokeWidth={3} />
            </span>
            <span>
              <PlaceholderText text={text} />
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

/** One checklist, or tabs when a package delivers different things per size or step. */
export function PackageDeliverables({
  groups,
  headingId,
}: {
  groups: PackageDeliverableGroup[];
  headingId: string;
}) {
  const visible = groups.filter((group) => (group.items ?? []).length > 0);
  if (visible.length === 0) return null;

  return (
    <div className="border-2 border-border bg-background shadow-[var(--shadow-card)]">
      <h3
        id={headingId}
        className="border-b-2 border-border bg-secondary px-6 py-4 font-display text-xl font-bold text-secondary-foreground"
      >
        What we deliver
      </h3>

      {visible.length === 1 ? (
        <div className="px-6 py-6">
          {visible[0].heading && (
            <p className="mb-4 font-display text-lg font-bold">{visible[0].heading}</p>
          )}
          <Checklist group={visible[0]} />
        </div>
      ) : (
        <Tabs.Root defaultValue="0">
          <Tabs.List
            aria-labelledby={headingId}
            className="flex flex-wrap border-b-2 border-border bg-muted"
          >
            {visible.map((group, index) => (
              <Tabs.Trigger
                key={group.id ?? index}
                value={String(index)}
                className="-mb-0.5 border-b-2 border-r-2 border-border px-4 py-3 text-sm font-bold text-muted-foreground transition-colors last:border-r-0 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring data-[state=active]:border-b-background data-[state=active]:bg-background data-[state=active]:text-primary"
              >
                {group.heading || `Part ${index + 1}`}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {visible.map((group, index) => (
            <Tabs.Content
              key={group.id ?? index}
              value={String(index)}
              className="px-6 py-6 outline-none"
            >
              <Checklist group={group} />
            </Tabs.Content>
          ))}
        </Tabs.Root>
      )}
    </div>
  );
}
