import {useForm} from "react-hook-form";
import React, {useEffect, useState} from "react";
import Button from "@/components/UI/Button/Button";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import Loader from "@/components/Loader/Loader";
import useToast from "@/hooks/useToast";

type UserFields = {
    email: string;
    fullName: string;
    phoneNumber: string;
    password: {
        current: string;
        new: string;
    }
}

const UserInfo = () => {
    const {error, info} = useToast();
    const {register, setValue,  handleSubmit, formState: {errors}} = useForm<UserFields>();
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        const userID = localStorage.getItem('authUserId');

        if (userID) {
            const getUserInfo = async () => {
                setLoading(true);
                const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/user/${userID}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': 'true',
                        'Access-Control-Allow-Origin': '*'
                    }, withCredentials: true
                });

                setUser(response.data);

                setValue('email', response.data.email);
                setValue('fullName', response.data.personals.fullName);
                setValue('phoneNumber', response.data.personals.phoneNumber);
            }

            Promise.all([getUserInfo()]).finally(() => setLoading(false));
        }
    }, []);

    const submitHandler = async (data: UserFields, event: React.BaseSyntheticEvent<object, any, any> | undefined) => {
        const userID = localStorage.getItem('authUserId');

        const requestBody = {
            data: {
                ...data,
                isUpdateProfile: true
            }
        }

        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
            },
            withCredentials: true
        }

        if (userID) {
            try {
                const response = await axios.put(`${process.env.ADMIN_ENDPOINT_BACKEND}/user/${userID}`, requestBody, requestConfig);
                info('Обліковий запис оновлено');
                console.log(response.data);
            } catch (err: unknown) {
                const errObject = err as AxiosError;

                switch (errObject.response?.status) {
                    case 400: {
                        error('Введіть дані для створення облікового запису та повторіть спробу ще раз');
                        break;
                    }
                    case 401: {
                        error('Некоректний старий пароль');
                        break;
                    }
                    case 403: {
                        error('Не отримано необхідних даних для оновлення облікового запису, спробуйте ще раз');
                        break;
                    }
                    case 409: {
                        error('Обліковий запис з вказаними номером телефону або електронною поштую вже існує');
                        break;
                    }
                    default: {
                        error('Введіть дані для входу та повторіть спробу ще раз');
                        break;
                    }
                }
            } finally {
                setLoading(false);
            }
        }
    }

    if (isLoading) {
        return <Loader/>
    }

    return (
        <>
            {user ? <p className="py-4">На вашому рахунку є <span className="font-semibold">{user.promo.bonuses} бонусів</span>. Активне бонусне нарахування: <span className="font-semibold">{user.promo.bonusesPercent}%</span> від суми кожної покупки</p> : null}
            <form className="flex flex-col gap-y-2 mt-2" onSubmit={handleSubmit(submitHandler)}>
                <section className="flex justify-between gap-x-4">
                    <fieldset className="flex-1 flex flex-col gap-y-2">
                        <legend className="font-semibold mb-4">Контактна інформація</legend>
                        <div>
                            <label
                                htmlFor="email"
                                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.email ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                            >
                                Email адреса
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 ${errors.email ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                    {...register("email", {
                                        required: {
                                            value: true, message: "Поле обов'язкове для заповнення",
                                        }
                                    })}
                                />
                            </div>
                            {errors.email ? (<p className="mt-1 text-sm text-red-500">{errors.email.message}</p>) : null}
                        </div>
                        <div>
                            <label
                                htmlFor="fullName"
                                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.fullName ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                            >
                                Ім`я та прізвище
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 ${errors.fullName ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                    {...register("fullName", {
                                        required: {
                                            value: true, message: "Поле обов'язкове для заповнення",
                                        }
                                    })}
                                />
                            </div>
                            {errors.fullName ? (<p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>) : null}
                        </div>
                        <div>
                            <label
                                htmlFor="title"
                                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.fullName ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                            >
                                Номер телефону
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 ${errors.phoneNumber ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                    {...register("phoneNumber", {
                                        required: {
                                            value: true, message: "Поле обов'язкове для заповнення",
                                        },
                                        pattern: {
                                            value: /^\+380\d{9}/,
                                            message: 'Введіть коректний номер телефону, приклад: +380680000000'
                                        }
                                    })}
                                />
                            </div>
                            {errors.phoneNumber ? (<p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>) : null}
                        </div>
                    </fieldset>
                    <fieldset className="flex-1 flex flex-col gap-y-2">
                        <legend className="font-semibold mb-4">Інформація про аккаунт</legend>
                        <div>
                            <label
                                htmlFor="password.current"
                                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.password?.current ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                            >
                                Старий Пароль
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 ${errors.password?.current ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                    {...register("password.current", {
                                        required: false,
                                    })}
                                />
                            </div>
                            {errors.password?.current ? (<p className="mt-1 text-sm text-red-500">{errors.password.current.message}</p>) : null}
                        </div>
                        <div>
                            <label
                                htmlFor="password.new"
                                className={`w-fit mb-1 block text-sm font-bold text-gray-700 ${errors.password?.new ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : null}`}
                            >
                                Новий пароль
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className={`block w-full rounded-md text-sm h-8 shadow-sm pl-4 ${errors.password?.new ? "border-red-300 focus:border-red-300 focus:ring focus:ring-red-200" : "border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200"}  focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500`}
                                    {...register("password.new", {
                                        required: false,
                                    })}
                                />
                            </div>
                            {errors.password?.new ? (<p className="mt-1 text-sm text-red-500">{errors.password.new.message}</p>) : null}
                        </div>
                    </fieldset>
                </section>
                <section className="w-fit">
                    <Button type="submit" variant="primary" content="Зберегти"/>
                </section>
            </form>
        </>
    )
}

export default UserInfo;