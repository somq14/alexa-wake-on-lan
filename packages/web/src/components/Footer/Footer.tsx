import clsx from "clsx";
import { FunctionComponent, ReactNode } from "react";

import styles from "./Footer.module.css";

export type FooterProps = {
  className?: string;
  children?: ReactNode;
};

export const Footer: FunctionComponent<FooterProps> = (props) => {
  return (
    <footer className={clsx(styles.footer, props.className)}>
      {props.children}
    </footer>
  );
};
