import clsx from "clsx";
import { Link } from "react-router-dom";

import styles from "./Card.module.css";

export type CardProps = {
  className?: string;
  children?: React.ReactNode;
  to?: string;
};

export const Card: React.FC<CardProps> = (props) => {
  return props.to === undefined ? (
    <section className={clsx(styles.card, props.className)}>
      {props.children}
    </section>
  ) : (
    <Link
      className={clsx(styles.card, styles.clickable, props.className)}
      to={props.to}
    >
      {props.children}
    </Link>
  );
};
