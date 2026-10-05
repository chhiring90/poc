"use client";
import { useState } from "react";

const steps = [
  { label: "Project type", id: "type" },
  { label: "Budget", id: "budget" },
  { label: "Timeline", id: "timeline" },
  { label: "Tech needs", id: "tech" },
  { label: "Your details", id: "contact" },
];

const projectTypes = [
  "Web Application",
  "Mobile App",
  "MVP / POC Sprint",
  "UI/UX Design",
  "AI Integration",
  "Cloud / DevOps",
  "Not sure yet",
];
const budgets = [
  "< £15k",
  "£15k–£50k",
  "£50k–£150k",
  "£150k–£500k",
  "£500k+",
  "Let's discuss",
];
const timelines = [
  "ASAP (< 1 month)",
  "1–3 months",
  "3–6 months",
  "6–12 months",
  "Flexible",
];
const techOptions = [
  "React / Next.js",
  "React Native",
  "Flutter",
  "Node.js",
  "Python",
  "AWS / GCP",
  "AI / LLM",
  "PostgreSQL",
  "Docker / K8s",
];

export default function Contact() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    type: "",
    budget: "",
    timeline: "",
    tech: [] as string[],
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const bg = "bg-background";
  const text = "text-foreground";
  const muted = "text-muted-foreground";
  const card = "bg-card border-border";
  const inputCls =
    "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

  const toggleTech = (t: string) => {
    setForm((f) => ({
      ...f,
      tech: f.tech.includes(t) ? f.tech.filter((x) => x !== t) : [...f.tech, t],
    }));
  };

  if (submitted) {
    return (
      <div
        className={`bg-background text-foreground min-h-screen flex items-center justify-center`}
      >
        <div className="text-center max-w-md px-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
            <span className="text-primary text-2xl">✓</span>
          </div>
          <h1 className="font-display text-4xl font-bold mb-4">
            You're in the queue.
          </h1>
          <p className={`text-muted-foreground text-lg mb-8`}>
            We'll be in touch within one business day to book a discovery call.
            Check your inbox (and spam, just in case).
          </p>
          <p className={`font-mono text-xs text-muted-foreground`}>
            — The POC team
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-background text-foreground min-h-screen`}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10 pt-36 pb-28">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left */}
          <div>
            <span
              className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
            >
              // start a project
            </span>
            <h1 className="font-display text-5xl font-bold tracking-tight mb-6">
              Let's build
              <br />
              something
              <br />
              <span className="text-primary">worth proving</span>.
            </h1>
            <p
              className={`text-lg text-muted-foreground leading-relaxed mb-10`}
            >
              Fill in the planner and we'll come back to you with a scoped
              proposal within one business day. No sales calls until you're
              ready.
            </p>

            <div
              className={`p-6 rounded-2xl border bg-card border-border space-y-4`}
            >
              <div className="flex items-center gap-3">
                <span className="text-primary font-mono text-lg">✉</span>
                <div>
                  <p className={`text-sm font-medium text-foreground`}>
                    hello@poc.dev
                  </p>
                  <p className={`text-xs text-muted-foreground`}>
                    Email us directly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary font-mono text-lg">☎</span>
                <div>
                  <p className={`text-sm font-medium text-foreground`}>
                    +44 20 1234 5678
                  </p>
                  <p className={`text-xs text-muted-foreground`}>
                    Mon–Fri, 9am–6pm GMT
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary font-mono text-lg">◉</span>
                <div>
                  <p className={`text-sm font-medium text-foreground`}>
                    London, United Kingdom
                  </p>
                  <p className={`text-xs text-muted-foreground`}>
                    Remote-first, global clients
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — multi-step form */}
          <div className={`p-8 rounded-2xl border bg-card border-border`}>
            {/* Stepper */}
            <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-xs transition-all ${i === step ? "bg-primary font-bold text-primary-foreground" : i < step ? "border border-primary/30 text-primary" : "border border-border text-muted-foreground"}`}
                  >
                    <span>
                      {i < step ? "✓" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="hidden sm:block">{s.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-px w-4 ${i < step ? "bg-primary/40" : "bg-muted-foreground/20"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 0: Type */}
            {step === 0 && (
              <div>
                <h2
                  className={`font-display text-xl font-bold text-foreground mb-6`}
                >
                  What do you need built?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {projectTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${form.type === t ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/50"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => form.type && setStep(1)}
                  disabled={!form.type}
                  className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground transition-opacity disabled:opacity-30"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 1: Budget */}
            {step === 1 && (
              <div>
                <h2
                  className={`font-display text-xl font-bold text-foreground mb-6`}
                >
                  What's the rough budget?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {budgets.map((b) => (
                    <button
                      key={b}
                      onClick={() => setForm((f) => ({ ...f, budget: b }))}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${form.budget === b ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/50"}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 rounded-full border border-border py-3 text-sm font-semibold text-muted-foreground"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => form.budget && setStep(2)}
                    disabled={!form.budget}
                    className="flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Timeline */}
            {step === 2 && (
              <div>
                <h2
                  className={`font-display text-xl font-bold text-foreground mb-6`}
                >
                  When do you need it?
                </h2>
                <div className="space-y-3">
                  {timelines.map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, timeline: t }))}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${form.timeline === t ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/50"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full border border-border py-3 text-sm font-semibold text-muted-foreground"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => form.timeline && setStep(3)}
                    disabled={!form.timeline}
                    className="flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Tech */}
            {step === 3 && (
              <div>
                <h2
                  className={`font-display text-xl font-bold text-foreground mb-2`}
                >
                  Any tech preferences?
                </h2>
                <p className={`text-sm text-muted-foreground mb-6`}>
                  Select all that apply, or skip if you're not sure.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {techOptions.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTech(t)}
                      className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-all ${form.tech.includes(t) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 rounded-full border border-border py-3 text-sm font-semibold text-muted-foreground"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {step === 4 && (
              <div>
                <h2
                  className={`font-display text-xl font-bold text-foreground mb-6`}
                >
                  Almost there. Who are we building for?
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      className={inputCls}
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                    <input
                      className={inputCls}
                      placeholder="Company"
                      value={form.company}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, company: e.target.value }))
                      }
                    />
                  </div>
                  <input
                    className={inputCls}
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                  <textarea
                    className={`w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring h-24 resize-none`}
                    placeholder="Anything else we should know?"
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-full border border-border py-3 text-sm font-semibold text-muted-foreground"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() =>
                      form.name && form.email && setSubmitted(true)
                    }
                    disabled={!form.name || !form.email}
                    className="flex-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-30"
                  >
                    Send it →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
