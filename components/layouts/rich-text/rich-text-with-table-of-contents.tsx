import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { SectionNavigation } from "@/components/layouts/rich-text/section-navigation";
import { getRichTextHeadings } from "@/lib/helper/get-rich-text-headings.helper";

type RichTextWithTableOfContentsProps = {
  content: DefaultTypedEditorState;
  className?: string;
};

const defaultClassName =
  "text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

export function RichTextWithTableOfContents({
  content,
  className = defaultClassName,
}: RichTextWithTableOfContentsProps) {
  const { headings, headingIds } = getRichTextHeadings(content);
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const Tag = node.tag;

      return (
        <Tag id={headingIds.get(node)} className="scroll-mt-28">
          {nodesToJSX({ nodes: node.children })}
        </Tag>
      );
    },
  });

  return (
    <div
      className={
        headings.length > 0
          ? "flex flex-col gap-10 lg:flex-row-reverse lg:items-start lg:gap-16"
          : ""
      }
    >
      {headings.length > 0 && (
        <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:w-64">
          <SectionNavigation headings={headings} />
        </aside>
      )}
      <div className="min-w-0 max-w-4xl flex-1">
        <RichText
          data={content}
          converters={converters}
          className={className}
        />
      </div>
    </div>
  );
}
