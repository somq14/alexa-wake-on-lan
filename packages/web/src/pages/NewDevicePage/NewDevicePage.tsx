import { useState } from "react";

import { useNewDevice } from "./useNewDevice";

import { Button } from "src/components/Button";
import { Content } from "src/components/Content";
import { Footer } from "src/components/Footer";
import { Header } from "src/components/Header";
import { Heading } from "src/components/Heading";
import { Icon } from "src/components/Icon";
import { TextField } from "src/components/TextField";

export const NewDevicePage: React.FC = () => {
  const [formId] = useState(crypto.randomUUID());
  const { formik, loading, error } = useNewDevice();

  return (
    <>
      <Header />

      <Content className="flex-column flex-1">
        <Heading label="新しいパソコン" />

        <form
          id={formId}
          className="flex-column gap-2"
          onSubmit={formik.handleSubmit}
        >
          {error && (
            <div className="flex-row align-center text-error gap-1">
              <Icon name="error" />
              <p className="flex-1">{error.message}</p>
            </div>
          )}

          <TextField
            label="名前"
            placeholder="パソコン"
            maxLength={16}
            {...formik.getFieldProps("name")}
            error={formik.errors.name}
            disabled={loading}
          />

          <TextField
            label="MACアドレス"
            placeholder="AA-BB-CC-11-22-33"
            maxLength={17}
            {...formik.getFieldProps("macAddress")}
            error={formik.errors.macAddress}
            disabled={loading}
          />

          <TextField
            label="メモ"
            optional
            maxLength={40}
            {...formik.getFieldProps("description")}
            error={formik.errors.description}
            disabled={loading}
          />
        </form>
      </Content>

      <Footer>
        <Button type="submit" form={formId} loading={loading}>
          <Icon name="add" />
          登録する
        </Button>
      </Footer>
    </>
  );
};
