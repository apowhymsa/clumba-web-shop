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
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import Button from "@/components/UI/Button/Button";

type Props = {
  onClose: () => void;
  userFields: UserFields | undefined;
  setUserFields: Dispatch<SetStateAction<UserFields | undefined>>;
  setStep: Dispatch<SetStateAction<number>>;
};

const ModalSignUpStep1 = (props: Props) => {
  const [isLoading, setLoading] = useState(false);
  const { info, error } = useToast();
  const { onClose, setStep, setUserFields, userFields } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>();

  const onClickRegisterContinueHandler = async (
    data: IFormValues,
    event: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) => {
    event?.preventDefault();

    setLoading(true);

    try {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
      const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/users/${userFields?.email}`, requestConfig);

      error('Обліковий запис з вказаною електронною адресою вже існує')
    } catch (err: unknown) {
      const errorObject = err as AxiosError;

      if (errorObject.response?.status === 400) {
        setStep(2);
      } else {
        error('Введіть дані для створення облікового запису та повторіть спробу ще раз')
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 bg-white h-fit w-[500px] -translate-x-1/2 -translate-y-1/2 px-9 py-9 rounded"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="btn-close-modal flex absolute right-5 top-5 cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
        onClick={onClose}
      >
        <XMarkIcon className="h-6 w-6 text-black" />
      </div>
      <h3 className="text-center font-semibold text-xl">
        Створення облікового запису - Крок 1
      </h3>
      <div className="modal-container flex flex-col gap-y-5 my-4">
        <form
          className="default-section flex flex-col gap-y-5 my-3"
          onSubmit={handleSubmit(onClickRegisterContinueHandler)}
        >
          <InputField
            labelText="Електронна пошта"
            leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-500" />}
            placeholder="Приклад: your@email.com"
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
              minLength: {
                value: 6,
                message: "Поле повинно мати більше ніж 5 символів",
              },
            }}
            error={errors.email}
          />
          <InputField
            labelText="Пароль"
            leftIcon={<KeyIcon className="h-5 w-5 text-gray-500" />}
            placeholder="Пароль"
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

          <Button type='submit' variant='primary' content='Продовжити' isLoading={isLoading}/>
        </form>
      </div>
      <span className="flex justify-end items-center gap-x-1">
        <span>Є обліковий запис?</span>
        <span
          className="underline text-blue-400 cursor-pointer"
          onClick={() => setStep(3)}
        >
          Увійти
        </span>
      </span>
    </div>
  );
};

export default ModalSignUpStep1;
