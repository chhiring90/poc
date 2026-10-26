"use client";

import { useState } from "react";
import { ArrowUpRight, icons } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { renderAsteriskText } from "@/lib/helper/render-asterisk-text.helper";
import type {
  ContactPageData,
  ContactQuestionStep,
} from "@/lib/helper/get-contact-page-data.helper";

type ContactExperienceProps = {
  content: ContactPageData;
};

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  company: z.string(),
  email: z.string().trim().email("Enter a valid email address."),
  message: z.string(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactExperience({ content }: ContactExperienceProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      message: "",
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const totalSteps = content.steps.length + 1;
  const currentQuestion = content.steps[stepIndex];
  const isContactStep = stepIndex === content.steps.length;

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

  function finishForm() {
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-5 py-32">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl border border-border bg-card p-10 text-center shadow-2xl shadow-black/5 md:p-20"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.1, type: "spring" }}
            className="mx-auto mb-10 flex h-16 w-16 items-center justify-center bg-primary text-2xl text-primary-foreground"
          >
            ✓
          </motion.div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-primary">
            {content.success.eyebrow}
          </p>
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {content.success.title}
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
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
    <div className="mx-auto max-w-7xl px-5 pb-36 pt-36 lg:px-10 lg:pb-44 lg:pt-48">
      <div className="grid items-start gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-28">
        <section className="lg:sticky lg:top-32">
          <p className="mb-7 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {`// ${content.eyebrow}`}
          </p>
          <h1 className="mb-8 max-w-xl whitespace-pre-line font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {renderAsteriskText(content.heading)}
          </h1>
          <p className="mb-14 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {content.description}
          </p>

          {content.contactDetails.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {content.contactDetails.map((detail, index) => {
                const Icon =
                  icons[detail.icon as keyof typeof icons] ?? ArrowUpRight;
                const href = getContactDetailHref(detail);
                const contentBlock = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-primary/10 text-lg text-primary">
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
                    className="flex items-center gap-4 border border-border/70 bg-card/60 p-5 transition-colors hover:border-primary/40"
                  >
                    {contentBlock}
                  </a>
                ) : (
                  <div
                    key={`${detail.title}-${index}`}
                    className="flex items-center gap-4 border border-border/70 bg-card/60 p-5"
                  >
                    {contentBlock}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="overflow-hidden border border-border bg-card shadow-2xl shadow-black/5">
          <div className="border-b border-border px-8 pb-8 pt-9 md:px-12 md:pb-10 md:pt-12">
            <div className="mb-7 flex items-center justify-between gap-6">
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
              className="h-1.5 overflow-hidden bg-muted"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={totalSteps}
              aria-valuenow={stepIndex + 1}
              aria-label="Form progress"
            >
              <motion.div
                className="h-full bg-primary"
                initial={false}
                animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
              />
            </div>
          </div>

          <div className="p-8 md:p-12">
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
                  <Form {...contactForm}>
                    <form
                      onSubmit={contactForm.handleSubmit(() => finishForm())}
                    >
                      <h2 className="mb-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                        {content.form.question}
                      </h2>
                      <p className="mb-7 text-sm text-muted-foreground">
                        {content.form.description}
                      </p>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={contactForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{content.form.nameLabel}</FormLabel>
                              <FormControl>
                                <Input
                                  autoComplete="name"
                                  className="h-13 rounded-none"
                                  placeholder={content.form.namePlaceholder}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={contactForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{content.form.companyLabel}</FormLabel>
                              <FormControl>
                                <Input
                                  autoComplete="organization"
                                  className="h-13 rounded-none"
                                  placeholder={content.form.companyPlaceholder}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={contactForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>{content.form.emailLabel}</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  autoComplete="email"
                                  className="h-13 rounded-none"
                                  placeholder={content.form.emailPlaceholder}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={contactForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem className="sm:col-span-2">
                              <FormLabel>{content.form.messageLabel}</FormLabel>
                              <FormControl>
                                <Textarea
                                  className="min-h-36 resize-y rounded-none"
                                  placeholder={content.form.messagePlaceholder}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <StepNavigation
                        canContinue
                        nextLabel={content.form.submitLabel}
                        backLabel={content.navigation.backLabel}
                        onBack={() => setStepIndex((current) => current - 1)}
                      />
                    </form>
                  </Form>
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
            <div className="flex gap-2 px-8 pb-8 md:px-12 md:pb-10">
              {content.steps.map((step, index) => (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => index < stepIndex && setStepIndex(index)}
                  aria-label={`Go to ${step.label}`}
                  aria-current={index === stepIndex ? "step" : undefined}
                  className={`h-1 flex-1 transition-colors ${
                    index <= stepIndex ? "bg-primary" : "bg-muted"
                  } ${index < stepIndex ? "cursor-pointer" : "cursor-default"}`}
                />
              ))}
              <span
                className={`h-1 flex-1 ${
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
              className={`flex min-h-16 items-center justify-between gap-5 border px-5 py-4 text-left text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary/60 bg-primary/5 text-primary"
                  : "border-border bg-background text-foreground hover:border-primary/40"
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center border text-xs transition-colors ${
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

      <div className="mt-12 flex gap-4">
        {!isFirst && (
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="h-13 flex-1 rounded-none border-border bg-transparent px-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-transparent hover:text-foreground"
          >
            {backLabel}
          </Button>
        )}
        {!step.required && (
          <Button
            type="button"
            onClick={onSkip}
            variant="outline"
            className="h-13 flex-1 rounded-none border-border bg-transparent px-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-transparent hover:text-foreground"
          >
            {skipLabel}
          </Button>
        )}
        <Button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="h-13 flex-1 rounded-none bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:bg-primary/90 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {nextLabel} <span aria-hidden="true">→</span>
        </Button>
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
    <div className="mt-12 flex gap-4">
      <Button
        type="button"
        onClick={onBack}
        variant="outline"
        className="h-13 flex-1 rounded-none border-border bg-transparent px-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-transparent hover:text-foreground"
      >
        {backLabel}
      </Button>
      <Button
        type="submit"
        disabled={!canContinue}
        className="h-13 flex-1 rounded-none bg-primary px-6 text-sm font-bold text-primary-foreground transition-opacity hover:bg-primary/90 hover:opacity-90 disabled:opacity-35"
      >
        {nextLabel} <span aria-hidden="true">→</span>
      </Button>
    </div>
  );
}
