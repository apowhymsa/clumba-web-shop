import Loader from "@/components/Loader/Loader";
import Button from "@/components/UI/Button/Button";
import InputField from "@/components/UI/InputField/InputField";
import useToast from "@/hooks/useToast";
import { EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const AdminFormSchema = z.object({
  email: z.string().email({ message: "Некоректна email адреса" }),
  password: z
    .string()
    .min(4, { message: "Поле повинно мати більше ніж 4 символи" })
    .max(20, { message: "Поле повинно мати не більше ніж 20 символів" }),
});

type AdminFormSchemaType = z.infer<typeof AdminFormSchema>;
interface AuthStepOneProps {
  setStep: Dispatch<SetStateAction<number>>;
  setAuthData: Dispatch<
    SetStateAction<{
      adminID: string;
      codeID: string;
    } | null>
  >;
}

const AuthStepOne: FC<AuthStepOneProps> = (props) => {
  const { setStep, setAuthData } = props;
  const { error } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormSchemaType>({
    resolver: zodResolver(AdminFormSchema),
  });

  async function onSubmit(data: AdminFormSchemaType) {
    try {
      const { data: rData } = await axios.post(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/admin/authBegin`,
        {
          email: data.email,
          password: data.password,
        }
      );
      setAuthData(rData);
      setStep(2);
    } catch (err) {
      const errorObj = err as any;
      error(errorObj.response.data.msg || errorObj.message);
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-4 px-6 py-4"
    >
      <InputField
        leftIcon={<EnvelopeIcon className="text-gray-400 w-5 h-5" />}
        labelText="Email"
        register={register}
        name="email"
        type="email"
        error={errors.email}
      />
      <InputField
        leftIcon={<KeyIcon className="text-gray-400 w-5 h-5" />}
        labelText="Пароль"
        register={register}
        name="password"
        type="password"
        error={errors.password}
      />
      <button
        disabled={isSubmitting}
        type="submit"
        className="rounded py-1 text-light bg-rose-400 hover:bg-rose-500 disabled:bg-rose-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? <Loader variant="secondary" /> : "Продовжити"}
      </button>
    </form>
  );
};

export default AuthStepOne;
