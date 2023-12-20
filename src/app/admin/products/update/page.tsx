'use client';

import {Controller, useFieldArray, useForm} from "react-hook-form";
import Select from "react-select";
import {toBase64} from "@/utils/toBase64";
import Button from "@/components/UI/Button/Button";
import {TrashIcon} from "@heroicons/react/24/outline";
import NestedFieldArray from "@/app/admin/products/create/NestedFieldArray";
import React, {BaseSyntheticEvent, useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import axios, {AxiosError} from "axios";
import useToast from "@/hooks/useToast";
import {AxiosRequestConfig} from "axios";
import NestedFieldArrayUpdate from "@/app/admin/products/update/NestedFieldArrayUpdate";
import {useProductsStore} from "@/utils/zustand-store/products";
import {router} from "next/client";
import Loader from "@/components/Loader/Loader";

interface IIngredient {
    id: string;
    variantID: string;
}

interface IVariant {
    title: string;
    price: string;
    discount: {
        state: boolean, percent: string
    };
    ingredients: Array<{
        ingredient: IIngredient; count: string;
    }>;
}

interface FormValues {
    image: any;
    title: string;
    categoryID: string;
    price: string;
    variants: IVariant[];
}

const Page = () => {
    const searchParams = useSearchParams();
    const {updateProduct: updateP} = useProductsStore();
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setLoading] = useState(true);
    const [isCategoriesLoading, setCategoriesLoading] = useState(true);
    const [prodImage, setProdImage] = useState<any>(null);
    const [pc, setPc] = useState<any[]>([]);
    const router = useRouter();
    const {error, info} = useToast();
    const {
        control, setValue, register, handleSubmit, formState, reset, formState: {errors},
    } = useForm<FormValues>({
        // defaultValues: {
        //     title: '', variants: [{
        //         discount:  {
        //             state: false,
        //             percent: '0'
        //         },
        //         title: '', ingredients: [{
        //             ingredient: {
        //                 id: '', variantID: ''
        //             }
        //         }]
        //     }]
        // }
    });
    const {update, fields, append, remove} = useFieldArray({
        control, name: "variants"
    });

    useEffect(() => {
        async function getProduct() {
            setLoading(true);
            const id = searchParams.get('id');

            if (id) {
               try {
                   const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/product/${id}`);

                   console.log(response.data);

                   response.data.variants.forEach((variant: any) => {
                       append({
                           price: variant.price,
                           discount: variant.discount,
                           title: variant.title,
                           ingredients: variant.ingredients
                       });
                   });
                   setProduct(response.data);
                   setProdImage({
                       url: `${process.env.ADMIN_ENDPOINT_BACKEND}/images/${response.data.image}`,
                       fileName: response.data.image,
                       isNew: false,
                       base64: ''
                   })
               } catch (err: any) {
                   error(`${err.message} - ${err.code}`);
               } finally {
                   setLoading(false);
               }
            }
        }

        async function getProductCategories() {
            setCategoriesLoading(true);
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            }
            const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/productCategories`, requestConfig);
            response.data.forEach((category: any) => {
                setPc((currentState) => [...currentState, {
                    value: category._id, label: category.title
                }])
            })

            setCategoriesLoading(false);
        }

        Promise.all([getProduct(), getProductCategories()]);
    }, []);

    const toImage = (base64: string) => {
        const cleanedBase64String = base64.replace(/\s/g, '');

        const normalBase64 = cleanedBase64String.split(',')[1];

        const arrayBuffer = Uint8Array.from(atob(normalBase64), (c) => c.charCodeAt(0)).buffer;
        const blob = new Blob([arrayBuffer]);
        const fileType = (product?.image.name as string).endsWith('.png') ? 'image/png' : 'image/jpeg';

        return new File([blob], product?.image.name, {type: fileType});
    }

    async function updateProduct(data: FormValues, event: BaseSyntheticEvent<object, any, any> | undefined) {
        const img = data.image.length === 0 ? prodImage.fileName : data.image[0]
        const category = typeof data.categoryID === 'string' ? JSON.parse(data.categoryID).value : (data.categoryID as any).value;

        // const requestBody = {
        //     title: data.title, categoryID: (data.categoryID as any).value, variants: data.variants, image: image[0]
        // }

        const normalizeIngredients = data.variants.map((variant: IVariant) => {
            return {title: variant.title, price: variant.price, discount: variant.discount, ingredients: variant.ingredients.map(ingredient => {
                    return {
                        count: ingredient.count,
                        ingredient: {
                            id: (ingredient.ingredient.id as any).hasOwnProperty('_id') ? (ingredient.ingredient.id as any)._id : (ingredient.ingredient.id as any).value,
                            variantID: (ingredient.ingredient.variantID as any).hasOwnProperty('_id') ? (ingredient.ingredient.variantID as any)._id : (ingredient.ingredient.variantID as any).value
                        }
                    }
                })}
        })

        const requestBody = {
            image: img,
            title: data.title,
            categoryID: category,
            variants: normalizeIngredients,
            isNewImage: data.image.length !== 0
        }

        console.log(requestBody);

        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': requestBody.isNewImage ? 'multipart/form-data' : 'application/json',
            }, withCredentials: true
        }

        try {
            const response = await axios.put(`${process.env.ADMIN_ENDPOINT_BACKEND}/product/${searchParams.get('id')}`, requestBody, requestConfig);
            updateP(response.data._id, response.data);
            router.back();

            info('Запис було успішно оновлено');
            // reset();

            // fields.slice(0, 0);
            // setIngImage('');
            // append({vType: '', count: ''});

        } catch (err: unknown) {
            const errorObject = err as AxiosError;

            switch (errorObject.response?.status) {
                case 403: {
                    error('Не отриманно необхідних даних для оновлення запису, оновіть сторінку та повторіть спробу');
                    break;
                }
                case 409: {
                    error('Товар з вказаною назвою вже існує');
                    break;
                }
                default:
                    error(`${errorObject.message} - ${errorObject.name}`)
            }
        }
    }

    if (isLoading) {
        return <Loader/>
    }

    return <div className="p-10">
        <h2 className="text-[16px] font-semibold text-center">Редагування товару</h2>
        <form onSubmit={handleSubmit(updateProduct)} encType="multipart/form-data">
            <div className="flex flex-col gap-y-2">
                <div>
                    <label
                        htmlFor="title"
                        className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.title ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                    >
                        Назва товару
                    </label>
                    <div className="relative">
                        <input
                            defaultValue={product.title}
                            className={`block w-full h-8 text-sm rounded-md shadow-sm pl-4 ${errors.title ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                            {...register("title", {
                                required: {
                                    value: true, message: "Поле обов'язкове для заповнення",
                                }
                            })}
                        />
                    </div>
                    {errors.title ? (<p className="mt-1 text-sm text-red-500">{errors.title.message}</p>) : null}
                </div>
                <div>
                    <label
                        htmlFor="categoryID"
                        className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.categoryID ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                    >
                        Категорія
                    </label>
                    <div className="relative">
                        <Controller defaultValue={JSON.stringify({label: product.categoryID.title, value: product.categoryID._id})} render={({field}) => (<Select
                            defaultValue={{label: product.categoryID.title, value: product.categoryID._id}}
                            isDisabled={isCategoriesLoading}
                            ref={field.ref}
                            onChange={field.onChange}
                            isSearchable={false}
                            options={pc}
                            className={`block w-full text-sm rounded-md shadow-sm ${errors.categoryID ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                        />)} name="categoryID" control={control}
                                    rules={{
                                        required: {
                                            value: true, message: "Поле обов'язкове для заповнення"
                                        }
                                    }}
                        />
                    </div>
                    {errors.categoryID ? (
                        <p className="mt-1 text-sm text-red-500">{errors.categoryID.message}</p>) : null}
                </div>
                <div className="">
                    <label htmlFor="image"
                           className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.image ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}>Зображення
                        товару</label>
                    <div className="flex gap-x-4">

                        {prodImage ? (<div className="flex h-[200px]">
                            <img src={prodImage.isNew ? prodImage.base64 : prodImage.url} alt="Image" className="object-cover border-0 outline-0 rounded"/>
                        </div>) : null}

                        <label
                            className="overflow-hidden flex w-full h-[200px] cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-200 p-6 transition-all hover:border-blue-400">
                            <div className="relative space-y-1 text-center z-10">
                                <div
                                    className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-500">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"/>
                                    </svg>
                                </div>
                                {/*<div className="text-gray-600">Натисніть для завантаження</div>*/}
                                <p className="text-sm text-gray-500">PNG or JPG</p>
                            </div>
                            <input accept=".png, .jpg, .jpeg" id="image" type="file" className="sr-only" {...register("image")} onChange={async (e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    const base64: any = await toBase64(e.target.files[0]);
                                    setProdImage({
                                        url: '',
                                        fileName: '',
                                        isNew: true,
                                        base64: base64
                                    })
                                }
                            }}/>
                        </label>
                    </div>
                    {errors.image ? (<p className="mt-1 text-sm text-red-500">{(errors.image as any).message}</p>) : null}
                </div>
                <div>
                    <div className="flex justify-between items-center my-4">
                        <span className="flex-1 text-[15px]">Варіанти товару</span>
                        <div className="w-fit">
                            <Button type="button" variant="primary" content="Додати ще один варіант"
                                    onClick={() => append({
                                        price: '',
                                        discount: {
                                            state: false,
                                            percent: '0'
                                        },
                                        title: '', ingredients: [{

                                            ingredient: {
                                                id: '', variantID: ''
                                            }, count: ''
                                        }]
                                    })}
                            />
                        </div>
                    </div>
                    {fields.map((variant, variantIndex) => (<div key={variant.id}>
                        <div className="flex gap-x-4">
                            <div className="flex flex-col flex-1 gap-y-2">
                                <div className="flex-1">
                                    <label
                                        htmlFor={`variants.${variantIndex}.title`}
                                        className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.variants ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                                    >
                                        Назва варіанту товару
                                    </label>
                                    <div className="relative">
                                        <input
                                            className={`block w-full h-8 text-sm rounded-md shadow-sm pl-4 ${errors.title ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                            {...register(`variants.${variantIndex}.title`, {
                                                required: {
                                                    value: true, message: "Поле обов'язкове для заповнення",
                                                }
                                            })} defaultValue={variant.title}
                                        />
                                    </div>
                                    {errors.variants ? (
                                        <p className="mt-1 text-sm text-red-500">{errors.variants.message}</p>) : null}
                                </div>
                                <div className="flex gap-x-4 items-center">
                                    <div className="flex-1">
                                        <label
                                            htmlFor={`variants.${variantIndex}.price`}
                                            className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.price ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                                        >
                                            Ціна товару
                                        </label>
                                        <div className="relative">
                                            <div
                                                className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5">&#8372;</div>
                                            <input
                                                min={1}
                                                type="number"
                                                defaultValue={variant.price}
                                                className={`block w-full h-8 text-sm rounded-md shadow-sm pl-8 ${errors.price ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                                {...register(`variants.${variantIndex}.price`, {
                                                    required: {
                                                        value: true, message: "Поле обов'язкове для заповнення",
                                                    }, min: {
                                                        value: 1, message: 'Ціна товару повинна бути вища за 0'
                                                    }
                                                })}
                                            />
                                        </div>
                                        {errors.price ? (<p className="mt-1 text-sm text-red-500">{errors.price.message}</p>) : null}
                                    </div>
                                    <div className="flex flex-2 items-center space-x-3 self-end mb-[10px]">
                                        <label htmlFor={`variants.${variantIndex}.discount.state`} className="relative inline-flex cursor-pointer items-center">
                                            <input defaultChecked={variant.discount.state} {...register(`variants.${variantIndex}.discount.state`)}
                                                   type="checkbox" id={`variants.${variantIndex}.discount.state`} className="peer sr-only h-8 text-sm"/>
                                            <div
                                                className="h-6 w-11 rounded-full bg-gray-100 after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] hover:bg-gray-200 peer-checked:bg-rose-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-blue-200 peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:after:bg-gray-50"></div>
                                        </label>
                                        <span className="w-fit block text-sm font-bold text-gray-700">Наявність знижки</span>
                                    </div>
                                    <div className="flex-1">
                                        <label
                                            htmlFor="price"
                                            className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.price ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                                        >
                                            Відсоток знижки
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5">%
                                            </div>
                                            <input
                                                min={0}
                                                max={100}
                                                type="number"
                                                defaultValue={variant.discount.percent}
                                                className={`block w-full h-8 text-sm rounded-md shadow-sm pl-8 ${errors.variants ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                                {...register(`variants.${variantIndex}.discount.percent`)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {fields.length > 1 ? (<span
                                className="bg-red-600 cursor-pointer p-1 rounded transition-colors hover:bg-red-700 h-fit"
                                title="Видалити"
                                onClick={() => remove(variantIndex)}>
                                        <TrashIcon className="w-6 h-6 text-white"/>
                                    </span>) : null}
                        </div>


                        <NestedFieldArrayUpdate defaultIngredients={variant.ingredients} nestIndex={variantIndex} control={control} register={register} errors={errors}/>
                    </div>))}
                </div>
            </div>
            <div className="flex gap-x-4 w-max mt-4">
                <Button type="submit" variant="primary" content="Оновити запис"/>
            </div>
        </form>
    </div>
}

export default Page;