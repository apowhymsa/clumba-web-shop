import Button from "@/components/UI/Button/Button";
import ModalContainer from "@/components/admin/ModalContainer/ModalContainer";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import useToast from "@/hooks/useToast";
import Loader from "@/components/Loader/Loader";
import {XMarkIcon} from "@heroicons/react/24/outline";

type Props = {
    onClose: () => void; isOpen: boolean;
}

const ModalDeliveryPrice = (props: Props) => {
    const [isLoading, setLoading] = useState(true);
    const {onClose, isOpen} = props;
    const [deliveryPrice, setDeliveryPrice] = useState<any>();
    const {info, error} = useToast();
    const {
        register, handleSubmit, formState: {errors},
    } = useForm<{ id: string, price: string }>();

    useEffect(() => {
        const getDeliveryPrice = () => {
            setLoading(true)
            fetch(`${process.env.ADMIN_ENDPOINT_BACKEND}/deliveryPrice`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Access-Control-Allow-Origin': '*',
                    credentials: 'include'
                }, cache: 'no-store'
            }).then((response) => response.json())
                .then(data => {
                    setDeliveryPrice({
                        id: data[0]._id, price: data[0].price
                    })
                })
                .catch(err => console.log(err))
        }

        Promise.all([getDeliveryPrice()]).finally(() => setLoading(false))
        return () => {
            document.body.style.overflow = 'visible';
        }
    }, []);

    useEffect(() => {
        console.log('deliveryPrice', deliveryPrice)
    }, [deliveryPrice]);

    const handlerChangeDeliveryPrice = async (data: { id: string, price: string }) => {
        const requestBody = {
            id: deliveryPrice.id, price: data.price
        }

        console.log(requestBody);

        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
            }, withCredentials: true
        }

        try {
            const response = await axios.post(`${process.env.ADMIN_ENDPOINT_BACKEND}/deliveryPrice`, requestBody, requestConfig);
            // await queryClient.invalidateQueries({queryKey: ['ingredientCategories']});

            info('Ціна доставки була оновлена');
            onClose();
        } catch (err: unknown) {
            const errorObject = err as AxiosError;

            switch (errorObject.response?.status) {
                case 403: {
                    error('Неотримано необхідних даних для редагування ціни доставки, оновіть сторінку та спробуйте ще');
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

    return (<>
            <div className="flex items-center justify-between px-6 py-3 border-b">
                <div className="font-bold text-lg">Оновлення ціни доставки</div>
                <div
                    className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-6 w-6 text-black"/>
                </div>
            </div>
            <div className="px-6 py-4">
                <form
                    className="default-section flex flex-col gap-y-5"
                    onSubmit={handleSubmit(handlerChangeDeliveryPrice)}
                >
                    <div className="text-[14px]">
                        <label
                            htmlFor="categoryName"
                            className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.price ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                        >
                            Ціна доставки
                        </label>
                        <div className="relative">
                            <input
                                defaultValue={deliveryPrice?.price}
                                type="number"
                                className={`block w-full h-8 rounded-md shadow-sm pl-4 ${errors.price ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                {...register("price", {
                                    required: {
                                        value: true, message: "Поле обов'язкове для заповнення",
                                    }
                                })}
                            />
                        </div>
                        {errors.price ? (<p className="mt-1 text-sm text-red-500">{errors.price.message}</p>) : null}
                    </div>

                    <Button type='submit' variant='primary' content='Редагувати' isLoading={false}/>
                </form>
            </div>
        </>)
}

export default ModalDeliveryPrice;