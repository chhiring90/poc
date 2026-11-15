import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

export type FAQItem = {
  id: number | string;
  question: string;
  ans: DefaultTypedEditorState;
  group?: FAQGroupReference;
};

export type FAQGroup = {
  id: number | string;
  name: string;
};

export type FAQGroupReference = FAQGroup | number | string | null;
