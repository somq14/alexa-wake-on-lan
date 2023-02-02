import clsx from "clsx";
import React, { useState } from "react";

import { TextInput, TextInputProps } from "../TextInput";

export type TextFieldProps = {
  className?: string;
  label: string;
  optional?: boolean;
  error?: string;
} & Omit<TextInputProps, "error">;

export const TextField: React.FC<TextFieldProps> = (props) => {
  const { className, label, optional, error, ...restProps } = props;
  const [id] = useState(crypto.randomUUID());

  return (
    <div className={clsx("flex-column", "gap-0", className)}>
      <label htmlFor={id} className="text-sm text-secondary ml-0">
        {label}
        {!optional && <span className="text-sm text-error ml-1">*必須</span>}
      </label>

      <TextInput id={id} error={error !== undefined} {...restProps} />

      {props.error !== undefined && (
        <p className="text-sm text-error ml-0">{error}</p>
      )}
    </div>
  );
};
