import {
    KeyIcon, PhoneIcon, UserIcon, XMarkIcon,
} from "@heroicons/react/24/outline";
import {UserFields} from "@/components/ModalSignUp/ModalAuth";
import React, {Dispatch, SetStateAction, useContext, useState} from "react";
import InputField from "@/components/UI/InputField/InputField";
import {useForm} from "react-hook-form";
import useToast from "@/hooks/useToast";
import axios, {AxiosError, AxiosRequestConfig} from "axios";
import {OpenDispatch} from "@/contexts/ModalContext/ModalContext";
import Button from "@/components/UI/Button/Button";

type Props = {
    onClose: () => void;
    userFields: UserFields | undefined;
    setUserFields: Dispatch<SetStateAction<UserFields | undefined>>;
    setStep: Dispatch<SetStateAction<OpenDispatch>>;
};

export interface IFormValues {
    name: string;
    phone: string;
    password: string;
    email?: string;
}

const ModalSignUpStep2 = (props: Props) => {
    const {info, error} = useToast();
    const [isLoading, setLoading] = useState(false);
    const {onClose, setStep, userFields, setUserFields} = props;
    const {
        register, handleSubmit, formState: {errors},
    } = useForm<IFormValues>();

    const onClickRegisterFinishHandler = async (data: IFormValues, event: React.BaseSyntheticEvent<object, any, any> | undefined,) => {
        setLoading(true);

        const requestBody = {
            email: userFields?.email,
            password: userFields?.password,
            fullName: userFields?.name,
            phoneNumber: userFields?.phone,
            avatar: 'https://i.pravatar.cc/300'
        }

        const requestConfig: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true',
                'Access-Control-Allow-Origin': '*'
            }, withCredentials: true
        }

        try {
            const response = await axios.post(`${process.env.ADMIN_ENDPOINT_BACKEND}/auth/register`, requestBody, requestConfig);

            setStep({isOpen: true, step: 3});
            setUserFields({...userFields, phone: '', name: '', password: '', profilePhoto: ''});
            info('Обліковий запис було успішно створено, виконайне вхід для продовження');
        } catch (err: unknown) {
            const errObject = err as AxiosError;

            switch (errObject.response?.status) {
                case 400: {
                    error('Введіть дані для створення облікового запису та повторіть спробу ще раз');
                    break;
                }
                case 409: {
                    error('Обліковий запис з вказаним номером телефону вже існує');
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
    };

    return (<>
            <div className="flex items-center justify-between px-6 py-3 border-b">
                <div className="font-bold text-lg">Створення облікового запису</div>
                <div
                    className="btn-close-modal flex cursor-pointer transition-transform hover:rotate-180 items-center justify-center"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-6 w-6 text-black"/>
                </div>
            </div>
            <div className="px-6 py-4">
                <form
                    className="modal-container flex flex-col gap-y-5"
                    onSubmit={handleSubmit(onClickRegisterFinishHandler)}
                >
                    <InputField
                        labelText="Ім'я та прізвище"
                        leftIcon={<UserIcon className="h-5 w-5 text-gray-500" />}
                        placeholder="Приклад: Дмитро Флоренко"
                        id="name"
                        name="name"
                        type="text"
                        defaultValue={userFields?.name || ""}
                        onChangeCapture={(e) => {
                            setUserFields({
                                ...userFields,
                                name: (e.target as HTMLInputElement).value,
                            });
                        }}
                        register={register}
                        options={{
                            required: {
                                value: true,
                                message: "Поле обов'язкове для заповнення",
                            },
                            minLength: {
                                value: 6,
                                message: "Поле повинно мати більше ніж 5 символів",
                            },
                        }}
                        error={errors.name}
                    />
                    <InputField
                        labelText="Номер телефону"
                        leftIcon={<PhoneIcon className="h-5 w-5 text-gray-500" />}
                        placeholder="Приклад: +380..."
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={userFields?.phone || ""}
                        onChangeCapture={(e) => {
                            setUserFields({
                                ...userFields,
                                phone: (e.target as HTMLInputElement).value,
                            });
                        }}
                        register={register}
                        options={{
                            required: {
                                value: true,
                                message: "Поле обов'язкове для заповнення",
                            },
                            pattern: {
                                value: /^\+380\d{9}/,
                                message: 'Введіть коректний номер телефону, приклад: +380680000000'
                            }
                        }}
                        error={errors.phone}
                    />
                    <InputField
                        labelText="Пароль"
                        leftIcon={<KeyIcon className="h-5 w-5 text-gray-500" />}
                        placeholder="Пароль"
                        id="password"
                        name="password"
                        type="password"
                        defaultValue={userFields?.password || ""}
                        onChangeCapture={(e) => {
                            setUserFields({
                                ...userFields,
                                password: (e.target as HTMLInputElement).value,
                            });
                        }}
                        register={register}
                        options={{
                            required: {
                                value: true,
                                message: "Поле обов'язкове для заповнення",
                            },
                            minLength: {
                                value: 6,
                                message: "Поле повинно мати більше ніж 5 символів",
                            },
                        }}
                        error={errors.password}
                    />
                    <Button type='submit' variant='primary' content='Створити обіковий запис' isLoading={isLoading}/>
                </form>
            </div>
        </>);
};

export default ModalSignUpStep2;
