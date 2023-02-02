import clsx from "clsx";
import { ComponentPropsWithoutRef, FunctionComponent } from "react";

import styles from "./Logotype.module.css";

export type LogotypeProps = ComponentPropsWithoutRef<"div">;

export const Logotype: FunctionComponent<LogotypeProps> = (props) => {
  return (
    <div
      {...props}
      className={clsx("flex-column align-center", props.className)}
    >
      <img alt="logo" src="/icon512.png" className={styles.logo} />
      <h1 className={clsx("text-xl", "mt-1", styles.text)}>
        <span className="text-md">Amazon Alexa 用の</span>
        <br />
        Wake-on-LAN スキル
      </h1>
    </div>
  );
};
