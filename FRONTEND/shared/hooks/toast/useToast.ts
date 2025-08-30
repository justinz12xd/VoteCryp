"use client";

import * as React from "react";
import { getState, subscribe, dispatch } from "./store";
import { toast } from "./api";

export function useToast() {
  const [state, setState] = React.useState(getState());

  React.useEffect(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId } as any),
  };
}
