'use client';

import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import BasicTable from "@/components/admin/BasicTable/BasicTable";
import {createColumnHelper} from "@tanstack/react-table";
import {formatDate} from "@/utils/formatDate";
import {useOrdersStore} from "@/utils/zustand-store/orders";
import socket from "@/utils/socket";
import {useEffect} from "react";
import useToast from "@/hooks/useToast";
import {useRouter} from "next/navigation";
import Loader from "@/components/Loader/Loader";

type Order = {
    _id: string;
    userID: string;
    description: string;
    phoneNumber: string;
    userFullName: string;
    shippingAddress: string;
    products: [{
        product_id: any;
        productVariant: {
            title: string;
            id: any;
        };
        count: number;
    }];
    payment: {
        status: boolean;
        amount: string;
        liqpayPaymentID: string;
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
}),
    columnHelper.accessor('createdAt', {
        header: 'Дата створення', cell: (data) => {
            return formatDate(data.getValue())
        }
    }),
    columnHelper.accessor('userFullName', {
        header: "Ім'я та прізвище", cell: (data) => data.getValue()
    }),
    columnHelper.accessor('phoneNumber', {
        header: "Номер телефону", cell: (data) => data.getValue()
    })
]

const Page = () => {
    const {orders, setOrders, addOrder} = useOrdersStore();
    const router = useRouter();
    const {data, isLoading} = useQuery({
        queryKey: ['orders'], queryFn: async () => {
            const {data} = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/orders`, {
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Access-Control-Allow-Origin': '*'
                }, withCredentials: true
            })

            setOrders(data);

            return data;
        }
    });
    useEffect(() => {
        socket.on('update', async (data) => {
            console.log('Real-time update received:', data);
            // Handle the update as needed
            console.log(data);
            const response = await axios.get(`${process.env.ADMIN_ENDPOINT_BACKEND}/order/${data._id}`)

            addOrder(response.data);
        });
    }, []);

    const onClickDetails = (id: string) => {
        router.push(`/admin/orders/${id}`);
    }

    if (isLoading) {
        return <Loader/>
    }

    return <div className="flex-1 p-6 text-[14px]">
        <BasicTable onClickDetails={onClickDetails} data={orders} columns={columns} isOrders={true}/>
    </div>
}

export default Page;