import "@fontsource/material-icons";
import clsx from "clsx";

import styles from "./Icon.module.css";

export type IconProps = {
  className?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

export const Icon: React.FC<IconProps> = (props) => {
  return (
    <span
      className={clsx(
        "material-icons",
        styles[props.size ?? "md"],
        props.className
      )}
    >
      {props.name}
    </span>
  );
};
