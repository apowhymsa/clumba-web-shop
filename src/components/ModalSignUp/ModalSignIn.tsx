import {
    EnvelopeIcon, KeyIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import React, {Dispatch, FC, PropsWithChildren, SetStateAction, useContext, useEffect, useState} from "react";
import InputField from "@/components/UI/InputField/InputField";
import {useForm} from "react-hook-form";
import useToast from "@/hooks/useToast";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import Button from "@/components/UI/Button/Button";
import {AuthContext} from "@/contexts/AuthContext/AuthContext";
import {OpenDispatch} from "@/contexts/ModalContext/ModalContext";
import Loader from "@/components/Loader/Loader";
import {UserFields} from "@/components/ModalSignUp/ModalAuth";

type Props = {
    onClose: () => void; setStep: Dispatch<SetStateAction<OpenDispatch>>;
    userFields: UserFields | undefined
};

export interface IFormValues {
    email: string;
    password: string;
}

const ModalSignIn: FC<Props> = (props) => {
    const {error, info} = useToast();
    const {isLogged, setLogged} = useContext(AuthContext);
    const {onClose, setStep, userFields} = props;
    const {
        register, handleSubmit, formState: {errors, isSubmitting},
    } = useForm<IFormValues>({
        defaultValues: {
            email: userFields?.email || ''
        }
    });

    useEffect(() => {
        console.log('mounted');
        return () => {
            console.log('unmounded');
        };
    }, []);

    const onClickLoginHandler = async (data: IFormValues) => {
        const requestBody = {
            email: data.email, password: data.password
        }

        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
            }, withCredentials: true
        }

        try {
            const response = await axios.post(`${process.env.ADMIN_ENDPOINT_BACKEND}/auth/login`, requestBody, requestConfig);
            localStorage.setItem('authUserId', response.data._id);
            setLogged(true);
            info('Успішний вхід у обліковий запис');
            onClose();
        } catch (err: unknown) {
            const errObject = err as AxiosError;

            switch (errObject.response?.status) {
                case 400: {
                    error('Введіть дані для входу та повторіть спробу ще раз');
                    break;
                }
                case 404: {
                    error('Користувача з вказаною електронною адресою не знайдено');
                    break;
                }
                case 401: {
                    error('Невірний пароль від облікового запису');
                    break;
                }
                default: {
                    error('Введіть дані для входу та повторіть спробу ще раз');
                    break;
                }
            }
        }
    };

    return (<>
        <div className="flex items-center justify-between px-6 py-3 border-b">
            <div className="font-bold text-lg">Вхід в обліковий запис</div>
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
                    onSubmit={handleSubmit(onClickLoginHandler)}
                >
                    <InputField
                        labelText="Електронна пошта"
                        leftIcon={<EnvelopeIcon className="h-5 w-5 text-gray-500"/>}
                        placeholder="Приклад: your@email.com"
                        id="email"
                        name="email"
                        type="email"
                        register={register}
                        options={{
                            required: {
                                value: true, message: "Поле обов'язкове для заповнення",
                            }, minLength: {
                                value: 6, message: "Поле повинно мати більше ніж 5 символів",
                            },
                        }}
                        error={errors.email}
                    />
                    <InputField
                        labelText="Пароль"
                        leftIcon={<KeyIcon className="h-5 w-5 text-gray-500"/>}
                        placeholder="Пароль"
                        id="password"
                        name="password"
                        type="password"
                        register={register}
                        options={{
                            required: {
                                value: true, message: "Поле обов'язкове для заповнення",
                            }, minLength: {
                                value: 6, message: "Поле повинно мати більше ніж 5 символів",
                            },
                        }}
                        error={errors.password}
                    />

                    <Button type='submit' variant='primary'
                            content={isSubmitting ? <Loader variant="secondary"/> : 'Увійти'}
                            isLoading={isSubmitting}/>
                </form>
                <span className="flex justify-end items-center gap-x-1 mt-2">
                <span>Немає облікового запису?</span>
                <span
                    className="underline text-blue-400 cursor-pointer"
                    onClick={() => setStep({isOpen: true, step: 1})}
                >
                    Створити
                </span>
            </span>
            </div>
        </>);
};


export default ModalSignIn;
