/* eslint-disable @typescript-eslint/naming-convention */
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import {
  DELETE_DEVICE,
  Device,
  GET_DEVICE,
  LIST_DEVICES,
  UPDATE_DEVICE,
} from "src/api/device-api";

export const DeviceForm = z.object({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  name: z.string({ required_error: "入力してください。" }),
  macAddress: z
    // eslint-disable-next-line @typescript-eslint/naming-convention
    .string({ required_error: "入力してください。" })
    .regex(
      /^[0-9A-F][0-9A-F](-[0-9A-F][0-9A-F]){5}$/,
      "AA-BB-CC-11-22-33 の形式で入力してください。"
    ),
  description: z.string().optional(),
});
export type DeviceForm = z.infer<typeof DeviceForm>;

export const useDevice = (
  id: string
): {
  formik: ReturnType<typeof useFormik<DeviceForm>>;
  loading: boolean;
  updating: boolean;
  loadError?: ApolloError;
} => {
  const { loading, error } = useQuery<{ device: Device }>(GET_DEVICE, {
    variables: { id },
    onCompleted: (data) => {
      void formik.setValues({
        name: data.device.name,
        macAddress: data.device.macAddress,
        description: data.device.description ?? "",
      });
    },
  });

  const [updateDevice, { loading: updating }] = useMutation(UPDATE_DEVICE);

  const formik = useFormik<DeviceForm>({
    initialValues: {
      name: "",
      macAddress: "",
      description: "",
    },
    validationSchema: toFormikValidationSchema(DeviceForm),
    validateOnChange: false,
    onSubmit: async (values) => {
      await updateDevice({
        variables: {
          id,
          name: values.name,
          macAddress: values.macAddress,
          description: values.description === "" ? null : values.description,
        },
      });
    },
  });

  return {
    formik,
    loading,
    updating,
    loadError: error,
  };
};

export const useDeleteDevice = (
  id: string
): {
  deleting: boolean;
  deleteDevice: () => Promise<void>;
} => {
  const navigate = useNavigate();
  const [mutate, { loading }] = useMutation(DELETE_DEVICE, {
    refetchQueries: [LIST_DEVICES],
    awaitRefetchQueries: true,
  });

  return {
    deleting: loading,
    deleteDevice: useCallback(async () => {
      await mutate({ variables: { id } });
      navigate("/devices", { replace: true });
    }, [id, mutate, navigate]),
  };
};
