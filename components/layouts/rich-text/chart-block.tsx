"use client";

import { useId } from "react";
import type { SerializedBlockNode } from "@payloadcms/richtext-lexical";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegendContent,
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
import { Badge } from "@/components/ui/badge";
import { isRecord } from "@/lib/helper/is-record.helper";

type ChartBlockNode = SerializedBlockNode;
type ChartType = "bar" | "line" | "area" | "pie" | "donut" | "radialBar";
type ValueFormat = "number" | "percentage" | "currency";
type ChartSeries = {
  key: string;
  label: string;
  color: string;
};
type ChartRow = {
  label: string;
  [key: string]: string | number;
};
type PiePoint = {
  label: string;
  value: number;
  fill: string;
};

const singleColors: Record<string, string> = {
  primary: "var(--color-primary)",
  accent: "var(--color-accent)",
  info: "var(--color-info)",
  success: "var(--color-success)",
  chart5: "var(--chart-5)",
};

const seriesColors: Record<string, string> = {
  ...singleColors,
};

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function getPoints(value: unknown): { label: string; value: number }[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isRecord)
    .map((point) => ({
      label: getString(point.label),
      value:
        typeof point.value === "number" && Number.isFinite(point.value)
          ? point.value
          : 0,
    }))
    .filter((point) => point.label);
}

function getChartData(
  fields: Record<string, unknown>,
  valueLabel: string,
  fallbackColor: string,
): { series: ChartSeries[]; rows: ChartRow[] } {
  const rawSeries = Array.isArray(fields.series)
    ? fields.series.filter(isRecord)
    : [];
  const series = rawSeries
    .map((item, index) => {
      const points = getPoints(item.data);
      return {
        key: `series${index}`,
        label: getString(item.name).trim(),
        color:
          seriesColors[getString(item.color)] ??
          pieColors[index % pieColors.length],
        points,
      };
    })
    .filter((item) => item.label && item.points.length > 0)
    .map((item, index) => ({ ...item, key: `series${index}` }));

  if (series.length === 0) {
    const points = getPoints(fields.data);
    if (points.length === 0) return { series: [], rows: [] };
    return {
      series: [{ key: "value", label: valueLabel, color: fallbackColor }],
      rows: points.map(({ label, value }) => ({ label, value })),
    };
  }

  const rowsByLabel = new Map<string, ChartRow>();
  for (const item of series) {
    for (const point of item.points) {
      const row = rowsByLabel.get(point.label) ?? { label: point.label };
      row[item.key] = point.value;
      rowsByLabel.set(point.label, row);
    }
  }

  return { series, rows: [...rowsByLabel.values()] };
}

function formatValue(
  value: unknown,
  format: ValueFormat,
  currencyCode: string,
  prefix: string,
  suffix: string,
  decimalPlaces: number,
): string {
  const numericValue =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(numericValue)) return String(value ?? "");

  if (format === "currency" && /^[a-z]{3}$/i.test(currencyCode)) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      maximumFractionDigits: decimalPlaces,
    }).format(numericValue);
  }

  const formatted = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: decimalPlaces,
  }).format(numericValue);

  if (format === "percentage") return `${formatted}%`;
  if (format === "currency" && currencyCode) {
    return `${currencyCode.toUpperCase()} ${formatted}`;
  }
  return `${prefix}${formatted}${suffix ? ` ${suffix}` : ""}`;
}

