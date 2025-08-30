"use client";

import * as React from "react";
import { Controller, type ControllerProps } from "react-hook-form";

const FormFieldContext = React.createContext<
  { name: any } | undefined
>(undefined);

export const FormField = <TFieldValues extends Record<string, any> = any, TName extends keyof TFieldValues = any>(
  props: ControllerProps<TFieldValues, TName>
) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

export { FormFieldContext };
