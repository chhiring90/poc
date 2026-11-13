"use client";

import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isRecord } from "@/lib/helper/is-record.helper";

type ChartBlockNode = SerializedBlockNode;
type ChartPoint = {
  label: string;
  value: number;
  fill: string;
};

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getPoints(value: unknown): ChartPoint[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((point, index) => ({
      label: getString(point.label),
      value:
        typeof point.value === "number" && Number.isFinite(point.value)
          ? Math.max(0, point.value)
          : 0,
      fill: chartColors[index % chartColors.length],
    }))
    .filter((point) => point.label);
}

export function ChartBlock({ node }: { node: ChartBlockNode }) {
  const { fields } = node;
  const title = getString(fields.title);
  const description = getString(fields.description);
  const requestedChartType = getString(fields.chartType);
  const chartType =
    requestedChartType === "line" || requestedChartType === "donut"
      ? requestedChartType
      : "bar";
  const points = getPoints(fields.data);

  if (!title || points.length === 0) return null;

  return (
    <figure className="my-10 border-2 border-border bg-card p-5 shadow-[var(--shadow-control)] sm:p-7">
      <figcaption className="mb-5">
        <h3 className="font-display text-xl font-bold text-foreground">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </figcaption>

      <ChartContainer
        config={chartConfig}
        className={
          chartType === "donut"
            ? "mx-auto aspect-square max-h-80 w-full"
            : "h-72 w-full"
        }
      >
        {chartType === "donut" ? (
          <PieChart accessibilityLayer>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="label" />}
            />
            <Pie data={points} dataKey="value" nameKey="label" innerRadius={62}>
              {points.map((point, index) => (
                <Cell key={`${point.label}-${index}`} fill={point.fill} />
              ))}
            </Pie>
          </PieChart>
        ) : chartType === "line" ? (
          <LineChart accessibilityLayer data={points}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="value"
              type="linear"
              stroke="var(--color-value)"
              strokeWidth={3}
              dot={{ fill: "var(--color-value)" }}
            />
          </LineChart>
        ) : (
          <BarChart accessibilityLayer data={points}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={0} />
          </BarChart>
        )}
      </ChartContainer>

      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {points.map((point, index) => (
            <TableRow key={`${point.label}-${index}`}>
              <TableCell>
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0"
                    style={{ backgroundColor: point.fill }}
                  />
                  {point.label}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {point.value.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </figure>
  );
}
