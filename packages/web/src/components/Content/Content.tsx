import clsx from "clsx";
import React from "react";

import styles from "./Content.module.css";

export type ContentProps = {
  className?: string;
  children: React.ReactNode;
};

export const Content: React.FC<ContentProps> = (props) => {
  return (
    <main className={clsx(styles.content, props.className)}>
      {props.children}
    </main>
  );
};
