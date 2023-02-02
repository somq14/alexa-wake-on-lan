import { useQuery } from "@apollo/client/react";

import { DeviceCard } from "./DeviceCard";

import { Device, GET_DEVICE, LIST_DEVICES } from "src/api/device-api";
import { LinkButton } from "src/components/Button";
import { Content } from "src/components/Content";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";
import { Icon } from "src/components/Icon";

export const DeviceListPage: React.FC = () => {
  const { data, client } = useQuery<{ devices: Device[] }>(LIST_DEVICES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      data.devices.map((device) => {
        client.writeQuery({
          query: GET_DEVICE,
          variables: { id: device.id },
          data: { device },
        });
      });
    },
  });

  return (
    <>
      <Header />

      <Content className="flex-column flex-1">
        {data?.devices.length === 0 && (
          <div className="flex-1 flex-column justify-center">
            <p className="text-center text-lg">
              まずはパソコンを登録しましょう！
            </p>
          </div>
        )}
        {data?.devices.map((device) => (
          <DeviceCard
            className="mt-2"
            key={device.id}
            id={device.id}
            name={device.name}
            macAddress={device.macAddress}
            description={device.description ?? undefined}
            to={`/devices/${device.id}`}
          />
        ))}
      </Content>

      <Footer>
        <LinkButton to="/devices/new">
          <Icon name="add" />
          新しいパソコンを登録する
        </LinkButton>
      </Footer>
    </>
  );
};
