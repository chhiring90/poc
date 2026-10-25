"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, icons } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { renderAsteriskText } from "@/lib/helper/render-asterisk-text.helper";
import type {
  ContactPageData,
  ContactQuestionStep,
} from "@/lib/helper/get-contact-page-data.helper";

type ContactExperienceProps = {
  content: ContactPageData;
};

type ContactFormValues = {
  name: string;
  company: string;
  email: string;
  message: string;
};

export function ContactExperience({ content }: ContactExperienceProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [form, setForm] = useState<ContactFormValues>({
    name: "",
    company: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const totalSteps = content.steps.length + 1;
  const currentQuestion = content.steps[stepIndex];
  const isContactStep = stepIndex === content.steps.length;
  const inputClassName =
    "w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground";

  function updateForm(field: keyof ContactFormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleAnswer(question: ContactQuestionStep, value: string) {
    setAnswers((current) => {
      const selected = current[question.key] ?? [];
      const next =
        question.selectionMode === "multiple"
          ? selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value]
          : selected.includes(value)
            ? []
            : [value];
      return { ...current, [question.key]: next };
    });
  }

  function canContinue(question: ContactQuestionStep) {
    return !question.required || (answers[question.key]?.length ?? 0) > 0;
  }

  function finishForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center px-5 py-24">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-2xl shadow-black/5 md:p-14"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.1, type: "spring" }}
            className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl text-primary-foreground"
          >
            ✓
          </motion.div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {content.success.eyebrow}
          </p>
          <h1 className="mb-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {content.success.title}
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
            {content.success.description}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {content.success.signature}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-32 lg:px-10 lg:pt-40">
      <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <section className="lg:sticky lg:top-32">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {`// ${content.eyebrow}`}
          </p>
          <h1 className="mb-6 max-w-xl whitespace-pre-line font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {renderAsteriskText(content.heading)}
          </h1>
          <p className="mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {content.description}
          </p>

          {content.contactDetails.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {content.contactDetails.map((detail, index) => {
                const Icon =
                  icons[detail.icon as keyof typeof icons] ?? ArrowUpRight;
                const href = getContactDetailHref(detail);
                const contentBlock = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-lg text-primary">
                      <Icon aria-hidden="true" size={20} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {detail.title}
                      </span>
                      {detail.description && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {detail.description}
                        </span>
                      )}
                    </span>
                  </>
                );

                return href ? (
                  <a
                    key={`${detail.title}-${index}`}
                    href={href}
                    target={
                      href.startsWith("mailto:") || href.startsWith("tel:")
                        ? undefined
                        : "_blank"
                    }
                    rel={
                      href.startsWith("mailto:") || href.startsWith("tel:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4 transition-colors hover:border-primary/40"
                  >
                    {contentBlock}
                  </a>
                ) : (
                  <div
                    key={`${detail.title}-${index}`}
                    className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/60 p-4"
                  >
                    {contentBlock}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-black/5">
          <div className="border-b border-border px-6 pb-6 pt-7 md:px-9 md:pt-9">
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {isContactStep
                  ? content.form.stepLabel
                  : currentQuestion?.label}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {String(stepIndex + 1).padStart(2, "0")}{" "}
                <span className="text-border">/</span>{" "}
                {String(totalSteps).padStart(2, "0")}
              </p>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={totalSteps}
              aria-valuenow={stepIndex + 1}
              aria-label="Form progress"
            >
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
              />
            </div>
          </div>

          <div className="p-6 md:p-9">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stepIndex}
                initial={
                  shouldReduceMotion
                    ? false
                    : { opacity: 0, x: stepIndex > 0 ? 18 : -18 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  shouldReduceMotion
                    ? undefined
                    : { opacity: 0, x: stepIndex > 0 ? -18 : 18 }
                }
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              >
                {isContactStep ? (
                  <form onSubmit={finishForm}>
                    <h2 className="mb-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                      {content.form.question}
                    </h2>
                    <p className="mb-7 text-sm text-muted-foreground">
                      {content.form.description}
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="space-y-2 text-sm font-medium">
                        <span>{content.form.nameLabel}</span>
                        <input
                          required
                          autoComplete="name"
                          className={inputClassName}
                          placeholder={content.form.namePlaceholder}
                          value={form.name}
                          onChange={(event) =>
                            updateForm("name", event.target.value)
                          }
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium">
                        <span>{content.form.companyLabel}</span>
                        <input
                          autoComplete="organization"
                          className={inputClassName}
                          placeholder={content.form.companyPlaceholder}
                          value={form.company}
                          onChange={(event) =>
                            updateForm("company", event.target.value)
                          }
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium sm:col-span-2">
                        <span>{content.form.emailLabel}</span>
                        <input
                          required
                          type="email"
                          autoComplete="email"
                          className={inputClassName}
                          placeholder={content.form.emailPlaceholder}
                          value={form.email}
                          onChange={(event) =>
                            updateForm("email", event.target.value)
                          }
                        />
                      </label>
                      <label className="space-y-2 text-sm font-medium sm:col-span-2">
                        <span>{content.form.messageLabel}</span>
                        <textarea
                          className={`${inputClassName} min-h-28 resize-y`}
                          placeholder={content.form.messagePlaceholder}
                          value={form.message}
                          onChange={(event) =>
                            updateForm("message", event.target.value)
                          }
                        />
                      </label>
                    </div>
                    <StepNavigation
                      canContinue
                      nextLabel={content.form.submitLabel}
                      backLabel={content.navigation.backLabel}
                      onBack={() => setStepIndex((current) => current - 1)}
                    />
                  </form>
                ) : currentQuestion ? (
                  <QuestionStep
                    step={currentQuestion}
                    selected={answers[currentQuestion.key] ?? []}
                    nextLabel={content.navigation.nextLabel}
                    skipLabel={content.navigation.skipLabel}
                    backLabel={content.navigation.backLabel}
                    isFirst={stepIndex === 0}
                    shouldReduceMotion={Boolean(shouldReduceMotion)}
                    onSelect={(value) => toggleAnswer(currentQuestion, value)}
                    onBack={() => setStepIndex((current) => current - 1)}
                    onNext={() => setStepIndex((current) => current + 1)}
                    onSkip={() => setStepIndex((current) => current + 1)}
                    canContinue={canContinue(currentQuestion)}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {content.steps.length > 1 && (
            <div className="flex gap-1 px-6 pb-6 md:px-9">
              {content.steps.map((step, index) => (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => index < stepIndex && setStepIndex(index)}
                  aria-label={`Go to ${step.label}`}
                  aria-current={index === stepIndex ? "step" : undefined}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    index <= stepIndex ? "bg-primary" : "bg-muted"
                  } ${index < stepIndex ? "cursor-pointer" : "cursor-default"}`}
                />
              ))}
              <span
                className={`h-1 flex-1 rounded-full ${
                  isContactStep ? "bg-primary" : "bg-muted"
                }`}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function getContactDetailHref(detail: {
  icon: string;
  title: string;
  href: string;
}): string {
  const value = detail.href.trim() || detail.title.trim();

  if (detail.icon === "Mail" || value.startsWith("mailto:")) {
    return `mailto:${value.replace(/^mailto:/i, "")}`;
  }
  if (detail.icon === "Phone" || value.startsWith("tel:")) {
    return `tel:${value.replace(/^tel:/i, "").replace(/[^\d+]/g, "")}`;
  }
  return detail.href.trim();
}

function QuestionStep({
  step,
  selected,
  nextLabel,
  skipLabel,
  backLabel,
  isFirst,
  shouldReduceMotion,
  onSelect,
  onBack,
  onNext,
  onSkip,
  canContinue,
}: {
  step: ContactQuestionStep;
  selected: string[];
  nextLabel: string;
  skipLabel: string;
  backLabel: string;
  isFirst: boolean;
  shouldReduceMotion: boolean;
  onSelect: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  canContinue: boolean;
}) {
  const multiple = step.selectionMode === "multiple";

  return (
    <div>
      <h2 className="mb-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
        {step.question}
      </h2>
      {step.description && (
        <p className="mb-7 text-sm leading-relaxed text-muted-foreground">
          {step.description}
          {multiple && (
            <span className="ml-1 text-primary">Select all that apply.</span>
          )}
        </p>
      )}
      {!step.description && multiple && (
        <p className="mb-7 text-sm text-muted-foreground">
          Select all that apply.
        </p>
      )}
      <div
        className={`grid gap-3 ${
          step.options.length > 4 ? "sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {step.options.map((option, index) => {
          const isSelected = selected.includes(option.value);
          return (
            <motion.button
              key={option.value}
              type="button"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.18,
                delay: shouldReduceMotion ? 0 : index * 0.025,
              }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
              aria-pressed={isSelected}
              onClick={() => onSelect(option.value)}
              className={`flex min-h-14 items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary/60 bg-primary/5 text-primary"
                  : "border-border bg-background text-foreground hover:border-primary/40"
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center border text-xs transition-colors ${
                  multiple ? "rounded-md" : "rounded-full"
                } ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-transparent"
                }`}
              >
                ✓
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 flex gap-3">
        {!isFirst && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-full border border-border px-5 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {backLabel}
          </button>
        )}
        {!step.required && (
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 rounded-full border border-border px-5 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {skipLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {nextLabel} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function StepNavigation({
  canContinue,
  nextLabel,
  backLabel,
  onBack,
}: {
  canContinue: boolean;
  nextLabel: string;
  backLabel: string;
  onBack: () => void;
}) {
  return (
    <div className="mt-8 flex gap-3">
      <button
        type="button"
        onClick={onBack}
        className="flex-1 rounded-full border border-border px-5 py-3.5 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        {backLabel}
      </button>
      <button
        type="submit"
        disabled={!canContinue}
        className="flex-1 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-35"
      >
        {nextLabel} <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
