import clsx from "clsx";
import React from "react";
import { Link } from "react-router-dom";

import styles from "./Header.module.css";

import { useAuth } from "src/AuthProvider";
import { Icon } from "src/components/Icon";
import { IconButton } from "src/components/IconButton";

export type HeaderProps = {
  className?: string;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { isSignedIn, signOut } = useAuth();

  return (
    <header className={clsx(styles.container, props.className)}>
      <Link to="/">アレクサ、パソコンつけて</Link>
      {isSignedIn && (
        <IconButton onClick={signOut}>
          <Icon name="logout" />
        </IconButton>
      )}
    </header>
  );
};
