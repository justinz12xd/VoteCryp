import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./variants";

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };
