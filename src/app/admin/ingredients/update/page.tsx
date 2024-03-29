"use client";

import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import Button from "@/components/UI/Button/Button";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import useToast from "@/hooks/useToast";
import { useIngredientsStore } from "@/utils/zustand-store/ingredients";
import Loader from "@/components/Loader/Loader";

interface IVariants {
  vType: string;
  count: string;
}

type FormValues = {
  title: string;
  categoryID: string;
  variants: IVariants[];
  image: any;
};

const Page = () => {
  const { updateIngredient: updateI } = useIngredientsStore();
  const searchParams = useSearchParams();
  const [ingredient, setIngredient] = useState<any>(null);
  const {
    control,
    register,
    handleSubmit,
    formState,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const [ic, setIc] = useState<any[]>([]);
  const [ingImage, setIngImage] = useState<any>();
  const [ingredientLoading, setIngredientLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { error, info } = useToast();
  const [isLoading, setLoading] = useState(false);

  const { update, fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  useEffect(() => {
    async function getIngredient() {
      const requestConfig: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      };
      const response = await axios.get(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/ingredient/${searchParams.get(
          "id"
        )}`,
        requestConfig
      );
      setIngredient(response.data);
      setIngImage({
        url: `${process.env.ADMIN_ENDPOINT_BACKEND}/images/${response.data.image}`,
        fileName: response.data.image,
        isNew: false,
        base64: "",
      });
    }

    async function getIngCategories() {
      setIngredientLoading(true);
      const requestConfig: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      };
      const response = await axios.get(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/ingredientCategories`,
        requestConfig
      );
      response.data.forEach((category: any) => {
        setIc((currentState) => [
          ...currentState,
          {
            value: category._id,
            label: category.title,
          },
        ]);
      });
    }

    Promise.all([getIngredient(), getIngCategories()]).finally(() => {});
  }, []);

  useEffect(() => {
    if (ingredient) {
      ingredient?.variants.forEach((variant: any) => {
        append({ vType: variant.id.vType, count: variant.id.count });
      });
      setIngredientLoading(false);
    }
  }, [ingredient]);

  async function updateIngredient(
    data: FormValues,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) {
    setLoading(true);
    const category =
      typeof data.categoryID === "string"
        ? JSON.parse(data.categoryID).value
        : (data.categoryID as any).value;
    const img = data.image.length === 0 ? ingImage.fileName : data.image[0];

    const requestBody = {
      title: data.title,
      categoryID: category,
      variants: JSON.stringify(data.variants),
      image: img,
      isNewImage: data.image.length !== 0,
    };

    const requestConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": requestBody.isNewImage
          ? "multipart/form-data"
          : "application/json",
        "ngrok-skip-browser-warning": "true",
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    };

    try {
      const response = await axios.put(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/ingredient/${searchParams.get(
          "id"
        )}`,
        requestBody,
        requestConfig
      );
      updateI(response.data._id, response.data);

      info("Запис було успішно оновлено");
      router.back();
    } catch (err: unknown) {
      const errorObject = err as AxiosError;

      switch (errorObject.response?.status) {
        case 403: {
          error(
            "Не отриманно необхідних даних для видалення запису, оновіть сторінку та повторіть спробу"
          );
          break;
        }
        case 409: {
          error("Інгредієнт з вказаною назвою вже існує");
          break;
        }
        default:
          error(`${errorObject.message} - ${errorObject.name}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const toImage = (base64: string) => {
    const cleanedBase64String = base64.replace(/\s/g, "");

    const normalBase64 = cleanedBase64String.split(",")[1];

    const arrayBuffer = Uint8Array.from(atob(normalBase64), (c) =>
      c.charCodeAt(0)
    ).buffer;
    const blob = new Blob([arrayBuffer]);
    const fileType = (ingredient.image.name as string).endsWith(".png")
      ? "image/png"
      : "image/jpeg";

    return new File([blob], ingredient.image.name, { type: fileType });
  };

  if (ingredientLoading) {
    return <div>Завантаження даних...</div>;
  }

  // @ts-ignore
  return (
    <div className="p-10 min-h-screen bg-white">
      <h2 className="text-[16px] font-semibold text-center">
        Оновлення інгредієнту
      </h2>
      <form
        onSubmit={handleSubmit(updateIngredient)}
        encType="multipart/form-data"
      >
        <div className="flex flex-col gap-y-2">
          <div>
            <label
              htmlFor="categoryName"
              className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                errors.title
                  ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                  : null
              }`}
            >
              Назва інгредієнту
            </label>
            <div className="relative">
              <input
                defaultValue={ingredient.title}
                className={`block w-full rounded-md h-8 text-sm shadow-sm pl-4 ${
                  errors.title
                    ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                    : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                {...register("title", {
                  required: {
                    value: true,
                    message: "Поле обов'язкове для заповнення",
                  },
                })}
              />
            </div>
            {errors.title ? (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor="categoryID"
              className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                errors.categoryID
                  ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                  : null
              }`}
            >
              Категорія
            </label>
            <div className="relative">
              <Controller
                defaultValue={JSON.stringify({
                  label: ingredient.categoryID.title,
                  value: ingredient.categoryID._id,
                })}
                render={({ field }) => (
                  <Select
                    defaultValue={{
                      label: ingredient.categoryID.title,
                      value: ingredient.categoryID._id,
                    }}
                    ref={field.ref}
                    onChange={(data) => {
                      field.onChange(data);
                    }}
                    isSearchable={false}
                    options={ic}
                    className={`block w-full text-sm rounded-md shadow-sm ${
                      errors.categoryID
                        ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  />
                )}
                name="categoryID"
                control={control}
                // rules={{
                //     required: {
                //         value: true, message: "Поле обов'язкове для заповнення"
                //     }
                // }}
              />
            </div>
            {errors.categoryID ? (
              <p className="mt-1 text-sm text-red-500">
                {errors.categoryID.message}
              </p>
            ) : null}
          </div>
          <div className="">
            <label
              htmlFor="image"
              className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                errors.image
                  ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                  : null
              }`}
            >
              Зображення інгредієнту
            </label>
            <div className="flex gap-x-4">
              {ingImage ? (
                <div className="flex h-[200px]">
                  <img
                    src={ingImage.isNew ? ingImage.base64 : ingImage.url}
                    alt="Image"
                    className="object-cover border-0 outline-0 rounded"
                  />
                </div>
              ) : null}

              <label className="overflow-hidden flex w-full h-[200px] cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-200 p-6 transition-all hover:border-blue-400">
                <div className="relative space-y-1 text-center z-10">
                  <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                  </div>
                  {/*<div className="text-gray-600">Натисніть для завантаження</div>*/}
                  <p className="text-sm text-gray-500">PNG or JPG</p>
                </div>
                <input
                  accept=".png, .jpg, .jpeg"
                  id="image"
                  type="file"
                  className="sr-only"
                  {...register("image", {})}
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const base64: any = await toBase64(e.target.files[0]);
                      setIngImage({
                        url: "",
                        fileName: "",
                        isNew: true,
                        base64: base64,
                      });
                    }
                  }}
                />
              </label>
            </div>
            {errors.image ? (
              <p className="mt-1 text-sm text-red-500">
                {(errors.image as any).message}
              </p>
            ) : null}
          </div>
          <div>
            <div className="flex justify-between items-center my-4">
              <span className="flex-1 text-[15px]">Типи інгредієнту</span>
              <div className="w-fit">
                <Button
                  type="button"
                  variant="primary"
                  content="Додати ще одну модифікацію"
                  onClick={() => append({ vType: "", count: "" })}
                />
              </div>
            </div>
            <ul>
              {fields.map((item, index) => (
                <li key={item.id} className="flex flex-col gap-y-4">
                  <div className="flex gap-x-4 items-center">
                    {/*Назва типу*/}
                    <div className="flex-1">
                      <label
                        htmlFor={`variants.${index}.vType`}
                        className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                          errors.variants?.at?.(index)?.vType
                            ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                            : null
                        }`}
                      >
                        Назва типу
                      </label>
                      <div className="relative">
                        <input
                          className={`block w-full h-8 text-sm rounded-md shadow-sm pl-4 ${
                            errors.variants?.at?.(index)?.vType
                              ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                              : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                          }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                          {...register(`variants.${index}.vType`, {
                            required: {
                              value: true,
                              message: "Поле обов'язкове для заповнення",
                            },
                          })}
                        />
                      </div>
                      {errors.variants?.at?.(index)?.vType ? (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.variants?.at?.(index)?.vType?.message}
                        </p>
                      ) : null}
                    </div>
                    {/*Наявна кількість*/}
                    <div className="flex-1">
                      <label
                        htmlFor={`variants.${index}.count`}
                        className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                          errors.variants?.at?.(index)?.count
                            ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                            : null
                        }`}
                      >
                        Наявна кількість
                      </label>
                      <div className="relative">
                        <input
                          className={`block w-full h-8 text-sm rounded-md shadow-sm pl-4 ${
                            errors.variants?.at?.(index)?.count
                              ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                              : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                          }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                          {...register(`variants.${index}.count`, {
                            required: {
                              value: true,
                              message: "Поле обов'язкове для заповнення",
                            },
                          })}
                        />
                      </div>
                      {errors.variants?.at?.(index)?.count ? (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.variants?.at?.(index)?.count?.message}
                        </p>
                      ) : null}
                    </div>
                    {fields.length > 1 ? (
                      <span
                        className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700 h-fit"
                        title="Видалити"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="w-5 h-5 text-white" />
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex gap-x-4 w-max mt-4">
          <Button
            type="submit"
            variant="primary"
            content={isLoading ? <Loader /> : "Оновити"}
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default Page;
