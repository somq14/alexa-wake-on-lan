import clsx from "clsx";
import React from "react";
import { Link, LinkProps } from "react-router-dom";

import styles from "./Button.module.css";

export type LinkButtonProps = LinkProps;

export const LinkButton: React.FC<LinkButtonProps> = (props) => {
  const { ...restProps } = props;
  return (
    <Link {...restProps} className={clsx(styles.button, props.className)}>
      {props.children}
    </Link>
  );
};
