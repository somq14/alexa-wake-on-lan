import clsx from "clsx";

import styles from "./IconButton.module.css";

export type IconButtonProps = {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

export const IconButton: React.FC<IconButtonProps> = (props) => {
  return (
    <button
      className={clsx(styles.iconButton, props.className)}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
