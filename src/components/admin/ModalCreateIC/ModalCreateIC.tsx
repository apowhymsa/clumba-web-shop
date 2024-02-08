import { EnvelopeIcon, KeyIcon, XMarkIcon } from "@heroicons/react/24/outline";
import InputField from "@/components/UI/InputField/InputField";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useToast from "@/hooks/useToast";
import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Button from "@/components/UI/Button/Button";
import { IFormValues } from "@/components/ModalSignUp/ModalSignIn";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import { useQueryClient } from "@tanstack/react-query";
import { useIngredientCategoriesStore } from "@/utils/zustand-store/ingredientCategories";
import Loader from "@/components/Loader/Loader";

type FormValues = {
  categoryName: string;
};

type Props = {
  onClose: () => void;
  isOpen: boolean;
};

const ModalCreateIC = (props: Props) => {
  const { addIngredientCategory, ingredientCategories } =
    useIngredientCategoriesStore();
  const { onClose, isOpen } = props;
  const { error, info } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const createIngredientCategory = async (data: FormValues) => {
    setLoading(true);
    const requestBody = {
      title: data.categoryName,
    };

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
        `${process.env.ADMIN_ENDPOINT_BACKEND}/ingredientCategory`,
        requestBody,
        requestConfig
      );

      addIngredientCategory(response.data);

      info("Категорія інгредієнтів була створена");
      onClose();
    } catch (err: unknown) {
      const errorObject = err as AxiosError;

      switch (errorObject.response?.status) {
        case 409: {
          error("Вже існує категорія інгредієнтів з такою назвою");
          break;
        }
        default:
          error(`${errorObject.message} - ${errorObject.name}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 py-3 border-b">
        <div className="font-bold text-lg">
          Створення категорії інгредієнтів
        </div>
        <div
          className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
          onClick={onClose}
        >
          <XMarkIcon className="h-6 w-6 text-black" />
        </div>
      </div>
      <div className="px-6 py-4">
        <form
          className="default-section flex flex-col gap-y-5"
          onSubmit={handleSubmit(createIngredientCategory)}
        >
          <div className="text-[14px]">
            <label
              htmlFor="categoryName"
              className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                errors.categoryName
                  ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                  : null
              }`}
            >
              Назва категорії інгредієнтів
            </label>
            <div className="relative">
              <input
                className={`block w-full h-8 rounded-md shadow-sm pl-4 ${
                  errors.categoryName
                    ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                {...register("categoryName", {
                  required: {
                    value: true,
                    message: "Поле обов'язкове для заповнення",
                  },
                })}
              />
            </div>
            {errors.categoryName ? (
              <p className="mt-1 text-sm text-red-500">
                {errors.categoryName.message}
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            variant="primary"
            content={isLoading ? <Loader /> : "Створити"}
            isLoading={isLoading}
          />
        </form>
      </div>
    </>
  );
};

export default ModalCreateIC;
