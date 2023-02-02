import clsx from "clsx";

import { Card } from "src/components/Card";
import { Icon } from "src/components/Icon";

export type DeviceCardProps = {
  className?: string;
  id: string;
  name: string;
  macAddress: string;
  description?: string;
  to?: string;
};

export const DeviceCard: React.FC<DeviceCardProps> = (props) => {
  return (
    <Card
      className={clsx("flex-row", "align-center", "gap-1", props.className)}
      to={props.to}
    >
      <div className="flex-1 flex-column gap-0">
        <h2 className="text-lg">{props.name}</h2>
        <p className="text-mono text-sm text-secondary">{props.macAddress}</p>
        {props.description !== undefined && (
          <p className="text-secondary text-sm">{props.description}</p>
        )}
      </div>
      <Icon className="text-secondary" name="chevron_right" />
    </Card>
  );
};
