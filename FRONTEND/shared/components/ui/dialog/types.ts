import * as React from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./index";

export type DialogContentProps = React.ComponentProps<typeof DialogContent>;
export type DialogTriggerProps = React.ComponentProps<typeof DialogTrigger>;
export type DialogCloseProps = React.ComponentProps<typeof DialogClose>;
export type DialogPortalProps = React.ComponentProps<typeof DialogPortal>;
export type DialogOverlayProps = React.ComponentProps<typeof DialogOverlay>;
export type DialogHeaderProps = React.ComponentProps<typeof DialogHeader>;
export type DialogFooterProps = React.ComponentProps<typeof DialogFooter>;
export type DialogTitleProps = React.ComponentProps<typeof DialogTitle>;
export type DialogDescriptionProps = React.ComponentProps<
  typeof DialogDescription
>;
