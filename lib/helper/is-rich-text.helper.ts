import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { isRecord } from "@/lib/helper/is-record.helper";

export function isRichText(value: unknown): value is DefaultTypedEditorState {
  return isRecord(value) && isRecord(value.root);
}
