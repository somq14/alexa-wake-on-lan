import clsx from "clsx";
import { FunctionComponent } from "react";

import { Icon } from "src/components/Icon";

export type HeadingProps = {
  className?: string;
  label: string;
  caption?: string;
};

export const Heading: FunctionComponent<HeadingProps> = (props) => {
  return (
    <div
      className={clsx(
        "flex-row",
        "align-center",
        "gap-1",
        "my-3",
        props.className
      )}
    >
      <Icon name="computer" size="lg" />
      <div className="flex-1 flex-column">
        <h1 className="text-lg">{props.label}</h1>
        {props.caption !== undefined && (
          <p className="text-sm text-secondary">{props.caption}</p>
        )}
      </div>
    </div>
  );
};
