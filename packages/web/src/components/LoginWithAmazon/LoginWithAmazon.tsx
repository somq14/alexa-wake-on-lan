import clsx from "clsx";
import { ComponentPropsWithoutRef, FunctionComponent } from "react";

import styles from "./LoginWithAmazon.module.css";

export type LoginWithAmazonProps = ComponentPropsWithoutRef<"button">;

export const LoginWithAmazon: FunctionComponent<LoginWithAmazonProps> = (
  props
) => {
  return (
    <button {...props} className={clsx(styles.lwaButton, props.className)} />
  );
};
