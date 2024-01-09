import {
  EnvelopeIcon,
  KeyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import InputField from "@/components/UI/InputField/InputField";
import { useForm } from "react-hook-form";
import useToast from "@/hooks/useToast";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import Button from "@/components/UI/Button/Button";
import {AuthContext} from "@/contexts/AuthContext/AuthContext";
import {useAppDispatch} from "@/utils/store/hooks";

type Props = {
  onClose: () => void;
  setStep: Dispatch<SetStateAction<number>>;
};

export interface IFormValues {
  email: string;
  password: string;
}

const ModalSignIn = (props: Props) => {
  const { error, info } = useToast();
  const {isLogged, setLogged} = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const { onClose, setStep } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormValues>();

  const onClickLoginHandler = async (data: IFormValues) => {
    setLoading(true);

    const requestBody = {
      email: data.email,
      password: data.password
    }

    const requestConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Access-Control-Allow-Origin': '*'
      },
      withCredentials: true
    }

    try {
      const response = await axios.post(`${process.env.ADMIN_ENDPOINT_BACKEND}/auth/login`, requestBody, requestConfig);
      localStorage.setItem('authUserId', response.data._id);
      setLogged(true);
      info('Успішний вхід у обліковий запис');
      onClose();
    } catch (err: unknown) {
      const errObject = err as AxiosError;

      switch (errObject.response?.status) {
        case 400: {
          error('Введіть дані для входу та повторіть спробу ще раз');
          break;
        }
        case 404: {
          error('Користувача з вказаною електронною адресою не знайдено');
          break;
        }
        case 401: {
          error('Невірний пароль від облікового запису');
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
      <h3 className="text-center font-semibold text-xl">Вхід у обліковий запис</h3>
      <div className="modal-container flex flex-col gap-y-5 my-4">
        <form
          className="default-section flex flex-col gap-y-5 my-3"
          onSubmit={handleSubmit(onClickLoginHandler)}
        >
          <InputField
            labelText="Електронна пошта"
            leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-500" />}
            placeholder="Приклад: your@email.com"
            id="email"
            name="email"
            type="email"
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

          <Button type='submit' variant='primary' content='Увійти' isLoading={isLoading}/>
        </form>
      </div>
      <span className="flex justify-end items-center gap-x-1">
        <span>Немає облікового запису?</span>
        <span
          className="underline text-blue-400 cursor-pointer"
          onClick={() => setStep(1)}
        >
          Створити
        </span>
      </span>
    </div>
  );
};

export default ModalSignIn;
