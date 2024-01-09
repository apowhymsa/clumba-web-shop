'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import useToast from "@/hooks/useToast";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import {createColumnHelper} from "@tanstack/react-table";
import {formatDate} from "@/utils/formatDate";
import Loader from "@/components/Loader/Loader";

type Order = {
    _id: string;
    userID: string;
    description: string;
    phoneNumber: string;
    userFullName: string;
    shippingAddress: string;
    products: [{
        product_id: any; productVariant: {
            title: string; id: any;
        }; count: number;
    }];
    payment: {
        status: boolean; amount: string; liqpayPaymentID: string;
    };
    status: string;
    createdAt: string
}

const columnHelper = createColumnHelper<Order>();

const columns = [columnHelper.accessor('_id', {
    header: '№ товару', cell: (data) => data.getValue()
}), columnHelper.accessor('payment', {
    header: '№ замовлення', cell: (data) => {
        return data.getValue()?.liqpayPaymentID;
    }
}), columnHelper.accessor('createdAt', {
    header: 'Дата створення', cell: (data) => {
        return formatDate(data.getValue())
    }
}), columnHelper.accessor('description', {
    header: "Опис", cell: (data) => data.getValue().split(':')[1]
}), columnHelper.accessor('status', {
    header: "Статус замовлення", cell: (data) => {
        switch (data.getValue()) {
            case 'processing': {
                return <div className="flex justify-center">
                        <span className="bg-gray-200 px-2 py-1 rounded text-gray-700">
                        В обробці
                    </span>
                </div>
            }
            case 'packing': {
                return <div className="flex justify-center">
                        <span className="bg-[#d3e5ef] px-2 py-1 rounded text-[#183347]">
                        Комплектується
                    </span>
                </div>
            }
            case 'shipping': {
                return <div className="flex justify-center">
                        <span className="bg-[#fdecc8] px-2 py-1 rounded text-[#574430]">
                        Доставляється
                    </span>
                </div>
            }
            case 'waiting': {
                return <div className="flex justify-center">
                        <span className="bg-gray-200 px-2 py-1 rounded text-gray-700">
                        Очікує в магазині
                    </span>
                </div>
            }
            case 'complete': {
                return <div className="flex justify-center">
                        <span className="bg-[#dbeddb] px-2 py-1 rounded text-[#3f5a49]">
                        Завершено
                    </span>
                </div>
            }
        }
    }
})]
const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const {error} = useToast();

    useEffect(() => {
        const getUserOrders = async () => {
            setLoading(true);
            const userID = localStorage.getItem('authUserId');

            if (userID) {
                try {
                    const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/userOrders/${userID}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'ngrok-skip-browser-warning': 'true',
                            'Access-Control-Allow-Origin': '*'
                        }, withCredentials: true
                    });
                    setOrders(response.data);
                } catch (err) {
                    console.log(err);
                    error('Помилка завантаження історії замовлень');
                }
            }
        }

        Promise.all([getUserOrders()]).finally(() => setLoading(false));
    }, []);

    if (isLoading) {
        return <Loader/>
    }

    return <div>
        {orders.length <= 0 ? (<div className="flex justify-center">Історія замовлень порожня</div>) : (
            <BasicTable isOrderHistory={true} data={orders} columns={columns}/>)}
    </div>
}
export default OrderHistory;