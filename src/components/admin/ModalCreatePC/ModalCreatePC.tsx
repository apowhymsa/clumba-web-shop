import {EnvelopeIcon, KeyIcon, XMarkIcon} from "@heroicons/react/24/outline";
import InputField from "@/components/UI/InputField/InputField";
import React, {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import useToast from "@/hooks/useToast";
import {AuthContext} from "@/contexts/AuthContext/AuthContext";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import Button from "@/components/UI/Button/Button";
import {IFormValues} from "@/components/ModalSignUp/ModalSignIn";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import {useQueryClient} from "@tanstack/react-query";
import {useProductCategoriesStore} from "@/utils/zustand-store/productCategories";

type FormValues = {
    categoryName: string;
    image: any | string;
}

type Props = {
    onClose: () => void;
    isOpen: boolean;
}

const ModalCreatePC = (props: Props) => {
    const {addProductCategory} = useProductCategoriesStore();
    const {onClose, isOpen} = props;
    const {error, info} = useToast();
    const [prodImage, setProdImage] = useState('');
    const queryClient = useQueryClient()

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'visible';
        }
    }, []);

    const {
        register, handleSubmit, formState: {errors},
    } = useForm<FormValues>();

    const createProductCategory = async (data: FormValues) => {
        console.log(data);
        const requestBody = {
            title: data.categoryName,
            image: data.image[0]
        };

        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
            },
            withCredentials: true
        }

        try {
            const response = await axios.put(`${process.env.ADMIN_ENDPOINT_BACKEND}/productCategory`, requestBody, requestConfig);

            addProductCategory(response.data);

            info('Категорія товарів була створена');
            onClose();
        } catch (err: unknown) {
            const errorObject = err as AxiosError;

            switch (errorObject.response?.status) {
                case 409: {
                    error('Вже існує категорія товарів з такою назвою');
                    break;
                }
                default: error(`${errorObject.message} - ${errorObject.name}`)
            }
        }
    }

    const toBase64 = (file: File) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    return (
        <>
            <div className="flex items-center justify-between px-6 py-3 border-b">
                <div className="font-bold text-lg">Створення категорії товарів</div>
                <div
                    className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-6 w-6 text-black"/>
                </div>
            </div>
            <div className="px-6 py-4">
                <form
                    encType="multipart/form-data"
                    className="default-section flex flex-col gap-y-5"
                    onSubmit={handleSubmit(createProductCategory)}
                >
                    <div>
                        <label
                            htmlFor="categoryName"
                            className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.categoryName ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                        >
                            Назва категорії товарів
                        </label>
                        <div className="relative">
                            <input
                                className={`block w-full text-sm h-8 rounded-md shadow-sm pl-4 ${errors.categoryName ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                {...register("categoryName", {
                                    required: {
                                        value: true, message: "Поле обов'язкове для заповнення",
                                    }
                                })}
                            />
                        </div>
                        {errors.categoryName ? (
                            <p className="mt-1 text-sm text-red-500">{errors.categoryName.message}</p>) : null}
                    </div>
                    <div className="">
                        <label htmlFor="image"
                               className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.image ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}>Зображення
                            інгредієнту</label>
                        <div className="flex gap-x-4">

                            {prodImage ? (<div className="flex h-[200px] w-full">
                                <img src={prodImage} alt="Image" className="object-cover border-0 outline-0 rounded"/>
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
                                <input accept=".png, .jpg, .jpeg" id="image" type="file" className="sr-only" {...register("image", {
                                    required: {
                                        value: true, message: "Зображення обов'язкове для завантаження",
                                    }
                                })} onChange={async (e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const base64: any = await toBase64(e.target.files[0]);
                                        setProdImage(base64);
                                    }
                                }}/>
                            </label>
                        </div>
                        {errors.image ? (<p className="mt-1 text-sm text-red-500">{(errors.image as any).message}</p>) : null}
                    </div>
                    <Button type='submit' variant='primary' content='Створити' isLoading={false}/>
                </form>
            </div>
        </>
    )
}

export default ModalCreatePC;