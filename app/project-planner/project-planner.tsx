"use client";

/**
 * ProjectPlanner
 * A 4-step client intake form: project type -> details -> brief & upload -> review.
 *
 * Dependencies:
 *   npm install framer-motion lucide-react
 *   npx shadcn@latest add button input textarea card label
 *
 * Usage:
 *   import ProjectPlanner from '@/components/ProjectPlanner';
 *   <ProjectPlanner onSubmit={async (data) => { ... send to your API ... }} />
 *
 * Design language: a "blueprint" motif — registration-mark corners, a mono
 * type for labels/metadata, and a drawn progress line — since the subject
 * (planning something to be built) is architectural in nature. Standard
 * controls (inputs, textarea, nav buttons, card shell) are shadcn/ui
 * primitives styled via className; the bespoke selectable cards/pills stay
 * as plain buttons since shadcn has no equivalent for those.
 */

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Globe,
  Smartphone,
  Upload,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Types & static data
// ---------------------------------------------------------------------------

type ProjectTypeId = "website" | "webapp" | "mobile";

export interface ProjectPlannerData {
  projectType: ProjectTypeId | null;
  projectName: string;
  company: string;
  timeline: string;
  budget: string;
  file: File | null;
  notes: string;
}

interface ProjectPlannerProps {
  onSubmit?: (data: ProjectPlannerData) => Promise<void> | void;
}

const STEPS = [
  { id: "type", label: "Project type", hint: "01 — What we\u2019re building" },
  { id: "details", label: "Project details", hint: "02 — The essentials" },
  { id: "brief", label: "Brief & materials", hint: "03 — Upload & describe" },
  { id: "review", label: "Review & send", hint: "04 — Confirm" },
] as const;

const PROJECT_TYPES: {
  id: ProjectTypeId;
  label: string;
  desc: string;
  icon: typeof Globe;
}[] = [
  {
    id: "website",
    label: "Website",
    desc: "A marketing site, portfolio, or content-led presence.",
    icon: Globe,
  },
  {
    id: "webapp",
    label: "Web app",
    desc: "A product people log into — dashboards, tools, platforms.",
    icon: AppWindow,
  },
  {
    id: "mobile",
    label: "Mobile app",
    desc: "Native or cross-platform, built for iOS and Android.",
    icon: Smartphone,
  },
];

const TIMELINES = [
  "1\u20133 months",
  "3\u20136 months",
  "6+ months",
  "Not sure yet",
];
const BUDGETS = [
  "Under \u00a35k",
  "\u00a35k\u2013\u00a315k",
  "\u00a315k\u2013\u00a340k",
  "\u00a340k+",
];

const EMPTY_DATA: ProjectPlannerData = {
  projectType: null,
  projectName: "",
  company: "",
  timeline: "",
  budget: "",
  file: null,
  notes: "",
};

// ---------------------------------------------------------------------------
// Small shared bits
// ---------------------------------------------------------------------------

