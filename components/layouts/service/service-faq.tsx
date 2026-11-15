import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQItem } from "@/lib/type/faq.type";
import type { ServiceDocument } from "@/lib/type/service.type";

export function ServiceFAQ({
  faqs,
  cta,
}: {
  faqs: FAQItem[];
  cta: ServiceDocument["ctaButton"];
}) {
  if (faqs.length === 0) return null;

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 lg:px-10"
    >
      <div>
        <h2 id="faq-heading" className="font-display text-3xl font-bold">
          Questions
        </h2>
        {cta?.label && cta.url && (
          <p className="mt-4 max-w-[30ch] leading-relaxed text-muted-foreground">
            Have a question that isn&apos;t here? Ask it on the call.{" "}
            <Link
              href={cta.url}
              className="font-medium text-primary underline underline-offset-4"
            >
              {cta.label}
            </Link>
          </p>
        )}
      </div>

      {/* type="multiple" with no default value: every answer starts collapsed. */}
      <Accordion type="multiple" className="border-t-2 border-border">
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={String(faq.id)}
            className="border-b-2 border-border not-last:border-b-2"
          >
            <AccordionTrigger className="rounded-none py-5 font-display text-lg font-bold text-foreground hover:no-underline hover:text-primary focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring **:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:text-primary">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="max-w-[65ch] pb-6 text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5">
              <RichText data={faq.ans} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
