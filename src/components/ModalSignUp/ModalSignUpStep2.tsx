import {
  KeyIcon,
  PhoneIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { UserFields } from "@/components/ModalSignUp/ModalAuth";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import InputField from "@/components/UI/InputField/InputField";
import { useForm } from "react-hook-form";
import useToast from "@/hooks/useToast";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {OpenDispatch} from "@/contexts/ModalContext/ModalContext";
import Button from "@/components/UI/Button/Button";
import {AuthContext} from "@/contexts/AuthContext/AuthContext";

type Props = {
  onClose: () => void;
  userFields: UserFields | undefined;
  setUserFields: Dispatch<SetStateAction<UserFields | undefined>>;
  setStep: Dispatch<SetStateAction<number>>;
  setOpen: Dispatch<SetStateAction<OpenDispatch>>;
};

export interface IFormValues {
  name: string;
  phone: string;
  password: string;
  email?: string;
}

const ModalSignUpStep2 = (props: Props) => {
  const { info, error } = useToast();
  const [isLoading, setLoading] = useState(false);
  const { onClose, setStep, userFields, setUserFields } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>();

  const onClickRegisterFinishHandler = async (
    data: IFormValues,
    event: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) => {
    setLoading(true);

    const requestBody = {
      email: userFields?.email,
      password: userFields?.password,
      fullName: userFields?.name,
      phoneNumber: userFields?.phone,
      avatar: 'https://i.pravatar.cc/300'
    }

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    }

    try {
      const response = await axios.post(`${process.env.ADMIN_ENDPOINT_BACKEND}/auth/register`, requestBody, requestConfig);

      setStep(3);
      info('Обліковий запис було успішно створено, виконайне вхід для продовження');
    } catch (err: unknown) {
      const errObject = err as AxiosError;

      switch (errObject.response?.status) {
        case 400: {
          error('Введіть дані для створення облікового запису та повторіть спробу ще раз');
          break;
        }
        case 409: {
          error('Обліковий запис з вказаним номером телефону вже існує');
          break;
        }
        default: {
          error('Введіть дані для входу та повторіть спробу ще раз');
          break;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 bg-white h-fit w-full sm:w-[500px] -translate-x-1/2 -translate-y-1/2 px-9 py-9 rounded"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="btn-close-modal flex absolute right-5 top-5 cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
        onClick={onClose}
      >
        <XMarkIcon className="h-6 w-6 text-black" />
      </div>
      <h3 className="text-center font-semibold text-xl">
        Створення облікового запису - Крок 2
      </h3>
      <form
        className="modal-container flex flex-col gap-y-5 my-4"
        onSubmit={handleSubmit(onClickRegisterFinishHandler)}
      >
        <InputField
          labelText="Ім'я та прізвище"
          leftIcon={<UserIcon className="h-5 w-5 text-gray-500" />}
          placeholder="Приклад: Дмитро Флоренко"
          id="name"
          name="name"
          type="text"
          defaultValue={userFields?.name || ""}
          onChangeCapture={(e) => {
            setUserFields({
              ...userFields,
              name: (e.target as HTMLInputElement).value,
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
          error={errors.name}
        />
        <InputField
          labelText="Номер телефону"
          leftIcon={<PhoneIcon className="h-5 w-5 text-gray-500" />}
          placeholder="Приклад: +380..."
          id="phone"
          name="phone"
          type="tel"
          defaultValue={userFields?.phone || ""}
          onChangeCapture={(e) => {
            setUserFields({
              ...userFields,
              phone: (e.target as HTMLInputElement).value,
            });
          }}
          register={register}
          options={{
            required: {
              value: true,
              message: "Поле обов'язкове для заповнення",
            },
            pattern: {
              value: /^\+380\d{9}/,
              message: 'Введіть коректний номер телефону, приклад: +380680000000'
            }
          }}
          error={errors.phone}
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
        <Button type='submit' variant='primary' content='Створити обіковий запис' isLoading={isLoading}/>
      </form>
    </div>
  );
};

export default ModalSignUpStep2;
