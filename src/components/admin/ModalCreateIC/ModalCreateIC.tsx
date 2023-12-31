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
import {useIngredientCategoriesStore} from "@/utils/zustand-store/ingredientCategories";

type FormValues = {
    categoryName: string;
}

type Props = {
    onClose: () => void;
    isOpen: boolean;
}

const ModalCreateIC = (props: Props) => {
    const {addIngredientCategory, ingredientCategories} = useIngredientCategoriesStore();
    const {onClose, isOpen} = props;
    const {error, info} = useToast();
    const queryClient = useQueryClient()

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'visible';
        }
    }, []);

    const {
        register, handleSubmit, formState: {errors},
    } = useForm<FormValues>();

    useEffect(() => {
        console.log('ingredientCategories', ingredientCategories);
    }, [ingredientCategories]);

    const createIngredientCategory = async (data: FormValues) => {
        const requestBody = {
            title: data.categoryName
        }

        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }

        try {
            const response = await axios.put(`${process.env.ADMIN_ENDPOINT_BACKEND}/ingredientCategory`, requestBody, requestConfig);
            // await queryClient.invalidateQueries({queryKey: ['ingredientCategories']});
            addIngredientCategory(response.data);

            info('Категорія інгредієнтів була створена');
            onClose();
        } catch (err: unknown) {
            const errorObject = err as AxiosError;

            switch (errorObject.response?.status) {
                case 409: {
                    error('Вже існує категорія інгредієнтів з такою назвою');
                    break;
                }
                default: error(`${errorObject.message} - ${errorObject.name}`)
            }
        }
    }

    return (<ModalContainer onClose={onClose} isOpen={isOpen} headerContent="Створення категорії інгредієнтів">
                <form
                    className="default-section flex flex-col gap-y-5 px-6 py-4"
                    onSubmit={handleSubmit(createIngredientCategory)}
                >
                    <div className="text-[14px]">
                        <label
                            htmlFor="categoryName"
                            className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.categoryName ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                        >
                            Назва категорії інгредієнтів
                        </label>
                        <div className="relative">
                            <input
                                className={`block w-full h-8 rounded-md shadow-sm pl-4 ${errors.categoryName ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
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

                    <Button type='submit' variant='primary' content='Створити' isLoading={false}/>
                </form>
        </ModalContainer>)
}

export default ModalCreateIC;