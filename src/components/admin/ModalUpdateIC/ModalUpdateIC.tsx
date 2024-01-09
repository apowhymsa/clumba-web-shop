import useToast from "@/hooks/useToast";
import {useQueryClient} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import Button from "@/components/UI/Button/Button";
import React, {useEffect, useState} from "react";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {useIngredientCategoriesStore} from "@/utils/zustand-store/ingredientCategories";
import Loader from "@/components/Loader/Loader";

type FormValues = {
    categoryName: string;
}

type Props = {
    onClose: () => void; isOpen: boolean; id: string;
}
const ModalUpdateIC = (props: Props) => {
    const {updateIngredientCategory: updateIC} = useIngredientCategoriesStore();
    const {onClose, id, isOpen} = props;
    const {error, info} = useToast();
    const queryClient = useQueryClient()
    const [ingredientCategory, setIngredientCategory] = useState<{ _id: string, title: string } | null>(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        console.log(isOpen);

        if (isOpen) {
            const getIngredientCategory = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/ingredientCategory/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'Access-Control-Allow-Origin': '*'
                        }, withCredentials: true
                    });
                    setIngredientCategory({_id: response.data._id, title: response.data.title});
                    console.log(response.data)
                } catch (err: unknown) {
                    const errorObject = err as AxiosError;

                    switch (errorObject.response?.status) {
                        case 403: {
                            error('Не отриманно необхідних даних для оновлення запису, оновіть сторінку та повторіть спробу');
                            break;
                        }
                        default:
                            error(`${errorObject.message} - ${errorObject.name}`)
                    }
                } finally {
                    setLoading(false);
                }
            }

            Promise.all([getIngredientCategory()]);
        }

        return () => {

                    document.body.style.overflow = 'visible';
        }
    }, []);

    const {
        register, handleSubmit, formState: {errors},
    } = useForm<FormValues>();

    const updateIngredientCategory = async (data: FormValues) => {
        console.log(id, data);
        try {
            const requestBody = {
                title: data.categoryName
            }

            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Access-Control-Allow-Origin': '*'
                }, withCredentials: true
            }

            const response = await axios.put(`${process.env.ADMIN_ENDPOINT_BACKEND}/ingredientCategory/${id}`, requestBody, requestConfig);
            updateIC(id, response.data);
            info('Категорія інгредієнтів була оновлена');
            onClose();
        } catch (err: unknown) {
            const errorObject = err as AxiosError;

            switch (errorObject.response?.status) {
                case 403: {
                    error('Не отриманно необхідних даних для оновлення запису, оновіть сторінку та повторіть спробу');
                    break;
                }
                case 409: {
                    error('Категорія інгредієнтів з вказанною назвою вже існує');
                    break;
                }
                default:
                    error(`${errorObject.message} - ${errorObject.name}`)
            }
        }
    }

    return (<ModalContainer isOpen={isOpen} onClose={onClose} headerContent="Редагування категорії інгредієнтів">
        <form
            className="default-section flex flex-col gap-y-5 px-6 py-4"
            onSubmit={handleSubmit(updateIngredientCategory)}
        >
            {isLoading || !ingredientCategory ? (<Loader/>) : (<>
                    <div>
                        <label
                            htmlFor="categoryName"
                            className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.categoryName ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                        >
                            Назва категорії інгредієнтів
                        </label>
                        <div className="relative">
                            <input
                                className={`block w-full h-8 rounded-md text-[14px] shadow-sm pl-4 ${errors.categoryName ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                {...register("categoryName", {
                                    required: {
                                        value: true, message: "Поле обов'язкове для заповнення",
                                    }
                                })}
                                value={ingredientCategory.title}
                                onChange={(e) => setIngredientCategory({_id: id, title: e.target.value})}
                            />
                        </div>
                        {errors.categoryName ? (
                            <p className="mt-1 text-sm text-red-500">{errors.categoryName.message}</p>) : null}
                    </div>

                    <Button type='submit' variant='primary' content='Оновити' isLoading={false}/>
                </>)}
        </form>
    </ModalContainer>)
}

export default ModalUpdateIC;