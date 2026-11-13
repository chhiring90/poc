import { isRecord } from "@/lib/helper/is-record.helper";

function getBlockText(fields: unknown): string {
  if (!isRecord(fields)) return "";

  const text = [fields.title, fields.description].filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );
  if (typeof fields.valueLabel === "string" && fields.valueLabel.trim()) {
    text.push(fields.valueLabel);
  }
  if (typeof fields.unitSuffix === "string" && fields.unitSuffix.trim()) {
    text.push(fields.unitSuffix);
  }
  if (typeof fields.currencyCode === "string" && fields.currencyCode.trim()) {
    text.push(fields.currencyCode);
  }
  const data = Array.isArray(fields.data) ? fields.data : [];
  const series = Array.isArray(fields.series) ? fields.series : [];
  const steps = Array.isArray(fields.steps) ? fields.steps : [];

  for (const point of data) {
    if (!isRecord(point)) continue;
    if (typeof point.label === "string") text.push(point.label);
    if (typeof point.value === "number") text.push(String(point.value));
  }

  for (const item of series) {
    if (!isRecord(item)) continue;
    if (typeof item.name === "string") text.push(item.name);
    if (!Array.isArray(item.data)) continue;
    for (const point of item.data) {
      if (!isRecord(point)) continue;
      if (typeof point.label === "string") text.push(point.label);
      if (typeof point.value === "number") text.push(String(point.value));
    }
  }

  for (const step of steps) {
    if (!isRecord(step)) continue;
    if (typeof step.title === "string") text.push(step.title);
    if (typeof step.description === "string") text.push(step.description);
  }

  return text.join(" ");
}

export function getRichTextPlainText(value: unknown): string {
  if (!isRecord(value)) return "";

  if (isRecord(value.root)) {
    return getRichTextPlainText(value.root);
  }

  if (value.type === "block") {
    return getBlockText(value.fields);
  }

  if (!Array.isArray(value.children)) {
    return typeof value.text === "string" ? value.text : "";
  }

  return value.children
    .map(getRichTextPlainText)
    .filter(Boolean)
    .join(" ");
}
