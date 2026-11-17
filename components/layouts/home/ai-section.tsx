import { ArrowUpRight } from "lucide-react";

export type AskAiData = {
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  prompt?: string | null;
};

const DEFAULT_PROMPT =
  "What do you know about {company} ({website})? Summarise what they do, the services they offer, how they work with clients, and why a business might choose them.";

/**
 * Each assistant's "start a chat with this question" link. Gemini has no
 * supported pre-fill link, so Google's AI Mode stands in for it.
 */
const ASSISTANTS = [
  { label: "Ask ChatGPT", url: (q: string) => `https://chatgpt.com/?q=${q}` },
  { label: "Ask Claude", url: (q: string) => `https://claude.ai/new?q=${q}` },
  {
    label: "Ask Google AI",
    url: (q: string) => `https://www.google.com/search?udm=50&q=${q}`,
  },
  { label: "Ask Grok", url: (q: string) => `https://grok.com/?q=${q}` },
];

export function AISection({
  data,
  company,
  website,
}: {
  data?: AskAiData | null;
  company: string;
  website: string;
}) {
  const heading = data?.heading || "See what AI says about us";
  const question = (data?.prompt || DEFAULT_PROMPT)
    .replaceAll("{company}", company)
    .replaceAll("{website}", website);
  const encoded = encodeURIComponent(question);

  return (
    <section className="border-y-2 border-border bg-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:px-10">
        <div>
          {data?.eyebrow !== "" && (
            <p className="mb-4 font-mono text-sm font-medium text-primary">
              {data?.eyebrow ?? "// third-party validation"}
            </p>
          )}
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h2>
          {data?.description !== "" && (
            <p className="mt-3 max-w-[44ch] text-lg text-muted-foreground">
              {data?.description ??
                "Don't just take our word for it. Ask the robots."}
            </p>
          )}
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:gap-4">
          {ASSISTANTS.map(({ label, url }) => (
            <li key={label}>
              <a
                href={url(encoded)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 border-2 border-border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-[var(--shadow-control)] transition-[background-color,transform,box-shadow] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-x-[3px] active:translate-y-[3px] active:shadow-none active:duration-0"
              >
                {label}
                <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
