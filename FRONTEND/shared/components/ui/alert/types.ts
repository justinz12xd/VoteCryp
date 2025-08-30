import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { alertVariants } from "./variants";

export type AlertProps = React.ComponentProps<"div"> & VariantProps<typeof alertVariants>;
