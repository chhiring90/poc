import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { isRecord } from "@/lib/helper/is-record.helper";

type BlockNode = SerializedBlockNode;

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

export function CodeBlockRenderer({ node }: { node: BlockNode }) {
  const code = getString(node.fields.code);
  const language = getString(node.fields.language);

  return (
    <figure className="my-8 overflow-hidden border-2 border-border bg-foreground text-background shadow-[var(--shadow-control)]">
      {language && (
        <figcaption className="border-b border-background/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-background/70">
          {language}
        </figcaption>
      )}
      <pre className="overflow-x-auto p-5 font-mono text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

type DiagramStep = {
  title: string;
  description: string;
};

export function FlowDiagramBlock({ node }: { node: BlockNode }) {
  const fields = node.fields;
  const title = getString(fields.title);
  const direction =
    fields.direction === "vertical" ? "vertical" : "horizontal";
  const steps: DiagramStep[] = getRecords(fields.steps)
    .map((step) => ({
      title: getString(step.title),
      description: getString(step.description),
    }))
    .filter((step) => step.title);

  if (!title || steps.length === 0) return null;

  return (
    <figure className="my-10 border-2 border-border bg-card p-5 shadow-[var(--shadow-control)] sm:p-7">
      <figcaption className="mb-5 font-display text-xl font-bold text-foreground">
        {title}
      </figcaption>
      <ol
        aria-label={title}
        className={
          direction === "horizontal"
            ? "flex items-stretch gap-3 overflow-x-auto pb-2"
            : "mx-auto flex max-w-xl flex-col items-stretch gap-3"
        }
      >
        {steps.map((step, index) => (
          <li
            key={`${step.title}-${index}`}
            className={
              direction === "horizontal"
                ? "flex min-w-48 flex-1 items-center gap-3"
                : "flex flex-col items-center gap-3"
            }
          >
            <div className="w-full border-2 border-border bg-background p-4">
              <span className="mb-2 block font-mono text-xs text-primary">
                STEP {String(index + 1).padStart(2, "0")}
              </span>
              <h4 className="font-display font-bold text-foreground">
                {step.title}
              </h4>
              {step.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={
                  direction === "horizontal"
                    ? "shrink-0 font-mono text-xl text-primary"
                    : "font-mono text-xl text-primary"
                }
              >
                {direction === "horizontal" ? "→" : "↓"}
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
