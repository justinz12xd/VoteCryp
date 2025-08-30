import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { alertVariants } from "./variants";
import type { AlertProps } from "./types";

export function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}
