"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-auto w-full items-center justify-start gap-1 border-b-2 border-[var(--theme-elevation-300)] bg-transparent p-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex min-h-10 items-center justify-center border-2 border-b-0 border-transparent px-3 py-2 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-[var(--theme-elevation-100)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-success-500)] data-[state=active]:border-[var(--theme-elevation-300)] data-[state=active]:bg-[var(--theme-bg)] data-[state=active]:shadow-[3px_0_0_var(--theme-elevation-300)]",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "border-2 border-t-0 border-[var(--theme-elevation-300)] bg-[var(--theme-bg)] p-4 outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