function CornerMarks({ className = "" }: { className?: string }) {
  return (
    <span className={cn("pointer-events-none absolute inset-0", className)}>
      <span className="absolute -top-px -left-px h-3 w-3 border-l-2 border-t-2 border-primary/70" />
      <span className="absolute -top-px -right-px h-3 w-3 border-r-2 border-t-2 border-primary/70" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-l-2 border-b-2 border-primary/70" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-r-2 border-b-2 border-primary/70" />
    </span>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm transition-colors",
        active
          ? "border-primary/60 bg-primary/10 text-foreground"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block font-mono text-[11px] font-normal uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

// Shared className for shadcn Input/Textarea so they pick up the shared theme.
const controlClass =
  "border-border bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-primary/30";

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ProjectPlanner({ onSubmit }: ProjectPlannerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<ProjectPlannerData>(EMPTY_DATA);
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isLastStep = currentStep === STEPS.length - 1;

  const canProceed =
    currentStep === 0
      ? data.projectType !== null
      : currentStep === 1
        ? data.projectName.trim().length > 0
        : true;

  function goTo(step: number) {
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  }
  function next() {
    if (!canProceed || isLastStep) return;
    goTo(currentStep + 1);
  }
  function back() {
    if (currentStep === 0) return;
    goTo(currentStep - 1);
  }

  function handleFile(file: File | null) {
    if (file && file.type !== "application/pdf") return;
    setData((d) => ({ ...d, file }));
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  }

  async function handleSubmit() {
    setStatus("submitting");
    try {
      if (onSubmit) await onSubmit(data);
      else await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="relative overflow-hidden px-6 py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[240px_1fr]">
        {/* ---------------- Sidebar (desktop) ---------------- */}
        <div className="hidden md:block">
          <p className="mb-10 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Project planner
          </p>
          <div className="flex flex-col">
            {STEPS.map((step, i) => {
              const active = i === currentStep;
              const done = i < currentStep;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => done && goTo(i)}
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : done
                            ? "cursor-pointer border-primary/60 bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground",
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : `0${i + 1}`}
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className="relative mt-1 h-16 w-px bg-border">
                        <motion.div
                          className="absolute inset-x-0 top-0 w-px bg-primary"
                          initial={false}
                          animate={{ height: i < currentStep ? "100%" : "0%" }}
                          transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={i < STEPS.length - 1 ? "pb-8 pt-1" : "pt-1"}>
                    <p
                      className={cn(
                        "text-sm transition-colors",
                        active
                          ? "text-foreground"
                          : done
                            ? "text-muted-foreground"
                            : "text-muted-foreground/80",
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                      {step.hint}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- Mobile progress ---------------- */}
        <div className="md:hidden">
          <div className="mb-6 flex items-center gap-3">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i <= currentStep ? "bg-primary" : "bg-border",
                )}
              />
            ))}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground/80">
            Step {currentStep + 1} of {STEPS.length}
          </p>
          <p className="mt-1 text-sm text-foreground">
            {STEPS[currentStep].label}
          </p>
        </div>

        {/* ---------------- Main panel ---------------- */}
        <Card className="relative rounded-3xl border border-border/70 bg-card/80 p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur sm:p-10">
          <CornerMarks />

          {status === "success" ? (
            <SuccessState />
          ) : (
            <>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {currentStep === 0 && (
                    <StepType
                      value={data.projectType}
                      onChange={(t) =>
                        setData((d) => ({ ...d, projectType: t }))
                      }
                    />
                  )}
                  {currentStep === 1 && (
                    <StepDetails
                      data={data}
                      onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
                    />
                  )}
                  {currentStep === 2 && (
                    <StepBrief
                      data={data}
                      dragActive={dragActive}
                      fileInputRef={fileInputRef}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={handleDrop}
                      onFileChange={(e) =>
                        handleFile(e.target.files?.[0] ?? null)
                      }
                      onRemoveFile={() => handleFile(null)}
                      onNotesChange={(notes) =>
                        setData((d) => ({ ...d, notes }))
                      }
                    />
                  )}
                  {currentStep === 3 && (
                    <StepReview data={data} onEdit={goTo} />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Nav */}
              <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={back}
                  className={cn(
                    "gap-2 text-muted-foreground hover:bg-transparent hover:text-foreground",
                    currentStep === 0 && "pointer-events-none opacity-0",
                  )}
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                {!isLastStep ? (
                  <Button
                    type="button"
                    onClick={next}
                    disabled={!canProceed}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === "submitting"}
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
                  >
                    {status === "submitting"
                      ? "Sending\u2026"
                      : "Send project brief"}
                  </Button>
                )}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Project type
// ---------------------------------------------------------------------------

function StepType({
  value,
  onChange,
}: {
  value: ProjectTypeId | null;
  onChange: (t: ProjectTypeId) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-medium text-foreground">
        What are we building?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pick the closest fit — we'll refine scope together.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {PROJECT_TYPES.map((t) => {
          const Icon = t.icon;
          const selected = value === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              className={cn(
                "group relative rounded-xl border p-5 text-left transition-colors",
                selected
                  ? "border-primary/60 bg-primary/10"
                  : "border-border bg-background hover:border-primary/40",
              )}
            >
              {selected && <CornerMarks />}
              <Icon
                className={cn(
                  "mb-4 h-5 w-5",
                  selected ? "text-primary" : "text-muted-foreground",
                )}
              />
              <p className="text-sm font-medium text-foreground">{t.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {t.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Details
// ---------------------------------------------------------------------------

function StepDetails({
  data,
  onChange,
}: {
  data: ProjectPlannerData;
  onChange: (patch: Partial<ProjectPlannerData>) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-medium text-foreground">Project details</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The essentials — we'll expand on these later.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Project name">
          <Input
            className={controlClass}
            value={data.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
            placeholder="e.g. Meridian rebrand"
          />
        </Field>
        <Field label="Company (optional)">
          <Input
            className={controlClass}
            value={data.company}
            onChange={(e) => onChange({ company: e.target.value })}
            placeholder="e.g. Meridian Ltd"
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Timeline">
          <div className="flex flex-wrap gap-2">
            {TIMELINES.map((t) => (
              <Pill
                key={t}
                active={data.timeline === t}
                onClick={() => onChange({ timeline: t })}
              >
                {t}
              </Pill>
            ))}
          </div>
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Budget range">
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <Pill
                key={b}
                active={data.budget === b}
                onClick={() => onChange({ budget: b })}
              >
                {b}
              </Pill>
            ))}
          </div>
        </Field>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Brief & upload
// ---------------------------------------------------------------------------

function StepBrief({
  data,
  dragActive,
  fileInputRef,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemoveFile,
  onNotesChange,
}: {
  data: ProjectPlannerData;
  dragActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onNotesChange: (notes: string) => void;
}) {
  return (
    <div>
      <h2 className="text-lg font-medium text-foreground">Brief & materials</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Have a brief, deck, or spec already? Attach it. Otherwise, a few notes
        below is plenty to start.
      </p>

      <div className="mt-6">
        <Field label="Upload a brief (PDF)">
          {!data.file ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative cursor-pointer rounded-xl border border-dashed p-8 text-center transition-colors",
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-border/70 hover:border-primary/50",
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="hidden"
              />
              <Upload className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-foreground">
                Drop your PDF here, or click to browse
              </p>
              <p className="mt-1 font-mono text-xs text-muted-foreground/80">
                PDF only, up to 20MB
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/80 px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">
                    {data.file.name}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground/80">
                    {(data.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemoveFile}
                className="h-8 w-8 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </Field>
      </div>

      <div className="mt-6">
        <Field label="Anything else? (optional)">
          <Textarea
            rows={6}
            value={data.notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Goals, inspiration, must-haves, technical constraints \u2014 write as much as you like. We'll go through it together on the call."
            className={cn(controlClass, "resize-none")}
          />
        </Field>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Review
// ---------------------------------------------------------------------------

function StepReview({
  data,
  onEdit,
}: {
  data: ProjectPlannerData;
  onEdit: (step: number) => void;
}) {
  const typeLabel =
    PROJECT_TYPES.find((t) => t.id === data.projectType)?.label ?? "\u2014";

  const rows: { label: string; value: string; step: number }[] = [
    { label: "Project type", value: typeLabel, step: 0 },
    { label: "Project name", value: data.projectName || "\u2014", step: 1 },
    { label: "Company", value: data.company || "\u2014", step: 1 },
    { label: "Timeline", value: data.timeline || "\u2014", step: 1 },
    { label: "Budget", value: data.budget || "\u2014", step: 1 },
    { label: "Attachment", value: data.file?.name ?? "None attached", step: 2 },
    {
      label: "Notes",
      value: data.notes
        ? `${data.notes.slice(0, 80)}${data.notes.length > 80 ? "\u2026" : ""}`
        : "\u2014",
      step: 2,
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-foreground">Review & send</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Confirm the details below before sending.
      </p>

      <div className="mt-6 divide-y divide-border rounded-xl border border-border">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-start justify-between gap-4 px-5 py-4"
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                {r.label}
              </p>
              <p className="mt-1 max-w-md text-sm text-foreground">{r.value}</p>
            </div>
            <Button
              type="button"
              variant="link"
              onClick={() => onEdit(r.step)}
              className="h-auto shrink-0 p-0 font-mono text-[11px] uppercase tracking-wider text-primary hover:text-primary/80"
            >
              Edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success state
// ---------------------------------------------------------------------------

function SuccessState() {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/60 bg-primary/10">
        <motion.svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
          />
        </motion.svg>
      </div>
      <h2 className="text-lg font-medium text-foreground">Brief received</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Thanks \u2014 we'll review everything and get back to you within one
        business day to schedule a call.
      </p>
    </div>
  );
}
