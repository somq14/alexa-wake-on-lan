import { useState } from "react";
import { useParams } from "react-router-dom";

import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

import { useDeleteDevice, useDevice } from "./useDevice";

import { Button } from "src/components/Button";
import { Content } from "src/components/Content";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";
import { Heading } from "src/components/Heading";
import { Icon } from "src/components/Icon";
import { TextField } from "src/components/TextField";

export const DevicePage: React.FC = () => {
  const { id } = useParams();
  if (id === undefined) {
    throw new Error("id must be defined.");
  }

  const [formId] = useState(crypto.randomUUID());
  const { formik, loading, updating, loadError } = useDevice(id);

  const { deleteDevice, deleting } = useDeleteDevice(id);

  if (loadError) {
    return <NotFoundPage />;
  }

  const processing = loading || updating || deleting;

  return (
    <>
      <Header />

      <Content className="flex-column flex-1">
        <Heading label="あなたのパソコン" caption={id} />

        <form
          id={formId}
          className="flex-column gap-2"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            label="名前"
            placeholder="パソコン"
            maxLength={16}
            {...formik.getFieldProps("name")}
            error={formik.errors.name}
            disabled={processing}
          />

          <TextField
            label="MACアドレス"
            placeholder="AA-BB-CC-11-22-33"
            maxLength={17}
            {...formik.getFieldProps("macAddress")}
            error={formik.errors.macAddress}
            disabled={processing}
          />

          <TextField
            label="メモ"
            optional
            maxLength={40}
            {...formik.getFieldProps("description")}
            error={formik.errors.description}
            disabled={processing}
          />

          <button
            type="button"
            className="text-sm text-secondary text-center text-underline mt-2"
            onClick={deleteDevice}
            disabled={processing}
          >
            このパソコンを削除する
          </button>
        </form>
      </Content>

      <Footer>
        <Button
          type="submit"
          form={formId}
          disabled={processing}
          loading={updating}
        >
          <Icon name="check" />
          保存する
        </Button>
      </Footer>
    </>
  );
};
