import { ApolloError, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { CREATE_DEVICE, LIST_DEVICES } from "src/api/device-api";

const DeviceForm = z.object({
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
type DeviceForm = z.infer<typeof DeviceForm>;

export const useNewDevice = (): {
  formik: ReturnType<typeof useFormik<DeviceForm>>;
  loading: boolean;
  error?: ApolloError;
} => {
  const navigate = useNavigate();

  const [createDevice, { error }] = useMutation(CREATE_DEVICE, {
    refetchQueries: [LIST_DEVICES],
    awaitRefetchQueries: true,
  });

  const formik = useFormik<DeviceForm>({
    initialValues: {
      name: "パソコン",
      macAddress: "",
      description: "",
    },
    validationSchema: toFormikValidationSchema(DeviceForm),
    validateOnChange: false,
    onSubmit: async (values) => {
      await createDevice({
        variables: {
          name: values.name,
          macAddress: values.macAddress,
          description: values.description === "" ? null : values.description,
        },
      });
      navigate("/devices", { replace: true });
    },
  });

  return { formik, loading: formik.isSubmitting, error };
};
