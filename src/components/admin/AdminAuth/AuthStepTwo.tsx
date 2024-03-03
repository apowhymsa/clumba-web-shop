import Loader from "@/components/Loader/Loader";
import Button from "@/components/UI/Button/Button";
import InputField from "@/components/UI/InputField/InputField";
import useToast from "@/hooks/useToast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const AdminFormSchema = z.object({
  code: z
    .string()
    .min(4, "Код повинен мати 4 символи")
    .max(4, "Код повинен мати 4 символи"),
});

type AdminFormSchemaType = z.infer<typeof AdminFormSchema>;
interface AuthStepTwoProps {
  authData: { adminID: string; codeID: string } | null;
  setAuth: Dispatch<SetStateAction<boolean>>;
}

const AuthStepTwo: FC<AuthStepTwoProps> = (props) => {
  const router = useRouter();
  const { authData, setAuth } = props;
  const { error, info } = useToast();
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
        `${process.env.ADMIN_ENDPOINT_BACKEND}/admin/authEnd`,
        {
          code: data.code.toString(),
          adminID: authData?.adminID,
          codeID: authData?.codeID,
        }
      );
      console.log(rData);
      setAuth(true);
      info(rData.msg);
      router.push("/admin/ingCategories");
    } catch (err) {
      const errObject = err as AxiosError;
      error((errObject.response?.data as any).msg);
    }
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-y-4 px-6 py-4"
    >
      <InputField
        labelText="Код авторизації"
        register={register}
        name="code"
        type="number"
        maxLength={4}
        error={errors.code}
      />
      <button
        disabled={isSubmitting}
        type="submit"
        className="rounded py-1 text-light bg-rose-400 hover:bg-rose-500 disabled:bg-rose-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? <Loader variant="secondary" /> : "Увійти"}
      </button>
    </form>
  );
};

export default AuthStepTwo;
