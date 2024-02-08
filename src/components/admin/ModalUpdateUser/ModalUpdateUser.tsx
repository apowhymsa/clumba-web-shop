import useToast from "@/hooks/useToast";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Button from "@/components/UI/Button/Button";
import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "@/components/Loader/Loader";
import { useUsersStore } from "@/utils/zustand-store/users";

type FormValues = {
  email: string;
  fullName: string;
  phoneNumber: string;
  ordersSummary: number;
  bonuses: number;
  bonusesPercent: number;
};

type Props = {
  onClose: () => void;
  isOpen: boolean;
  id: string;
};

const ModalUpdateUser = (props: Props) => {
  const { onClose, isOpen, id } = props;
  const { error, info } = useToast();
  const [isUserDataLoading, setUserDataLoading] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { updateUser: updateU } = useUsersStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    const getUserById = () => {
      setUserDataLoading(true);
      fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/user/${id}`)
        .then((response) => response.json())
        .then((userData) => {
          setUser(userData);
          console.log(userData);
        })
        .catch((error) => console.error(error))
        .finally(() => setUserDataLoading(false));
    };

    getUserById();
  }, []);

  const updateUser = async (data: FormValues) => {
    setLoading(true);
    const requestBody = {
      data: {
        email: data.email,
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        promo: {
          ordersSummary: data.ordersSummary,
          bonuses: data.bonuses,
          bonusesPercent: data.bonusesPercent,
        },
        isUpdateProfile: true,
        isUpdateProfileFromAdmin: true,
      },
    };

    console.log("req", requestBody);

    const requestConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    };

    try {
      const response = await axios.put(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/user/${id}`,
        requestBody,
        requestConfig
      );

      console.log(response.data);
      updateU(id, {
        _id: response.data._id,
        email: response.data.email,
        personals: response.data.personals,
        promo: response.data.promo,
      });

      info(`Обліковий запис клієнта: ${data.fullName} було оновлено.`);
      onClose();
    } catch (err: unknown) {
      const errorObject = err as AxiosError;

      switch (errorObject.response?.status) {
        case 409: {
          error(
            "Вже існує клієнт з вказанною електронною адресою або номером телефону"
          );
          break;
        }
        case 410: {
          error(
            "Вже існує клієнт з вказанною електронною адресою або номером телефону"
          );
          break;
        }
        default:
          error(`${errorObject.message} - ${errorObject.name}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (isUserDataLoading) return <Loader />;

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <div className="font-bold text-lg">Оновлення користувача</div>
        <div
          className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6 text-black" />
        </div>
      </div>
      <div className="px-6 py-4">
        <form
          className="default-section flex gap-x-4"
          onSubmit={handleSubmit(updateUser)}
        >
          <div className="flex flex-col gap-y-4 flex-1">
            <div className="text-[14px]">
              <label
                htmlFor="categoryName"
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                  errors.fullName
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                Ім`я та прізвище користувача
              </label>
              <div className="relative">
                <input
                  defaultValue={user?.personals.fullName}
                  className={`block w-full h-8 rounded-md shadow-sm pl-4 ${
                    errors.fullName
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("fullName", {
                    required: {
                      value: true,
                      message: "Поле обов'язкове для заповнення",
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
            <div className="text-[14px]">
              <label
                htmlFor="email"
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                  errors.email
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                Електронна адреса
              </label>
              <div className="relative">
                <input
                  defaultValue={user?.email}
                  className={`block w-full h-8 rounded-md shadow-sm pl-4 ${
                    errors.email
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Поле обов'язкове для заповнення",
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
            <div className="text-[14px]">
              <label
                htmlFor="phoneNumber"
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                  errors.phoneNumber
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                Номер телефону
              </label>
              <div className="relative">
                <input
                  defaultValue={user?.personals.phoneNumber}
                  className={`block w-full h-8 rounded-md shadow-sm pl-4 ${
                    errors.phoneNumber
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("phoneNumber", {
                    required: {
                      value: true,
                      message: "Поле обов'язкове для заповнення",
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
            <Button
              type="submit"
              variant="primary"
              content={isLoading ? <Loader /> : "Оновити"}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <div className="text-[14px]">
              <label
                htmlFor="ordersSummary"
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                  errors.ordersSummary
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                Загальна сума покупок
              </label>
              <div className="relative">
                <input
                  defaultValue={user?.promo.ordersSummary}
                  min={0}
                  type="number"
                  className={`block w-full h-8 rounded-md shadow-sm pl-4 ${
                    errors.ordersSummary
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("ordersSummary", {
                    required: {
                      value: true,
                      message: "Поле обов'язкове для заповнення",
                    },
                  })}
                  onChange={(e) => {
                    if (Number(e.target.value) >= 10000) {
                      setValue("bonusesPercent", 4);
                    } else {
                      setValue("bonusesPercent", 2);
                    }
                  }}
                />
              </div>
              {errors.ordersSummary ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.ordersSummary.message}
                </p>
              ) : null}
            </div>
            <div className="text-[14px]">
              <label
                htmlFor="bonuses"
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                  errors.bonuses
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                Кількість бонусів
              </label>
              <div className="relative">
                <input
                  defaultValue={user?.promo.bonuses}
                  min={0}
                  type="number"
                  className={`block w-full h-8 rounded-md shadow-sm pl-4 ${
                    errors.bonuses
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("bonuses", {
                    required: {
                      value: true,
                      message: "Поле обов'язкове для заповнення",
                    },
                  })}
                />
              </div>
              {errors.bonuses ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.bonuses.message}
                </p>
              ) : null}
            </div>
            <div className="text-[14px]">
              <label
                htmlFor="bonusesPercent"
                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                  errors.bonusesPercent
                    ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                    : null
                }`}
              >
                Відсоток нарахування (автоматично)
              </label>
              <div className="relative">
                <input
                  defaultValue={user?.promo.bonusesPercent}
                  disabled={true}
                  type="number"
                  className={`block w-full h-8 rounded-md shadow-sm pl-4 ${
                    errors.bonusesPercent
                      ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                      : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                  }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  {...register("bonusesPercent")}
                />
              </div>
              {errors.bonusesPercent ? (
                <p className="mt-1 text-sm text-red-500">
                  {errors.bonusesPercent.message}
                </p>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ModalUpdateUser;
