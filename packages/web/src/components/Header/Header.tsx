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
      <div className="flex-row align-center gap-2">
        <a
          className={styles.github}
          href="https://github.com/somq14/alexa-wake-on-lan/blob/develop/README.md"
        >
          <img src="/github-mark.png" alt="github" />
        </a>
        {isSignedIn && (
          <IconButton onClick={signOut}>
            <Icon name="logout" />
          </IconButton>
        )}
      </div>
    </header>
  );
};
