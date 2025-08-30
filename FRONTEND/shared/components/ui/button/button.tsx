import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from "./variants";
import { ButtonProps } from "./types";

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  // Ensure a default button type to avoid accidental form submission when
  // this component is used inside forms without an explicit type.
  const elementProps = { ...(props as Record<string, unknown>) };
  if (!asChild && typeof elementProps.type === "undefined") {
    // @ts-ignore - type is valid for native button
    elementProps.type = "button";
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...(elementProps as any)}
    />
  );
}
