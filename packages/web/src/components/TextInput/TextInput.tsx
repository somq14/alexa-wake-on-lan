import clsx from "clsx";
import React, { ComponentPropsWithoutRef } from "react";

import styles from "./TextInput.module.css";

export type TextInputProps = {
  error?: boolean;
} & ComponentPropsWithoutRef<"input">;

export const TextInput: React.FC<TextInputProps> = (props) => {
  const { className, error, ...restProps } = props;
  return (
    <input
      type="text"
      className={clsx(styles.input, { [styles.error]: error }, className)}
      {...restProps}
    />
  );
};
