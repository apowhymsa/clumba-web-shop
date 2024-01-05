'use client';

import {SyntheticEvent, useEffect, useState} from "react";
import axios from "axios";
import useToast from "@/hooks/useToast";
import {Autocomplete} from "@react-google-maps/api";
import CartItem from "@/components/Cart/CartItem/CartItem";
import {Order} from "@/utils/zustand-store/orders";
import {formatDate} from "@/utils/formatDate";
import Image from "next/image";
import clsx from "clsx";
import {AxiosRequestConfig} from "axios";
import Loader from "@/components/Loader/Loader";

const Page = ({params}: { params: { slug: string } }) => {
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setLoading] = useState(true);
    const [orderStatus, setOrderStatus] = useState(1);
    const {error, info} = useToast();

    useEffect(() => {
        const getOrder = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/order/${params.slug}`)
                setOrder(response.data);
                console.log('ORDER', response.data);

                const ids = response.data.products.map((product: any, index: number) => {
                    return {productID: product.product_id._id, variantID: product.productVariant.id };
                });

                const requestBody = {
                    ids: ids,
                }

                const requestConfig: AxiosRequestConfig = {
                    headers: {
                        'Content-Type': 'application/json',
                    }, withCredentials: true
                }

                const productsByIds = await axios.post(`${process.env.ADMIN_ENDPOINT_BACKEND}/product-variant-by-id`, requestBody, requestConfig)

                console.log(productsByIds.data);

                switch (response.data.status) {
                    case 'processing': {
                        setOrderStatus(1)
                        break;
                    }
                    case 'packing': {
                        setOrderStatus(2)
                        break;
                    }
                    case 'shipping': {
                        setOrderStatus(3)
                        break;
                    }
                    case 'waiting': {
                        setOrderStatus(4)
                        break;
                    }
                    case 'complete': {
                        setOrderStatus(5)
                        break;
                    }
                }
            } catch (err: unknown) {
                const errObject = err as any;
                console.log(error);
                error('Помилка отримання даних, спробуйте ще раз: ', errObject.message);
            }
        }

        Promise.all([getOrder()]).finally(() => setLoading(false));
    }, []);

    function handleChangeRadio(e: SyntheticEvent<HTMLInputElement>) {
        const target = e.target as HTMLInputElement;
        console.log(Number(target.value));
        setOrderStatus(Number(target.value))
    }

    async function handleChangeStatus() {
        try {
            const requestBody = {
                status: orderStatus === 1 ? 'processing' : orderStatus === 2 ? 'packing' : orderStatus === 3 ? 'shipping' : orderStatus === 4 ? 'waiting' : 'complete',
            }

            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                }, withCredentials: true
            }

            console.log(requestBody);

            const response = await axios.put(`${process.env.ADMIN_ENDPOINT_BACKEND}/order/${params.slug}`, requestBody, requestConfig)

            console.log(response.data);
            info(`Статус замовлення ${response.data.payment.liqpayPaymentID} оновлено на ${requestBody.status}`);
        } catch (err: unknown) {
            const errObject = err as any;
            console.log(error);
            error('Помилка отримання даних, спробуйте ще раз: ', errObject.message);
        }
    }

    if (isLoading) {
        return <Loader/>
    }
    return <div id="liqpay_checkout" className="shadow mx-6 my-6 p-5">
        {order ? (
            <><h2 className="text-[18px] font-bold border-b py-2">Замовлення №{order.payment.liqpayPaymentID}</h2>
                <div className="flex gap-x-14 justify-center pt-6">
                    <form className="flex-1 flex flex-col gap-y-5" onSubmit={(e) => {
                        e.preventDefault();
                        console.log(orderStatus);
                    }}>
                        <div className="flex flex-col gap-y-2">
                            <h3 className="font-bold text-[16px]">Інформація про клієнта</h3>
                            <div className="flex flex-col gap-y-2">
                                <p className="text-[15px] border-b border-rose-400 pb-1.5"><span className="font-semibold uppercase">Ім`я клієнта:</span> {order.userFullName}</p>
                                <p className="text-[15px] border-b border-rose-400 pb-1.5"><span className="font-semibold uppercase">Номер телефону клієнта:</span> {order.phoneNumber}</p>
                                <p className="text-[15px] border-b border-rose-400 pb-1.5"><span className="font-semibold uppercase">Адреса доставки:</span> {order.shippingAddress}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <h3 className="font-bold text-[16px]">Інформація про замовлення</h3>
                            <div className="flex flex-col gap-y-2">
                                <p className="text-[15px] border-b border-rose-400 pb-1.5"><span className="font-semibold uppercase">Статус оплати:</span> {order.payment.status === true ? <span className="text-green-600">Оплачено</span> : 'Не оплачено'}</p>
                                <p className="text-[15px] border-b border-rose-400 pb-1.5"><span className="font-semibold uppercase">Дата та час створення:</span> {formatDate(order.createdAt)}</p>
                                <p className="text-[15px] border-b border-rose-400 pb-1.5"><span className="font-semibold uppercase">Ціна замовлення:</span> {order.payment.amount}&#8372;</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <h3 className="font-bold text-[16px]">Зміна статусу замовлення</h3>
                            <div className="flex flex-col">
                                <div className={clsx("flex items-center space-x-2")}>
                                    <input onChange={handleChangeRadio} value="1" type="radio" id="processing" disabled={orderStatus > 1} checked={orderStatus === 1} name="orderStatus" className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                    <label htmlFor="processing" className={clsx("text-[15px] font-medium", orderStatus > 1 && "text-gray-400")}>Обробляється</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input onChange={handleChangeRadio} value="2" type="radio" id="packing" disabled={orderStatus > 2} checked={orderStatus === 2} name="orderStatus" className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                    <label htmlFor="packing" className={clsx("text-[15px] font-medium", orderStatus > 2 && "text-gray-400")}>Пакується</label>
                                </div>
                                {order.shippingAddress !== 'Самовывоз' ? (
                                    <div className="flex items-center space-x-2">
                                        <input onChange={handleChangeRadio} value="3" type="radio" id="shipping" disabled={orderStatus > 3} checked={orderStatus === 3} name="orderStatus" className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                        <label htmlFor="shipping" className={clsx("text-[15px] font-medium", orderStatus > 3 && "text-gray-400")}>Доставляється</label>
                                    </div>
                                ): (
                                    <div className="flex items-center space-x-2">
                                        <input onChange={handleChangeRadio} value="4" type="radio" id="waiting" disabled={orderStatus > 4} checked={orderStatus === 4} name="orderStatus" className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                        <label htmlFor="waiting" className={clsx("text-[15px] font-medium", orderStatus > 4 && "text-gray-400")}>Очікує</label>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <input onChange={handleChangeRadio} value="5" type="radio" id="complete" disabled={orderStatus > 5} checked={orderStatus === 5} name="orderStatus" className="h-4 w-4 rounded-full border-gray-300 text-rose-400 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 focus:ring-offset-0 disabled:cursor-not-allowed disabled:text-gray-400" />
                                    <label htmlFor="complete" className={clsx("text-[15px] font-medium", orderStatus > 5 && "text-gray-400")}>Завершений</label>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleChangeStatus}
                            type="submit"
                            className="border border-rose-400 text-white bg-rose-400 px-4 py-2 rounded transition-colors hover:bg-rose-500"
                        >
                            Змінити статус
                        </button>
                    </form>
                    <div className="flex-1">
                        <h3 className="font-bold text-[16px]">Інформація про товари</h3>
                        <div className="pt-6 flex flex-col gap-y-2">
                            {order.products.map((item, index) => (
                                item.product_id && (
                                    <div key={index} className={clsx("flex flex-col gap-y-2", index < order.products.length -1 && "border-b border-rose-400 pb-2")}>
                                        <div className="flex gap-x-4">
                                            <div className="w-[120px] h-[120px]">
                                                <Image src={`${process.env.ADMIN_ENDPOINT_BACKEND}/images/${item.product_id.image}`}
                                                       alt="Product Image"
                                                       width={0}
                                                       height={0}
                                                       sizes="100vw"
                                                       style={{
                                                           width: "120px",
                                                           height: "auto",
                                                           objectFit: "cover",
                                                           borderRadius: "8px",
                                                           objectPosition: "center center",
                                                           aspectRatio: "1 / 1",
                                                       }}
                                                       priority
                                                />
                                            </div>
                                            <div className="flex flex-col justify-center gap-y-2">
                                                <p>Назва: {item.product_id.title}</p>
                                                <p>Варіант: {item.productVariant.title}</p>
                                                <p>Кількість: {item.count} одиниць(-ці)</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[16px]">Склад товару</h3>
                                            {item.product_id.variants.find((variant: any) => variant._id === item.productVariant.id)?.ingredients.map((ing: any, index: number) => (
                                                <p key={index}>{ing.ingredient.id.title} - {ing.ingredient.variantID.vType} - {ing.count}</p>
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div>Помилка отримання замовлення</div>
        )}
    </div>
}

export default Page;