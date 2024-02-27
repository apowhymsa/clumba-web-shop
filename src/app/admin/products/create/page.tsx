"use client";

import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Button from "@/components/UI/Button/Button";
import Select from "react-select";
import axios, { AxiosRequestConfig } from "axios";
import NestedFieldArray from "@/app/admin/products/create/NestedFieldArray";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/useToast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { toBase64 } from "@/utils/toBase64";
import { useProductsStore } from "@/utils/zustand-store/products";
import { router } from "next/client";
import Loader from "@/components/Loader/Loader";

interface IIngredient {
  id: string;
  variantID: string;
}

interface IVariant {
  title: string;
  price: string;
  discount: {
    state: boolean;
    percent: string;
  };
  ingredients: Array<{
    ingredient: IIngredient;
    count: string;
  }>;
}

interface FormValues {
  image: any;
  title: string;
  categoryID: string;
  price: string;
  isNotVisible: boolean;
  variants: IVariant[];
}

const Page = () => {
  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      variants: [
        {
          discount: {
            state: false,
            percent: "0",
          },
          title: "",
          ingredients: [
            {
              ingredient: {
                id: "",
                variantID: "",
              },
            },
          ],
        },
      ],
    },
  });
  const { addProduct } = useProductsStore();
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [discount, setDiscount] = useState({ state: false, percent: 0 });
  const [pc, setPc] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const [prodImage, setProdImage] = useState("");
  const router = useRouter();
  const { error, info } = useToast();
  const [isNotVisibleProduct, setNotVisibleProduct] = useState(false);
  const { update, insert, fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function getProductCategories() {
      setCategoriesLoading(true);
      const requestConfig: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "Access-Control-Allow-Origin": "*",
        },
        withCredentials: true,
      };
      const response = await axios.get(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories?limit=1000&page=1`,
        requestConfig
      );
      response.data.categories.forEach((category: any) => {
        setPc((currentState) => [
          ...currentState,
          {
            value: category._id,
            label: category.title,
          },
        ]);
      });
    }

    getProductCategories().finally(() => setCategoriesLoading(false));
  }, []);

  async function createProduct(
    data: FormValues,
    event: BaseSyntheticEvent<object, any, any> | undefined
  ) {
    setLoading(true);
    const image: any = data.image;

    // const requestBody = {
    //     title: data.title, categoryID: (data.categoryID as any).value, variants: data.variants, image: image[0]
    // }

    const normalizeIngredients = data.variants.map((variant: IVariant) => {
      return {
        title: variant.title,
        price: variant.price,
        discount: variant.discount,
        ingredients: variant.ingredients.map((ingredient) => {
          return {
            count: ingredient.count,
            ingredient: {
              id: (ingredient.ingredient.id as any).value,
              variantID: (ingredient.ingredient.variantID as any).value,
            },
          };
        }),
      };
    });

    const requestBody = {
      image: image[0],
      title: data.title,
      isNotVisible: isNotVisibleProduct,
      categoryID: (data.categoryID as any).value,
      variants: JSON.stringify(normalizeIngredients),
      isNewImage: true,
    };

    console.log(requestBody);

    const requestConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
        "ngrok-skip-browser-warning": "true",
        "Access-Control-Allow-Origin": "*",
      },
      withCredentials: true,
    };

    try {
      const response = await axios.put(
        `${process.env.ADMIN_ENDPOINT_BACKEND}/product`,
        requestBody,
        requestConfig
      );
      addProduct(response.data);

      router.back();
      // console.log(response.data);
      info("Запис було успішно створено");
      // reset();

      // fields.slice(0, 0);
      // setIngImage('');
      // append({vType: '', count: ''});
    } catch (err: unknown) {
      const errorObject = err as AxiosError;

      switch (errorObject.response?.status) {
        case 403: {
          error(
            "Не отриманно необхідних даних для створення запису, оновіть сторінку та повторіть спробу"
          );
          break;
        }
        case 409: {
          error("Товар з вказаною назвою вже існує");
          break;
        }
        default:
          error(`${errorObject.message} - ${errorObject.name}`);
      }
    } finally {
      setLoading(false);
    }
  }

  // @ts-ignore
  return (
    <div className="p-4 m-4 bg-white min-h-screen">
      <h2 className="text-[16px] font-semibold text-center">
        Створення товару
      </h2>
      <form
        onSubmit={handleSubmit(createProduct)}
        encType="multipart/form-data"
      >
        <div className="flex flex-col gap-y-2">
          <div>
            <label
              htmlFor="title"
              className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                errors.title
                  ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                  : null
              }`}
            >
              Назва товару
            </label>
            <div className="relative">
              <input
                className={`block w-full h-8 text-sm rounded-md shadow-sm pl-4 ${
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
          <div className="flex flex-2 items-center space-x-3 my-2">
            <label
              htmlFor="isNotVisible"
              className="relative inline-flex cursor-pointer items-center"
            >
              <input
                {...register("isNotVisible")}
                onChange={(e) => {
                  setNotVisibleProduct(e.target.checked);
                }}
                type="checkbox"
                id="isNotVisible"
                className="peer sr-only h-8 text-sm"
              />
              <div className="h-6 w-11 rounded-full bg-gray-100 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] hover:bg-gray-200 peer-checked:bg-rose-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-200 peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:after:bg-gray-50"></div>
            </label>
            <span className="w-fit block text-sm font-bold text-gray-700">
              Не відображати товар на сайті
            </span>
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
                render={({ field }) => (
                  <Select
                    isDisabled={categoriesLoading}
                    ref={field.ref}
                    onChange={field.onChange}
                    isSearchable={false}
                    options={pc}
                    className={`block w-full text-sm rounded-md shadow-sm ${
                      errors.categoryID
                        ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                    }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                  />
                )}
                name="categoryID"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: "Поле обов'язкове для вибору",
                  },
                }}
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
              Зображення товару
            </label>
            <div className="flex gap-x-4">
              {prodImage ? (
                <div className="flex h-[200px]">
                  <img
                    src={prodImage}
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
                  {...register("image", {
                    required: {
                      value: true,
                      message: "Зображення обов'язкове для завантаження",
                    },
                  })}
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const base64: any = await toBase64(e.target.files[0]);
                      setProdImage(base64);
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
              <span className="flex-1 text-[15px]">Варіанти товару</span>
              <div className="w-fit">
                <Button
                  type="button"
                  variant="primary"
                  content="Додати ще один варіант"
                  onClick={() =>
                    append({
                      price: "",
                      discount: {
                        state: false,
                        percent: "0",
                      },
                      title: "",
                      ingredients: [
                        {
                          ingredient: {
                            id: "",
                            variantID: "",
                          },
                          count: "",
                        },
                      ],
                    })
                  }
                />
              </div>
            </div>
            {fields.map((variant, variantIndex) => (
              <div key={variant.id}>
                <div className="flex gap-x-4">
                  <div className="flex flex-col flex-1 gap-y-2">
                    <div className="flex-1">
                      <label
                        htmlFor={`variants.${variantIndex}.title`}
                        className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                          errors.variants &&
                          (errors.variants.at?.(variantIndex) as any)?.title
                            ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                            : null
                        }`}
                      >
                        Назва варіанту товару
                      </label>
                      <div className="relative">
                        <input
                          className={`block w-full h-8 text-sm rounded-md shadow-sm pl-4 ${
                            errors.variants &&
                            (errors.variants.at?.(variantIndex) as any)?.title
                              ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                              : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                          }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                          {...register(`variants.${variantIndex}.title`, {
                            required: {
                              value: true,
                              message: "Поле обов'язкове для заповнення",
                            },
                          })}
                          defaultValue={variant.title}
                        />
                      </div>
                      {errors.variants &&
                      (errors.variants.at?.(variantIndex) as any)?.title ? (
                        <p className="mt-1 text-sm text-red-500">
                          {
                            (errors.variants.at?.(variantIndex) as any).title
                              .message
                          }
                        </p>
                      ) : null}
                    </div>
                    <div className="flex gap-x-4 items-center">
                      <div className="flex-1">
                        <label
                          htmlFor={`variants.${variantIndex}.price`}
                          className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                            errors.variants &&
                            (errors.variants.at?.(variantIndex) as any)?.price
                              ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                              : null
                          }`}
                        >
                          Ціна товару
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5">
                            &#8372;
                          </div>
                          <input
                            min={1}
                            type="number"
                            className={`block w-full h-8 text-sm rounded-md shadow-sm pl-8 ${
                              errors.variants &&
                              (errors.variants.at?.(variantIndex) as any)?.price
                                ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                                : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                            }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                            {...register(`variants.${variantIndex}.price`, {
                              required: {
                                value: true,
                                message: "Поле обов'язкове для заповнення",
                              },
                              min: {
                                value: 1,
                                message: "Ціна товару повинна бути вища за 0",
                              },
                            })}
                          />
                        </div>
                        {errors.variants &&
                        (errors.variants.at?.(variantIndex) as any)?.price ? (
                          <p className="mt-1 text-sm text-red-500">
                            {
                              (errors.variants.at?.(variantIndex) as any)?.price
                                .message
                            }
                          </p>
                        ) : null}
                      </div>
                      <div className="flex flex-2 items-center space-x-3 self-end mb-[10px]">
                        <label
                          htmlFor={`variants.${variantIndex}.discount.state`}
                          className="relative inline-flex cursor-pointer items-center"
                        >
                          <input
                            {...register(
                              `variants.${variantIndex}.discount.state`
                            )}
                            onChange={(e) => {
                              setDiscount({
                                state: e.target.checked,
                                percent: discount.percent,
                              });
                            }}
                            type="checkbox"
                            id={`variants.${variantIndex}.discount.state`}
                            className="peer sr-only h-8 text-sm"
                          />
                          <div className="h-6 w-11 rounded-full bg-gray-100 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] hover:bg-gray-200 peer-checked:bg-rose-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-200 peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:after:bg-gray-50"></div>
                        </label>
                        <span className="w-fit block text-sm font-bold text-gray-700">
                          Наявність знижки
                        </span>
                      </div>
                      <div className="flex-1">
                        <label
                          htmlFor="price"
                          className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${
                            errors.variants &&
                            (errors.variants.at?.(variantIndex) as any)
                              ?.discount?.percent
                              ? 'after:ml-0.5 after:text-red-500 after:content-["*"]'
                              : null
                          }`}
                        >
                          Відсоток знижки
                        </label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5">
                            %
                          </div>
                          <input
                            min={0}
                            max={100}
                            type="number"
                            defaultValue={discount.percent}
                            className={`block w-full h-8 text-sm rounded-md shadow-sm pl-8 ${
                              errors.variants &&
                              (errors.variants.at?.(variantIndex) as any)
                                ?.discount?.percent
                                ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200"
                                : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"
                            }  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                            {...register(
                              `variants.${variantIndex}.discount.percent`,
                              {
                                min: {
                                  value: 0,
                                  message: "Мінімальний відсоток знижки 0,",
                                },
                                required: {
                                  value: true,
                                  message: "Поле обов`язкове для заповнення",
                                },
                              }
                            )}
                          />
                        </div>
                        {errors.variants &&
                        (errors.variants.at?.(variantIndex) as any)?.discount
                          ?.percent ? (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.variants &&
                              (errors.variants.at?.(variantIndex) as any)
                                ?.discount?.percent.message}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {fields.length > 1 ? (
                    <span
                      className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700 h-fit"
                      title="Видалити"
                      onClick={() => remove(variantIndex)}
                    >
                      <TrashIcon className="w-6 h-6 text-white" />
                    </span>
                  ) : null}
                </div>

                <NestedFieldArray
                  nestIndex={variantIndex}
                  control={control}
                  register={register}
                  errors={errors}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-x-4 w-max mt-4">
          <Button
            type="submit"
            variant="primary"
            content={isLoading ? <Loader /> : "Зберегти"}
            isLoading={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default Page;
