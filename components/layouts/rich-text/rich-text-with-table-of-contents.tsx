import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import type {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedBlockNode,
} from "@payloadcms/richtext-lexical";
import { SectionNavigation } from "@/components/layouts/rich-text/section-navigation";
import {
  CodeBlockRenderer,
  FlowDiagramBlock,
} from "@/components/layouts/rich-text/structured-blocks";
import { ChartBlock } from "@/components/layouts/rich-text/chart-block";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { getRichTextHeadings } from "@/lib/helper/get-rich-text-headings.helper";

type RichTextWithTableOfContentsProps = {
  content: DefaultTypedEditorState;
  className?: string;
  showTableOfContents?: boolean;
};

const defaultClassName =
  "text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6";

export function RichTextWithTableOfContents({
  content,
  className = defaultClassName,
  showTableOfContents = true,
}: RichTextWithTableOfContentsProps) {
  const { headings, headingIds } = getRichTextHeadings(content);
  const converters: JSXConvertersFunction<
    DefaultNodeTypes | SerializedBlockNode<{ blockType: string }>
  > = ({ defaultConverters }) => ({
    ...defaultConverters,
    table: ({ node, nodesToJSX }) => (
      <div className="my-8 border-2 border-border">
        <Table>
          <TableBody>{nodesToJSX({ nodes: node.children })}</TableBody>
        </Table>
      </div>
    ),
    tablecell: ({ node, nodesToJSX }) => {
      if (node.headerState > 0) {
        return (
          <TableHead
            scope={node.headerState === 1 ? "row" : "col"}
            className="whitespace-normal border-b border-border bg-muted font-bold [&_p]:mb-0"
          >
            {nodesToJSX({ nodes: node.children })}
          </TableHead>
        );
      }

      return (
        <TableCell className="whitespace-normal [&_p]:mb-0">
          {nodesToJSX({ nodes: node.children })}
        </TableCell>
      );
    },
    tablerow: ({ node, nodesToJSX }) => (
      <TableRow className="even:bg-muted">
        {nodesToJSX({ nodes: node.children })}
      </TableRow>
    ),
    heading: ({ node, nodesToJSX }) => {
      const Tag = node.tag;

      return (
        <Tag id={headingIds.get(node)} className="scroll-mt-28">
          {nodesToJSX({ nodes: node.children })}
        </Tag>
      );
    },
    blocks: {
      ...defaultConverters.blocks,
      Code: ({ node }) => <CodeBlockRenderer node={node} />,
      chart: ({ node }) => <ChartBlock node={node} />,
      flowDiagram: ({ node }) => <FlowDiagramBlock node={node} />,
    },
  });

  return (
    <div
      className={
        showTableOfContents && headings.length > 0
          ? "flex flex-col gap-10 lg:flex-row-reverse lg:items-start lg:gap-16"
          : ""
      }
    >
      {showTableOfContents && headings.length > 0 && (
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
