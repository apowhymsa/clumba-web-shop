import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import Button from "@/components/UI/Button/Button";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Loader from "@/components/Loader/Loader";
import useToast from "@/hooks/useToast";
import { useTranslation } from "next-i18next";

type UserFields = {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: {
    current: string;
    new: string;
  };
};

const UserInfo = () => {
  const { error, info } = useToast();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFields>();
  const [isLoading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const userID = localStorage.getItem("authUserId");

    if (userID) {
      const getUserInfo = async () => {
        setLoading(true);
        const response = await axios.get(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/user/${userID}`,
          {
            headers: {
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
              "Access-Control-Allow-Origin": "*",
            },
            withCredentials: true,
          }
        );

        setUser(response.data);

        setValue("email", response.data.email);
        setValue("fullName", response.data.personals.fullName);
        setValue("phoneNumber", response.data.personals.phoneNumber);
      };

      Promise.all([getUserInfo()]).finally(() => setLoading(false));
    }
  }, []);

  const submitHandler = async (
    data: UserFields,
    event: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => {
    const userID = localStorage.getItem("authUserId");

    const requestBody = {
      data: {
        ...data,
        isUpdateProfile: true,
      },
    };

    const requestConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    };

    if (userID) {
      try {
        const response = await axios.put(
          `${process.env.ADMIN_ENDPOINT_BACKEND}/user/${userID}`,
          requestBody,
          requestConfig
        );
        info(
          i18n.language === "uk"
            ? "Обліковий запис оновлено"
            : "Account has been updated"
        );
        console.log(response.data);
      } catch (err: unknown) {
        const errObject = err as AxiosError;

        switch (errObject.response?.status) {
          case 400: {
            error(
              i18n.language === "uk"
                ? "Введіть дані для створення облікового запису та повторіть спробу ще раз"
                : "Enter your account information and try again"
            );
            break;
          }
          case 401: {
            error(
              i18n.language === "uk"
                ? "Некоректний старий пароль"
                : "Incorrect old password"
            );
            break;
          }
          case 403: {
            error(
              i18n.language === "uk"
                ? "Не отримано необхідних даних для оновлення облікового запису, спробуйте ще раз"
                : "The required data to update your account was not received, please try again"
            );
            break;
          }
          case 409: {
            error(
              i18n.language === "uk"
                ? "Обліковий запис з вказаними номером телефону або електронною поштую вже існує"
                : "An account with the specified phone number or e-mail already exists"
            );
            break;
          }
          default: {
            error(
              i18n.language === "uk"
                ? "Введіть дані для входу та повторіть спробу ще раз"
                : "Enter your login information and try again"
            );
            break;
          }
        }
      } finally {
        setLoading(false);
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {user ? (
        <p className="py-4">
          {i18n.language === "uk"
            ? "На вашому рахунку є"
            : "You have on your account"}{" "}
          <span className="font-semibold">
            {user.promo.bonuses}{" "}
            {i18n.language === "uk" ? "бонусів" : "bonuses"}
          </span>
          .{" "}
          {i18n.language === "uk"
            ? "Активне бонусне нарахування:"
            : "Active bonus accrual:"}{" "}
          <span className="font-semibold">{user.promo.bonusesPercent}%</span>{" "}
          {i18n.language === "uk"
            ? "від суми кожної покупки"
            : "of the amount of each purchase"}
        </p>
      ) : null}
      <form
        className="flex flex-col gap-y-2 mt-2"
        onSubmit={handleSubmit(submitHandler)}
      >
        <section className="flex justify-between gap-x-4 flex-col gap-y-4 sm:flex-row">
          <fieldset className="flex-1 flex flex-col gap-y-2">
            <legend className="font-semibold mb-4">
              {i18n.language === "uk"
                ? "Контактна інформація"
                : "Contact information"}
            </legend>
            <div>
              <label
                htmlFor="email"
                className={`w-fit mb-1 block text-sm font-bold text-dark dark:text-light ${
                  errors.email
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                {
                  (t("Auth", { returnObjects: true }) as any).LoginForm.email
                    .label
                }
              </label>
              <div className="relative">
                <input
                  type="email"
                  className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 dark:bg-[#1f2937] dark:text-light dark:border-dark ${
                    errors.email
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("email", {
                    required: {
                      value: true,
                      message:
                        i18n.language === "uk"
                          ? "Поле обов'язкове для заповнення"
                          : "Field is required",
                    },
                  })}
                />
              </div>
              {errors.email ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="fullName"
                className={`w-fit mb-1 block text-sm font-bold text-dark dark:text-light ${
                  errors.fullName
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                {
                  (t("Auth", { returnObjects: true }) as any).RegisterForm
                    .fullName.label
                }
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 dark:bg-[#1f2937] dark:text-light dark:border-dark ${
                    errors.fullName
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("fullName", {
                    required: {
                      value: true,
                      message:
                        i18n.language === "uk"
                          ? "Поле обов'язкове для заповнення"
                          : "Field is required",
                    },
                  })}
                />
              </div>
              {errors.fullName ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="title"
                className={`w-fit mb-1 block text-sm font-bold text-dark dark:text-light ${
                  errors.fullName
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                {
                  (t("Auth", { returnObjects: true }) as any).RegisterForm
                    .phoneNumber.label
                }
              </label>
              <div className="relative">
                <input
                  type="tel"
                  className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 dark:bg-[#1f2937] dark:text-light dark:border-dark ${
                    errors.phoneNumber
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("phoneNumber", {
                    required: {
                      value: true,
                      message:
                        i18n.language === "uk"
                          ? "Поле обов'язкове для заповнення"
                          : "Field is required",
                    },
                    pattern: {
                      value: /^\+380\d{9}/,
                      message:
                        i18n.language === "uk"
                          ? "Введіть коректний номер телефону, приклад: +380680000000"
                          : "Enter the correct phone number, for example: +380680000000",
                    },
                  })}
                />
              </div>
              {errors.phoneNumber ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              ) : null}
            </div>
          </fieldset>
          <fieldset className="flex-1 flex flex-col gap-y-2">
            <legend className="font-semibold mb-4">
              {i18n.language === "uk"
                ? "Інформація про аккаунт"
                : "Account information"}
            </legend>
            <div>
              <label
                htmlFor="password.current"
                className={`w-fit mb-1 block text-sm font-bold text-dark dark:text-light ${
                  errors.password?.current
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                {i18n.language === "uk" ? "Старий Пароль" : "Old password"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 dark:bg-[#1f2937] dark:text-light dark:border-dark ${
                    errors.password?.current
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("password.current", {
                    required: false,
                  })}
                />
              </div>
              {errors.password?.current ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.current.message}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="password.new"
                className={`w-fit mb-1 block text-sm font-bold text-dark dark:text-light ${
                  errors.password?.new
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                {i18n.language === "uk" ? "Новий пароль" : "New password"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 dark:bg-[#1f2937] dark:text-light dark:border-dark ${
                    errors.password?.new
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("password.new", {
                    required: false,
                  })}
                />
              </div>
              {errors.password?.new ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.new.message}
                </p>
              ) : null}
            </div>
          </fieldset>
        </section>
        <section className="w-fit">
          <Button
            type="submit"
            variant="primary"
            content={i18n.language === "uk" ? "Зберегти" : "Save"}
          />
        </section>
      </form>
    </>
  );
};

export default UserInfo;
