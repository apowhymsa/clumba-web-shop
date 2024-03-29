import { EnvelopeIcon, KeyIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import InputField from "@/components/UI/InputField/InputField";
import React, { Dispatch, SetStateAction, useState } from "react";
import { UserFields } from "@/components/ModalSignUp/ModalAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFormValues } from "@/components/ModalSignUp/ModalSignUpStep2";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/utils/firebase/firebase";
import useToast from "@/hooks/useToast";
import { collection, getDocs, query, where } from "@firebase/firestore";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Button from "@/components/UI/Button/Button";
import { OpenDispatch } from "@/contexts/ModalContext/ModalContext";
import { useTranslation } from "next-i18next";

type Props = {
  onClose: () => void;
  userFields: UserFields | undefined;
  setUserFields: Dispatch<SetStateAction<UserFields | undefined>>;
  setStep: Dispatch<SetStateAction<OpenDispatch>>;
};

const ModalSignUpStep1 = (props: Props) => {
  const [isLoading, setLoading] = useState(false);
  const { info, error } = useToast();
  const { onClose, setStep, setUserFields, userFields } = props;
  const { t, i18n } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>();

  const onClickRegisterContinueHandler = async (
    data: IFormValues,
    event: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    event?.preventDefault();

    setLoading(true);

    try {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      };
      const response = await axios.get(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/users/${userFields?.email}`,
        requestConfig
      );
      error("Обліковий запис з вказаною електронною адресою вже існує");
    } catch (err: unknown) {
      const errorObject = err as AxiosError;

      if (errorObject.response?.status === 400) {
        setStep({ isOpen: true, step: 2 });
      } else {
        error(
          "Введіть дані для створення облікового запису та повторіть спробу ще раз"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3 border-b dark:border-[#1f2937] dark:text-light">
        <div className="font-semibold text-lg">
          {(t("Auth", { returnObjects: true }) as any).RegisterForm.header}
        </div>
        <div
          className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6 text-black dark:text-gray-300" />
        </div>
      </div>
      <div className="px-6 py-4">
        <form
          className="default-section flex flex-col gap-y-5"
          onSubmit={handleSubmit(onClickRegisterContinueHandler)}
        >
          <InputField
            labelText={
              (t("Auth", { returnObjects: true }) as any).RegisterForm.email
                .label
            }
            leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-500" />}
            placeholder={
              (t("Auth", { returnObjects: true }) as any).RegisterForm.email
                .placeholder
            }
            id="email"
            name="email"
            type="email"
            defaultValue={userFields?.email || ""}
            onChangeCapture={(e) => {
              setUserFields({
                ...userFields,
                email: (e.target as HTMLInputElement).value,
              });
            }}
            register={register}
            options={{
              required: {
                value: true,
                message: "Поле обов'язкове для заповнення",
              },
            }}
            error={errors.email}
          />
          <InputField
            labelText={
              (t("Auth", { returnObjects: true }) as any).RegisterForm.password
                .label
            }
            leftIcon={<KeyIcon className="h-5 w-5 text-gray-500" />}
            placeholder={
              (t("Auth", { returnObjects: true }) as any).RegisterForm.password
                .placeholder
            }
            id="password"
            name="password"
            type="password"
            defaultValue={userFields?.password || ""}
            onChangeCapture={(e) => {
              setUserFields({
                ...userFields,
                password: (e.target as HTMLInputElement).value,
              });
            }}
            register={register}
            options={{
              required: {
                value: true,
                message: "Поле обов'язкове для заповнення",
              },
              minLength: {
                value: 6,
                message: "Поле повинно мати більше ніж 5 символів",
              },
            }}
            error={errors.password}
          />

          <Button
            type="submit"
            variant="primary"
            content={
              (t("Auth", { returnObjects: true }) as any).RegisterForm
                .continueBtn
            }
            isLoading={isLoading}
          />
        </form>
        <span className="flex justify-end items-center gap-x-1 mt-2 dark:text-light">
          <span>
            {(t("Auth", { returnObjects: true }) as any).RegisterForm.have.text}
          </span>
          <span
            className="underline text-blue-400 cursor-pointer"
            onClick={() => setStep({ isOpen: true, step: 3 })}
          >
            {
              (t("Auth", { returnObjects: true }) as any).RegisterForm.have
                .linkText
            }
          </span>
        </span>
      </div>
    </>
  );
};

export default ModalSignUpStep1;
