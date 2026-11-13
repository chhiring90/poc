import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

export type FAQItem = {
  id: number | string;
  question: string;
  ans: DefaultTypedEditorState;
};
