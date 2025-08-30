import * as React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
} from "./chart";

export type ChartContainerProps = React.ComponentProps<typeof ChartContainer>;
export type ChartTooltipProps = React.ComponentProps<typeof ChartTooltip>;
export type ChartTooltipContentProps = React.ComponentProps<
  typeof ChartTooltipContent
>;
export type ChartLegendProps = React.ComponentProps<typeof ChartLegend>;
export type ChartLegendContentProps = React.ComponentProps<
  typeof ChartLegendContent
>;
export type ChartStyleProps = React.ComponentProps<typeof ChartStyle>;
