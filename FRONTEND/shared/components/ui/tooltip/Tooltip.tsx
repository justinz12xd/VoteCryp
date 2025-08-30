import * as React from "react"
import { TooltipProvider } from "./TooltipProvider"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

export function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}
