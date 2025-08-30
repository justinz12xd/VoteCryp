import { genId } from "./types";
import type { ToasterToast, Toast } from "./types";
import { dispatch } from "./store";

export function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    } as any);
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id } as any);

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    } as any,
  } as any);

  return {
    id: id,
    dismiss,
    update,
  };
}
