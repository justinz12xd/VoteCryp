"use client";

import * as React from "react";
import { useFormContext, useFormState } from "react-hook-form";
import { FormFieldContext } from "./FormField";
import { FormItemContext } from "./FormItem";

export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext as any);
  const itemContext = React.useContext(FormItemContext as any);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};