export function ChartBlock({ node }: { node: ChartBlockNode }) {
  const chartId = `chart-area-${useId().replace(/:/g, "")}`;
  const fields = node.fields;
  const title = getString(fields.title);
  const description = getString(fields.description);
  const requestedChartType = getString(fields.chartType);
  const chartType: ChartType = [
    "line",
    "area",
    "pie",
    "donut",
    "radialBar",
  ].includes(requestedChartType)
    ? (requestedChartType as ChartType)
    : "bar";
  const format: ValueFormat =
    fields.valueFormat === "percentage" || fields.valueFormat === "currency"
      ? fields.valueFormat
      : "number";
  const currencyCode = getString(fields.currencyCode) || "USD";
  const prefix = getString(fields.valuePrefix);
  const suffix = getString(fields.unitSuffix);
  const defaultValueLabel =
    format === "percentage"
      ? "Percentage"
      : format === "currency"
        ? currencyCode.toUpperCase()
        : suffix || "Value";
  const valueLabel = getString(fields.valueLabel).trim() || defaultValueLabel;
  const decimalPlaces =
    typeof fields.decimalPlaces === "number" &&
    Number.isInteger(fields.decimalPlaces)
      ? Math.min(6, Math.max(0, fields.decimalPlaces))
      : 2;
  const color =
    singleColors[getString(fields.color)] ?? singleColors.primary;
  const showGrid = getBoolean(fields.showGrid, true);
  const showLegend = getBoolean(fields.showLegend, true);
  const showDataTable = getBoolean(fields.showDataTable, true);
  const showTooltip = getBoolean(fields.showTooltip, true);
  const showDataLabels = getBoolean(fields.showDataLabels, false);
  const stacked = fields.barMode === "stacked";
  const xAxisLabel = getString(fields.xAxisLabel);
  const yAxisLabel = getString(fields.yAxisLabel);
  const { series, rows } = getChartData(fields, valueLabel, color);
  const pieSeries = series[0];
  const piePoints: PiePoint[] = pieSeries
    ? rows
        .map((row, index) => ({
          label: row.label,
          value:
            typeof row[pieSeries.key] === "number"
              ? (row[pieSeries.key] as number)
              : 0,
          fill: pieColors[index % pieColors.length],
        }))
        .filter((point) => point.value >= 0)
    : [];
  const radialRows: ChartRow[] = rows.map((row): ChartRow => ({
    label: row.label,
    ...Object.fromEntries(
      series.flatMap((item) => {
        const value = row[item.key];
        return typeof value === "number" && value >= 0
          ? [[item.key, value]]
          : [];
      }),
    ),
  }));
  const canRenderChart =
    rows.length > 0 &&
    (chartType === "pie" || chartType === "donut"
      ? piePoints.some((point) => point.value > 0)
      : chartType === "radialBar"
        ? series.some((item) =>
          radialRows.some((row) => {
            const value = row[item.key];
            return typeof value === "number" && value > 0;
          }),
          )
        : true);

  if (!title || rows.length === 0 || series.length === 0) return null;

  const chartConfig = Object.fromEntries(
    series.map((item) => [
      item.key,
      { label: item.label, color: item.color },
    ]),
  ) satisfies ChartConfig;
  const tooltipFormatter = (value: unknown) =>
    formatValue(value, format, currencyCode, prefix, suffix, decimalPlaces);
  const tooltip = (
    <Tooltip
      content={
        <ChartTooltipContent
          nameKey={
            ["pie", "donut"].includes(chartType)
              ? "label"
              : undefined
          }
          formatter={(value) => tooltipFormatter(value)}
        />
      }
    />
  );
  const axisLabelClass =
    "fill-muted-foreground text-[10px] font-medium tracking-wide";
  const legendItems =
    chartType === "pie" || chartType === "donut"
      ? piePoints.map(({ label, fill }) => ({ label, color: fill }))
      : chartType === "radialBar" && series.length === 1
        ? rows.map((row, index) => ({
            label: row.label,
            color: pieColors[index % pieColors.length],
          }))
        : series.map(({ label, color: seriesColor }) => ({
            label,
            color: seriesColor,
          }));

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

      {canRenderChart ? (
        <ChartContainer
          config={chartConfig}
          className={
            chartType === "donut" || chartType === "pie"
              ? "mx-auto aspect-square max-h-80 w-full"
              : "h-80 w-full"
          }
        >
          {chartType === "pie" || chartType === "donut" ? (
            <PieChart accessibilityLayer>
              {showTooltip && tooltip}
              <Pie
                data={piePoints}
                dataKey="value"
                nameKey="label"
                innerRadius={chartType === "donut" ? 62 : 0}
                outerRadius="88%"
                stroke="var(--color-card)"
                strokeWidth={2}
              >
                {piePoints.map((point, index) => (
                  <Cell key={`${point.label}-${index}`} fill={point.fill} />
                ))}
              </Pie>
            </PieChart>
          ) : chartType === "radialBar" ? (
            <RadialBarChart
              accessibilityLayer
              data={radialRows}
              innerRadius="18%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis type="number" domain={[0, "dataMax"]} tick={false} />
              {showTooltip && tooltip}
              {series.map((item) => (
                <RadialBar
                  key={item.key}
                  dataKey={item.key}
                  name={item.label}
                  fill={item.color}
                  background
                >
                  {series.length === 1 &&
                    rows.map((row, index) => (
                      <Cell
                        key={`${row.label}-${index}`}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                </RadialBar>
              ))}
              {showLegend && series.length > 1 && (
                <Legend
                  content={
                    <ChartLegendContent className="text-foreground" />
                  }
                />
              )}
            </RadialBarChart>
          ) : chartType === "line" ? (
            <LineChart accessibilityLayer data={rows}>
              {showGrid && <CartesianGrid vertical={false} />}
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={
                  xAxisLabel
                    ? {
                        value: xAxisLabel,
                        position: "insideBottom",
                        offset: -12,
                        className: axisLabelClass,
                      }
                    : undefined
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={yAxisLabel ? 64 : 56}
                tickFormatter={tooltipFormatter}
                label={
                  yAxisLabel
                    ? {
                        value: yAxisLabel,
                        angle: -90,
                        position: "insideLeft",
                        className: axisLabelClass,
                      }
                    : undefined
                }
              />
              {showTooltip && tooltip}
              {showLegend && (
                <Legend
                  content={
                    <ChartLegendContent className="text-foreground" />
                  }
                />
              )}
              {series.map((item) => (
                <Line
                  key={item.key}
                  dataKey={item.key}
                  name={item.label}
                  type="linear"
                  stroke={item.color}
                  strokeWidth={3}
                  dot={{ fill: item.color, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          ) : chartType === "area" ? (
            <AreaChart accessibilityLayer data={rows}>
              <defs>
                {series.map((item) => (
                  <linearGradient
                    key={item.key}
                    id={`${chartId}-${item.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={item.color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={item.color} stopOpacity={0.04} />
                  </linearGradient>
                ))}
              </defs>
              {showGrid && <CartesianGrid vertical={false} />}
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={
                  xAxisLabel
                    ? {
                        value: xAxisLabel,
                        position: "insideBottom",
                        offset: -12,
                        className: axisLabelClass,
                      }
                    : undefined
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={yAxisLabel ? 64 : 56}
                tickFormatter={tooltipFormatter}
                label={
                  yAxisLabel
                    ? {
                        value: yAxisLabel,
                        angle: -90,
                        position: "insideLeft",
                        className: axisLabelClass,
                      }
                    : undefined
                }
              />
              {showTooltip && tooltip}
              {showLegend && (
                <Legend
                  content={
                    <ChartLegendContent className="text-foreground" />
                  }
                />
              )}
              {series.map((item) => (
                <Area
                  key={item.key}
                  dataKey={item.key}
                  name={item.label}
                  type="monotone"
                  stroke={item.color}
                  strokeWidth={3}
                  fill={`url(#${chartId}-${item.key})`}
                  fillOpacity={series.length > 1 ? 0.55 : 1}
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart accessibilityLayer data={rows}>
              {showGrid && <CartesianGrid vertical={false} />}
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={
                  xAxisLabel
                    ? {
                        value: xAxisLabel,
                        position: "insideBottom",
                        offset: -12,
                        className: axisLabelClass,
                      }
                    : undefined
                }
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={yAxisLabel ? 64 : 56}
                tickFormatter={tooltipFormatter}
                label={
                  yAxisLabel
                    ? {
                        value: yAxisLabel,
                        angle: -90,
                        position: "insideLeft",
                        className: axisLabelClass,
                      }
                    : undefined
                }
              />
              {showTooltip && tooltip}
              {showLegend && (
                <Legend
                  content={
                    <ChartLegendContent className="text-foreground" />
                  }
                />
              )}
              {series.map((item) => (
                <Bar
                  key={item.key}
                  dataKey={item.key}
                  name={item.label}
                  fill={item.color}
                  radius={0}
                  stackId={stacked ? "stacked" : undefined}
                >
                  {showDataLabels && (
                    <LabelList
                      dataKey={item.key}
                      position={stacked ? "center" : "top"}
                      formatter={(value) =>
                        tooltipFormatter(value) as number | string
                      }
                      className="fill-foreground text-xs"
                    />
                  )}
                </Bar>
              ))}
            </BarChart>
          )}
        </ChartContainer>
      ) : (
        <p className="border border-border bg-muted p-4 text-sm text-muted-foreground">
          Pie, donut, and radial charts require at least one positive value;
          negative values are omitted.
        </p>
      )}

      {showLegend &&
        ["pie", "donut", "radialBar"].includes(chartType) &&
        legendItems.length > 0 && (
          <ul
            aria-label={`${title} legend`}
            className="mt-4 flex flex-wrap gap-2"
          >
            {legendItems.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                <Badge
                  variant="outline"
                  className="h-auto gap-2 rounded-none border-border px-2 py-1 text-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </Badge>
              </li>
            ))}
          </ul>
        )}

      {showDataTable && (
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              {series.map((item) => (
                <TableHead key={item.key} className="text-right">
                  {item.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={`${row.label}-${index}`}>
                <TableCell>
                  <span className="flex items-center gap-2">
                    {row.label}
                  </span>
                </TableCell>
                {series.map((item) => (
                  <TableCell
                    key={item.key}
                    className="text-right tabular-nums"
                  >
                    {typeof row[item.key] === "number"
                      ? formatValue(
                          row[item.key],
                          format,
                          currencyCode,
                          prefix,
                          suffix,
                          decimalPlaces,
                        )
                      : "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </figure>
  );
}
