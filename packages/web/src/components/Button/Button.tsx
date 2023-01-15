import clsx from "clsx";
import React, { ComponentPropsWithoutRef } from "react";

import styles from "./Button.module.css";

import { Icon } from "src/components/Icon";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  loading?: boolean;
};

export const Button: React.FC<ButtonProps> = (props) => {
  const { loading, ...restProps } = props;
  return (
    <button
      {...restProps}
      disabled={props.disabled || loading}
      className={clsx(styles.button, props.className)}
    >
      {loading ? (
        <Icon name="sync" className={styles.loading} />
      ) : (
        props.children
      )}
    </button>
  );
};
